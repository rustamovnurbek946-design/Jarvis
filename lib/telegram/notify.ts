import { bot } from "./bot";

/** Best-effort Telegram send; never throws. */
export async function sendTelegram(
  chatId: string,
  text: string,
): Promise<void> {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN) return;
    await bot.api.sendMessage(chatId, text);
  } catch (err) {
    console.error("sendTelegram failed:", err);
  }
}
