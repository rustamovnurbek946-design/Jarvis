/**
 * One-off setup script: registers a persistent "Ilova" menu button on the
 * bot's chat screen that opens the web app as a Telegram Mini App.
 * NEXT_PUBLIC_APP_URL must be a public HTTPS URL (Telegram rejects localhost).
 *
 * Usage: npx tsx scripts/set-menu-button.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { bot } from "../lib/telegram/bot";
import { getMiniAppUrl } from "../lib/telegram/miniapp-url";

async function main() {
  const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!rawAppUrl) throw new Error("NEXT_PUBLIC_APP_URL is not set in .env.local");
  if (!rawAppUrl.startsWith("https://")) {
    throw new Error(
      `NEXT_PUBLIC_APP_URL must be https:// for Telegram Mini Apps, got: ${rawAppUrl}`,
    );
  }
  const appUrl = getMiniAppUrl()!;

  await bot.api.setChatMenuButton({
    menu_button: {
      type: "web_app",
      text: "Ilova",
      web_app: { url: appUrl },
    },
  });
  console.log(`Menu button set to open Mini App at ${appUrl}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
