import { generateText, generateObject } from "ai";
import { planModel } from "./gemini";
import { goalDraftSchema, type GoalDraftAI } from "./schemas";
import type { User, GoalDraft } from "@/lib/db/schema";
import { todayISO } from "@/lib/date";

export class EmptyTranscriptError extends Error {}

/**
 * Transcribes a Telegram voice note (OGG/Opus) verbatim, in whichever
 * language it was spoken in. Gemini understands audio input natively, so no
 * separate speech-to-text provider is needed.
 */
export async function transcribeVoice(audio: Buffer): Promise<string> {
  const { text } = await generateText({
    model: planModel,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              "Transcribe this audio message verbatim, in the language it was " +
              "spoken in (Uzbek, Russian, or English). Return only the " +
              "transcript text, no commentary, no quotes.",
          },
          { type: "file", mediaType: "audio/ogg", data: audio },
        ],
      },
    ],
  });
  return text.trim();
}

function currentQuarter(month: number): number {
  return Math.ceil(month / 3);
}

/**
 * Extracts structured goal fields (title, type, year, quarter, domain, ...)
 * from a voice-message transcript via Gemini structured output. Relative
 * date expressions ("this year", "bu chorak") are resolved against the
 * user's current local date/quarter.
 */
export async function extractGoalDraft(
  transcript: string,
  user: User,
): Promise<GoalDraft> {
  if (!transcript) throw new EmptyTranscriptError("Transcript is empty");

  const today = todayISO(user.timezone);
  const [yearStr, monthStr] = today.split("-");
  const year = Number(yearStr);
  const quarter = currentQuarter(Number(monthStr));

  const { object } = await generateObject({
    model: planModel,
    schema: goalDraftSchema,
    system:
      "You extract a personal goal from a short voice-message transcript so " +
      "it can be added to the user's goal tracker. Reply in the same " +
      `language as the transcript. Today's date is ${today} (current year ` +
      `${year}, current quarter Q${quarter}). Resolve relative expressions ` +
      "like 'this year' / 'bu yil' / 'shu yil' or 'this quarter' / " +
      "'bu chorak' / 'shu kvartal' using that context. If nothing suggests " +
      "a specific quarter, use type 'yearly' and the current year.",
    prompt: transcript,
  });

  const draft: GoalDraftAI = object;
  return {
    title: draft.title,
    description: draft.description ?? null,
    type: draft.type,
    year: draft.year,
    quarter: draft.type === "quarterly" ? (draft.quarter ?? quarter) : null,
    domain: draft.domain ?? null,
    targetMetric: draft.targetMetric ?? null,
  };
}
