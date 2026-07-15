"use server";

import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { db, telegramLoginTokens } from "@/lib/db";

const TOKEN_TTL_MS = 5 * 60 * 1000; // 5 minutes

export interface StartTelegramLoginResult {
  token: string;
  deepLink: string;
}

/** Creates a one-time login token and the Telegram deep link to redeem it. */
export async function startTelegramLogin(): Promise<StartTelegramLoginResult> {
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
  if (!botUsername) {
    throw new Error("NEXT_PUBLIC_TELEGRAM_BOT_USERNAME sozlanmagan");
  }

  const token = randomBytes(24).toString("hex");
  await db.insert(telegramLoginTokens).values({
    token,
    expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
  });

  return {
    token,
    deepLink: `https://t.me/${botUsername}?start=login_${token}`,
  };
}

export type TelegramLoginStatus = "pending" | "approved" | "expired";

/** Polled by the /login page while the user is confirming inside Telegram. */
export async function checkTelegramLoginStatus(
  token: string,
): Promise<TelegramLoginStatus> {
  const [row] = await db
    .select()
    .from(telegramLoginTokens)
    .where(eq(telegramLoginTokens.token, token))
    .limit(1);

  if (!row || row.expiresAt < new Date()) return "expired";
  if (row.approvedUserId && !row.consumedAt) return "approved";
  return "pending";
}
