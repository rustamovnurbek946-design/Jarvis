import { Bot, InlineKeyboard } from "grammy";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, tasks as tasksTable, dailyLogs } from "@/lib/db/schema";
import { botT } from "./messages";
import { todayISO } from "@/lib/date";
import { generatePlanForUser } from "@/lib/ai/generatePlan";

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

function registerHandlers(bot: Bot) {
  bot.command("start", async (ctx) => {
    const chatId = String(ctx.chat.id);
    const user = await findUserByChat(chatId);
    const locale = user?.locale ?? "uz";
    await ctx.reply(botT(locale).start);
  });

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

  // Free text: link code OR daily journal entry
  bot.on("message:text", async (ctx) => {
    const chatId = String(ctx.chat.id);
    const text = ctx.message.text.trim();
    const existing = await findUserByChat(chatId);

    if (!existing) {
      // Try to interpret text as a link code
      const [match] = await db
        .select()
        .from(users)
        .where(eq(users.telegramLinkCode, text))
        .limit(1);
      if (match) {
        await db
          .update(users)
          .set({ telegramChatId: chatId, telegramLinkCode: null })
          .where(eq(users.id, match.id));
        return ctx.reply(botT(match.locale).linked);
      }
      return ctx.reply(botT("uz").notLinked);
    }

    // Append to today's daily log free text
    const t = botT(existing.locale);
    const day = todayISO(existing.timezone);
    const [log] = await db
      .select()
      .from(dailyLogs)
      .where(
        and(eq(dailyLogs.userId, existing.id), eq(dailyLogs.date, day)),
      )
      .limit(1);

    if (log) {
      const combined = log.freeText ? `${log.freeText}\n${text}` : text;
      await db
        .update(dailyLogs)
        .set({ freeText: combined })
        .where(eq(dailyLogs.id, log.id));
    } else {
      await db
        .insert(dailyLogs)
        .values({ userId: existing.id, date: day, freeText: text });
    }
    await ctx.reply(t.logSaved);
  });
}
