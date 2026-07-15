import { Bot, InlineKeyboard, type Context } from "grammy";
import { and, eq, isNull, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  users,
  tasks as tasksTable,
  dailyLogs,
  telegramLoginTokens,
} from "@/lib/db/schema";
import { botT } from "./messages";
import { todayISO } from "@/lib/date";
import { generatePlanForUser } from "@/lib/ai/generatePlan";
import { answerUserQuestion } from "@/lib/ai/chat";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.warn("TELEGRAM_BOT_TOKEN is not set — Telegram bot disabled.");
}

// Reuse a single Bot instance across hot reloads / warm lambdas.
const globalForBot = globalThis as unknown as { __jarvisBot?: Bot };

export const bot: Bot =
  globalForBot.__jarvisBot ?? new Bot(token ?? "missing-token");

if (!globalForBot.__jarvisBot && token) {
  registerHandlers(bot);
  globalForBot.__jarvisBot = bot;
}

async function findUserByChat(chatId: string) {
  const [u] = await db
    .select()
    .from(users)
    .where(eq(users.telegramChatId, chatId))
    .limit(1);
  return u ?? null;
}

function isAllowedTelegramUsername(username: string | undefined): boolean {
  const allowed = (process.env.ALLOWED_TELEGRAM_USERNAMES ?? "")
    .split(",")
    .map((s) => s.trim().replace(/^@/, "").toLowerCase())
    .filter(Boolean);
  if (allowed.length === 0) return true; // no allowlist configured = open
  if (!username) return false;
  return allowed.includes(username.toLowerCase());
}

function registerHandlers(bot: Bot) {
  bot.command("start", async (ctx) => {
    const chatId = String(ctx.chat.id);
    const payload = ctx.match;

    if (typeof payload === "string" && payload.startsWith("login_")) {
      return handleLoginDeepLink(ctx, chatId, payload.slice("login_".length));
    }

    const user = await findUserByChat(chatId);
    const locale = user?.locale ?? "uz";
    await ctx.reply(botT(locale).start);
  });

  async function handleLoginDeepLink(
    ctx: Context,
    chatId: string,
    loginToken: string,
  ) {
    let user = await findUserByChat(chatId);

    if (!user) {
      const username = ctx.from?.username;
      if (!isAllowedTelegramUsername(username)) {
        return ctx.reply(botT("uz").loginNotAllowed);
      }
      const [created] = await db
        .insert(users)
        .values({
          name: ctx.from?.first_name ?? "Foydalanuvchi",
          telegramChatId: chatId,
          telegramUsername: username ?? null,
        })
        .returning();
      user = created;
    }

    const t = botT(user.locale);
    const [tokenRow] = await db
      .select()
      .from(telegramLoginTokens)
      .where(
        and(
          eq(telegramLoginTokens.token, loginToken),
          isNull(telegramLoginTokens.consumedAt),
          gt(telegramLoginTokens.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!tokenRow) {
      return ctx.reply(t.loginExpired);
    }

    await db
      .update(telegramLoginTokens)
      .set({ approvedUserId: user.id })
      .where(eq(telegramLoginTokens.token, loginToken));

    await ctx.reply(t.loginApproved);
  }

  bot.command("today", async (ctx) => {
    const user = await findUserByChat(String(ctx.chat.id));
    if (!user) return ctx.reply(botT("uz").notLinked);
    const t = botT(user.locale);
    const day = todayISO(user.timezone);
    const todays = await db
      .select()
      .from(tasksTable)
      .where(and(eq(tasksTable.userId, user.id), eq(tasksTable.date, day)));

    if (todays.length === 0) return ctx.reply(t.noTasks);

    const sorted = todays.sort((a, b) => a.order - b.order);
    let text = `${t.todayTitle}\n\n`;
    const kb = new InlineKeyboard();
    for (const task of sorted) {
      const mark = task.status === "done" ? "✅" : "⬜️";
      const time =
        task.isTimeBlocked && task.startTime
          ? ` (${task.startTime}-${task.endTime})`
          : "";
      text += `${mark} ${task.title}${time}\n`;
      if (task.status !== "done") {
        kb.text(`✓ ${task.title.slice(0, 24)}`, `done:${task.id}`).row();
      }
    }
    await ctx.reply(text, { reply_markup: kb });
  });

  bot.command("plan", async (ctx) => {
    const user = await findUserByChat(String(ctx.chat.id));
    if (!user) return ctx.reply(botT("uz").notLinked);
    const t = botT(user.locale);
    await ctx.reply(t.planning);
    try {
      await generatePlanForUser(user.id);
      await ctx.reply(t.planDone);
    } catch (err) {
      console.error("plan via telegram failed", err);
      await ctx.reply("⚠️ " + String(err));
    }
  });

  // Explicit daily-journal command (free text is now reserved for Q&A below).
  bot.command("kun", async (ctx) => {
    const user = await findUserByChat(String(ctx.chat.id));
    if (!user) return ctx.reply(botT("uz").notLinked);
    const t = botT(user.locale);
    const logText = ctx.match?.trim();
    if (!logText) return ctx.reply(t.kunUsage);

    const day = todayISO(user.timezone);
    const [log] = await db
      .select()
      .from(dailyLogs)
      .where(and(eq(dailyLogs.userId, user.id), eq(dailyLogs.date, day)))
      .limit(1);

    if (log) {
      const combined = log.freeText ? `${log.freeText}\n${logText}` : logText;
      await db
        .update(dailyLogs)
        .set({ freeText: combined })
        .where(eq(dailyLogs.id, log.id));
    } else {
      await db
        .insert(dailyLogs)
        .values({ userId: user.id, date: day, freeText: logText });
    }
    await ctx.reply(t.logSaved);
  });

  // Toggle a task done from inline buttons
  bot.callbackQuery(/^done:(.+)$/, async (ctx) => {
    const user = await findUserByChat(String(ctx.chat?.id));
    const taskId = ctx.match![1];
    if (user) {
      await db
        .update(tasksTable)
        .set({ status: "done" })
        .where(
          and(eq(tasksTable.id, taskId), eq(tasksTable.userId, user.id)),
        );
      await ctx.answerCallbackQuery({ text: botT(user.locale).markedDone });
    } else {
      await ctx.answerCallbackQuery();
    }
  });

  // Any other free text: answered via Gemini using the user's knowledge
  // base + agent instructions (see lib/ai/chat.ts). Daily journaling now
  // goes through the explicit /kun command above.
  bot.on("message:text", async (ctx) => {
    const chatId = String(ctx.chat.id);
    const text = ctx.message.text.trim();
    const user = await findUserByChat(chatId);

    if (!user) {
      return ctx.reply(botT("uz").notLinked);
    }

    const t = botT(user.locale);
    await ctx.replyWithChatAction("typing");
    try {
      const answer = await answerUserQuestion(user, text);
      await ctx.reply(answer);
    } catch (err) {
      console.error("gemini chat failed", err);
      await ctx.reply(t.chatError);
    }
  });
}
