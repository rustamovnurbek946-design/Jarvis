import { generateObject } from "ai";
import { z } from "zod";
import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, goals as goalsTable, tasks as tasksTable } from "@/lib/db/schema";
import { planModel } from "./gemini";
import { systemPrompt, buildWeeklyPrompt } from "./prompts";
import { weekRangeISO } from "@/lib/date";

const weeklySchema = z.object({
  summary: z.string(),
  goalUpdates: z.array(
    z.object({
      goalId: z.string(),
      progress: z.number().int().min(0).max(100),
    }),
  ),
});

export type WeeklySummary = z.infer<typeof weeklySchema>;

export async function generateWeeklySummary(
  userId: string,
): Promise<WeeklySummary> {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) throw new Error("User not found");

  const { weekStartISO, weekEndISO } = weekRangeISO(user.timezone);

  const goals = await db
    .select()
    .from(goalsTable)
    .where(and(eq(goalsTable.userId, userId), eq(goalsTable.status, "active")));

  const weekTasks = await db
    .select()
    .from(tasksTable)
    .where(
      and(
        eq(tasksTable.userId, userId),
        gte(tasksTable.date, weekStartISO),
        lte(tasksTable.date, weekEndISO),
      ),
    );

  const { object } = await generateObject({
    model: planModel,
    schema: weeklySchema,
    system: systemPrompt(user.locale),
    prompt: buildWeeklyPrompt({
      locale: user.locale,
      goals,
      weekTasks,
      weekStartISO,
      weekEndISO,
    }),
  });

  const result = object as WeeklySummary;
  const validIds = new Set(goals.map((g) => g.id));

  // Apply suggested progress updates
  for (const upd of result.goalUpdates) {
    if (validIds.has(upd.goalId)) {
      await db
        .update(goalsTable)
        .set({ progress: upd.progress })
        .where(eq(goalsTable.id, upd.goalId));
    }
  }

  return result;
}
