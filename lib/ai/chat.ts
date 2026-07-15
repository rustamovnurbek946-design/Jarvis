import { generateText } from "ai";
import { planModel } from "./gemini";
import type { User } from "@/lib/db/schema";

const LANG_NAME: Record<User["locale"], string> = {
  uz: "Uzbek",
  ru: "Russian",
  en: "English",
};

function buildChatSystemPrompt(user: User): string {
  const parts = [
    `You are "Jarvis", ${user.name ?? "the user"}'s personal AI assistant, ` +
      `reachable via Telegram. Answer naturally and concisely in ` +
      `${LANG_NAME[user.locale]}.`,
  ];

  if (user.agentInstructions?.trim()) {
    parts.push(
      `\nCUSTOM INSTRUCTIONS FROM THE USER (follow these closely):\n${user.agentInstructions.trim()}`,
    );
  }

  if (user.knowledgeBase?.trim()) {
    parts.push(
      `\nREFERENCE MATERIAL (the user's personal knowledge base — use it to ` +
        `answer when relevant, don't invent facts that contradict it):\n${user.knowledgeBase.trim()}`,
    );
  }

  return parts.join("\n");
}

/** Answers a free-form question from the user, via Telegram or elsewhere. */
export async function answerUserQuestion(
  user: User,
  question: string,
): Promise<string> {
  const { text } = await generateText({
    model: planModel,
    system: buildChatSystemPrompt(user),
    prompt: question,
  });
  return text;
}
