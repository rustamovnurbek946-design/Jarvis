import { webhookCallback } from "grammy";
import { bot } from "@/lib/telegram/bot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handleUpdate = webhookCallback(bot, "std/http", {
  secretToken: process.env.TELEGRAM_WEBHOOK_SECRET,
});

export async function POST(req: Request): Promise<Response> {
  try {
    return await handleUpdate(req);
  } catch (err) {
    console.error("Telegram webhook error:", err);
    return new Response("ok", { status: 200 });
  }
}
