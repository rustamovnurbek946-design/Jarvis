import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { generatePlanForUser } from "@/lib/ai/generatePlan";
import { sendTelegram } from "@/lib/telegram/notify";
import { botT } from "@/lib/telegram/messages";
import { isAuthorizedCron } from "@/lib/cron";

export const runtime = "nodejs";
export const maxDuration = 300;

// Runs nightly: analyze today + generate tomorrow's plan for every user,
// then notify the user via Telegram (if linked).
export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const allUsers = await db.select().from(users);
  const results: { userId: string; ok: boolean; error?: string }[] = [];

  for (const user of allUsers) {
    try {
      const plan = await generatePlanForUser(user.id);
      if (user.telegramChatId) {
        const t = botT(user.locale);
        const note = plan.analysis.motivationNote;
        await sendTelegram(
          user.telegramChatId,
          `${t.planDone}\n\n💡 ${note}`,
        );
      }
      results.push({ userId: user.id, ok: true });
    } catch (err) {
      console.error("nightly failed for user", user.id, err);
      results.push({ userId: user.id, ok: false, error: String(err) });
    }
  }

  return Response.json({ ran: results.length, results });
}
