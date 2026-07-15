export function isTelegramMiniApp(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.Telegram?.WebApp?.initData);
}

export function getTelegramInitData(): string | null {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp?.initData || null;
}
