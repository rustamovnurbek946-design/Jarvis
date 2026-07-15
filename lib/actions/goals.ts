"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, goals } from "@/lib/db";
import { auth } from "@/auth";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Kirish talab qilinadi");
  return session.user.id;
}

export type GoalStatus = "active" | "done";

export interface GoalItem {
  id: string;
  title: string;
  desc: string;
  due: string;
  progress: number;
  status: GoalStatus;
}

export interface GoalFormValues {
  title: string;
  desc: string;
  due: string;
  progress: number;
  status: GoalStatus;
}

export async function createGoalAction(values: GoalFormValues) {
  const userId = await requireUserId();
  await db.insert(goals).values({
    userId,
    title: values.title,
    description: values.desc,
    targetMetric: values.due,
    progress: values.progress,
    status: values.status,
    type: "yearly",
    year: new Date().getFullYear(),
  });
  revalidatePath("/");
}

export async function updateGoalAction(id: string, values: GoalFormValues) {
  const userId = await requireUserId();
  await db
    .update(goals)
    .set({
      title: values.title,
      description: values.desc,
      targetMetric: values.due,
      progress: values.progress,
      status: values.status,
    })
    .where(and(eq(goals.id, id), eq(goals.userId, userId)));
  revalidatePath("/");
}

export async function deleteGoalAction(id: string) {
  const userId = await requireUserId();
  await db.delete(goals).where(and(eq(goals.id, id), eq(goals.userId, userId)));
  revalidatePath("/");
}
