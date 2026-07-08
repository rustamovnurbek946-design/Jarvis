import { eq } from "drizzle-orm";
import { db, users } from "@/lib/db";

/**
 * Temporary stand-in for a real session until Auth.js login is wired into
 * these pages (Sprint 2). All pages currently act as this single seeded
 * demo user (see scripts/seed.ts).
 */
const DEMO_USER_EMAIL = "demo@maqsadlarim.uz";

export async function getDemoUserId(): Promise<string> {
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, DEMO_USER_EMAIL))
    .limit(1);

  if (!user) {
    throw new Error(
      `Demo user (${DEMO_USER_EMAIL}) topilmadi. Avval "npm run db:seed" ishga tushiring.`,
    );
  }
  return user.id;
}
