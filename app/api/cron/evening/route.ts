import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { isNotNull } from "drizzle-orm";
import { sendTelegram } from "@/lib/telegram/notify";
import { botT } from "@/lib/telegram/messages";
import { isAuthorizedCron } from "@/lib/cron";

export const runtime = "nodejs";

// Evening check-in: ask each linked user how their day went.
export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const linked = await db
    .select()
    .from(users)
    .where(isNotNull(users.telegramChatId));

  for (const user of linked) {
    if (user.telegramChatId) {
      await sendTelegram(user.telegramChatId, botT(user.locale).eveningPrompt);
    }
  }

  return Response.json({ notified: linked.length });
}
