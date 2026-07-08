import { generateObject } from "ai";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  users,
  goals as goalsTable,
  tasks as tasksTable,
  dailyLogs,
  type DailyAnalysis,
} from "@/lib/db/schema";
import { planModel } from "./gemini";
import { planResultSchema, type PlanResult } from "./schemas";
import { systemPrompt, buildPlanPrompt } from "./prompts";
import { todayISO, addDaysISO, dayRangeUTC } from "@/lib/date";
import { getBusySlots, createCalendarEvent } from "@/lib/google/calendar";

/**
 * Analyze the user's day and generate tomorrow's plan.
 * Persists the analysis onto today's daily log and inserts tomorrow's tasks
 * (creating calendar events for time-blocked ones).
 */
export async function generatePlanForUser(
  userId: string,
  opts?: { referenceDateISO?: string; writeCalendar?: boolean },
): Promise<PlanResult> {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) throw new Error("User not found");

  const locale = user.locale;
  const timezone = user.timezone;
  const today = opts?.referenceDateISO ?? todayISO(timezone);
  const tomorrow = addDaysISO(today, 1);

  // Active goals
  const goals = await db
    .select()
    .from(goalsTable)
    .where(and(eq(goalsTable.userId, userId), eq(goalsTable.status, "active")));

  // Today's tasks
  const todayTasks = await db
    .select()
    .from(tasksTable)
    .where(and(eq(tasksTable.userId, userId), eq(tasksTable.date, today)));

  // Today's daily log (free text)
  const [dailyLog] = await db
    .select()
    .from(dailyLogs)
    .where(and(eq(dailyLogs.userId, userId), eq(dailyLogs.date, today)))
    .limit(1);

  // Tomorrow busy slots from Google Calendar
  const { startISO, endISO } = dayRangeUTC(tomorrow, timezone);
  const busySlots = await getBusySlots(userId, startISO, endISO, timezone);

  // Call Gemini for structured output
  const { object } = await generateObject({
    model: planModel,
    schema: planResultSchema,
    system: systemPrompt(locale),
    prompt: buildPlanPrompt({
      locale,
      todayISO: today,
      tomorrowISO: tomorrow,
      timezone,
      goals,
      todayTasks,
      dailyLog: dailyLog ?? null,
      busySlots,
    }),
  });

  const result = object as PlanResult;
  const validGoalIds = new Set(goals.map((g) => g.id));

  // 1) Persist analysis onto today's daily log (upsert).
  const analysis: DailyAnalysis = result.analysis;
  if (dailyLog) {
    await db
      .update(dailyLogs)
      .set({ aiAnalysis: analysis })
      .where(eq(dailyLogs.id, dailyLog.id));
  } else {
    await db.insert(dailyLogs).values({
      userId,
      date: today,
      freeText: null,
      aiAnalysis: analysis,
    });
  }

  // 2) Replace previously AI-generated tasks for tomorrow to avoid duplicates.
  await db
    .delete(tasksTable)
    .where(
      and(
        eq(tasksTable.userId, userId),
        eq(tasksTable.date, tomorrow),
        eq(tasksTable.source, "ai"),
      ),
    );

  // 3) Insert tomorrow's tasks.
  let order = 0;
  for (const t of result.tomorrowTasks) {
    const goalId =
      t.goalId && validGoalIds.has(t.goalId) ? t.goalId : null;
    const isTimeBlocked = Boolean(
      t.isTimeBlocked && t.startTime && t.endTime,
    );

    let calendarEventId: string | null = null;
    if (isTimeBlocked && (opts?.writeCalendar ?? true)) {
      calendarEventId = await createCalendarEvent(userId, {
        summary: t.title,
        description: t.description ?? undefined,
        dateISO: tomorrow,
        startTime: t.startTime!,
        endTime: t.endTime!,
        timezone,
      });
    }

    await db.insert(tasksTable).values({
      userId,
      goalId,
      date: tomorrow,
      title: t.title,
      description: t.description ?? null,
      priority: t.priority,
      isTimeBlocked,
      startTime: isTimeBlocked ? t.startTime : null,
      endTime: isTimeBlocked ? t.endTime : null,
      status: "todo",
      source: "ai",
      calendarEventId,
      order: order++,
    });
  }

  return result;
}
