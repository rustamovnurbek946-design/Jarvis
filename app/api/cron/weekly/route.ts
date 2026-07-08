import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { generateWeeklySummary } from "@/lib/ai/weeklySummary";
import { sendTelegram } from "@/lib/telegram/notify";
import { isAuthorizedCron } from "@/lib/cron";

export const runtime = "nodejs";
export const maxDuration = 300;

// Weekly review: summarize the week + update goal progress, notify via Telegram.
export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const allUsers = await db.select().from(users);
  const results: { userId: string; ok: boolean }[] = [];

  for (const user of allUsers) {
    try {
      const summary = await generateWeeklySummary(user.id);
      if (user.telegramChatId) {
        await sendTelegram(user.telegramChatId, `📊 ${summary.summary}`);
      }
      results.push({ userId: user.id, ok: true });
    } catch (err) {
      console.error("weekly failed for", user.id, err);
      results.push({ userId: user.id, ok: false });
    }
  }

  return Response.json({ ran: results.length, results });
}
