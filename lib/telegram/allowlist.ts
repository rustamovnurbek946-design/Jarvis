export function isAllowedTelegramUsername(username: string | undefined): boolean {
  const allowed = (process.env.ALLOWED_TELEGRAM_USERNAMES ?? "")
    .split(",")
    .map((s) => s.trim().replace(/^@/, "").toLowerCase())
    .filter(Boolean);
  if (allowed.length === 0) return true; // no allowlist configured = open
  if (!username) return false;
  return allowed.includes(username.toLowerCase());
}
