/**
 * Local dev-only entry point: runs the bot via long-polling instead of the
 * webhook route, since Telegram webhooks require a public HTTPS URL that
 * `localhost` can't provide. Production uses app/api/telegram/route.ts +
 * a real setWebhook call against the deployed Vercel URL instead.
 *
 * Usage: npm run bot:dev
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { bot } from "../lib/telegram/bot";

bot.start();
console.log("Jarvis bot polling rejimida ishga tushdi (Ctrl+C bilan to'xtatish).");
