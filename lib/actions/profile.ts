"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, users } from "@/lib/db";
import { auth } from "@/auth";

const MAX_LENGTH = 8000;

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Kirish talab qilinadi");
  return session.user.id;
}

export async function getProfile() {
  const userId = await requireUserId();
  const [user] = await db
    .select({
      knowledgeBase: users.knowledgeBase,
      agentInstructions: users.agentInstructions,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return {
    knowledgeBase: user?.knowledgeBase ?? "",
    agentInstructions: user?.agentInstructions ?? "",
  };
}

export async function updateKnowledgeBase(value: string) {
  const userId = await requireUserId();
  await db
    .update(users)
    .set({ knowledgeBase: value.slice(0, MAX_LENGTH) })
    .where(eq(users.id, userId));
  revalidatePath("/knowledge");
}

export async function updateAgentInstructions(value: string) {
  const userId = await requireUserId();
  await db
    .update(users)
    .set({ agentInstructions: value.slice(0, MAX_LENGTH) })
    .where(eq(users.id, userId));
  revalidatePath("/knowledge");
}
