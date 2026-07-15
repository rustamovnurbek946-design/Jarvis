import type { Context } from "grammy";

const MAX_VOICE_DURATION_SECONDS = 120;

export class VoiceTooLongError extends Error {}

/**
 * Downloads a Telegram voice note (always OGG/Opus) via ctx.getFile() and
 * returns it as a Buffer, ready to hand to Gemini as a `file` message part.
 * Throws VoiceTooLongError if the recording exceeds MAX_VOICE_DURATION_SECONDS,
 * without downloading it.
 */
export async function downloadVoiceFile(ctx: Context): Promise<Buffer> {
  const voice = ctx.message?.voice;
  if (!voice) throw new Error("No voice message on this update");

  if (voice.duration > MAX_VOICE_DURATION_SECONDS) {
    throw new VoiceTooLongError(
      `Voice message is ${voice.duration}s, max is ${MAX_VOICE_DURATION_SECONDS}s`,
    );
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not set");

  const file = await ctx.getFile();
  if (!file.file_path) throw new Error("Telegram did not return a file_path");

  const url = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download voice file: ${res.status} ${res.statusText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export { MAX_VOICE_DURATION_SECONDS };
