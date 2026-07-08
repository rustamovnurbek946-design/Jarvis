import { eq } from "drizzle-orm";
import { db, goals } from "@/lib/db";
import { getDemoUserId } from "@/lib/db/demo-user";
import { GoalsPageClient } from "@/components/goals/goals-page-client";
import type { GoalItem } from "@/lib/actions/goals";

export default async function GoalsPage() {
  const userId = await getDemoUserId();
  const rows = await db
    .select()
    .from(goals)
    .where(eq(goals.userId, userId))
    .orderBy(goals.createdAt);

  const initialGoals: GoalItem[] = rows.map((g) => ({
    id: g.id,
    title: g.title,
    desc: g.description ?? "",
    due: g.targetMetric ?? "",
    progress: g.progress,
    status: g.status === "done" ? "done" : "active",
  }));

  return <GoalsPageClient initialGoals={initialGoals} />;
}
