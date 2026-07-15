// Points straight at /login instead of the bare app root: the root page is
// behind an auth guard that server-redirects unauthenticated visitors to
// /login, and that extra redirect hop can drop the Telegram-signed
// `#tgWebAppData=...` fragment before our code ever gets to read it.
export function getMiniAppUrl(): string | null {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) return null;
  return `${appUrl.replace(/\/$/, "")}/login`;
}
