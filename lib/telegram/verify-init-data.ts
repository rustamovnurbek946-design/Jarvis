import { createHmac, timingSafeEqual } from "crypto";

const MAX_AGE_SECONDS = 24 * 60 * 60; // reject initData older than 24h

export interface TelegramInitDataUser {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
}

// Verifies the initData string a Telegram Mini App sends, per Telegram's
// official data-check algorithm: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
export function verifyTelegramInitData(
  initData: string,
  botToken: string,
): TelegramInitDataUser | null {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
  const computedHash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  const computedBuf = Buffer.from(computedHash, "hex");
  const receivedBuf = Buffer.from(hash, "hex");
  if (
    computedBuf.length !== receivedBuf.length ||
    !timingSafeEqual(computedBuf, receivedBuf)
  ) {
    return null;
  }

  const authDate = Number(params.get("auth_date"));
  if (!authDate || Date.now() / 1000 - authDate > MAX_AGE_SECONDS) {
    return null;
  }

  const userJson = params.get("user");
  if (!userJson) return null;
  try {
    const user = JSON.parse(userJson) as {
      id: number;
      username?: string;
      first_name?: string;
      last_name?: string;
    };
    if (!user.id) return null;
    return {
      id: user.id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
    };
  } catch {
    return null;
  }
}
