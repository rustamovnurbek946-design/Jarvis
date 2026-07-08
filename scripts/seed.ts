import { config } from "dotenv";
config({ path: ".env.local" });

import { db, users, goals, tasks } from "../lib/db";

async function main() {
  const [demoUser] = await db
    .insert(users)
    .values({
      name: "Demo User",
      email: "demo@maqsadlarim.uz",
      locale: "uz",
      timezone: "Asia/Tashkent",
    })
    .returning();

  const seededGoals = await db
    .insert(goals)
    .values([
      {
        userId: demoUser.id,
        title: "Ingliz tilini B2 darajaga yetkazish",
        description: "Har kuni 30 daqiqa mashq, haftada 2 ta suhbat darsi.",
        type: "yearly",
        year: 2026,
        domain: "Ta'lim",
        targetMetric: "B2 sertifikat",
        status: "active",
        progress: 72,
      },
      {
        userId: demoUser.id,
        title: "Marafonga tayyorgarlik",
        description: "Haftada 4 marta yugurish, masofani bosqichma-bosqich oshirish.",
        type: "quarterly",
        year: 2026,
        quarter: 3,
        domain: "Sog'liq",
        targetMetric: "42 km marafon",
        status: "active",
        progress: 45,
      },
      {
        userId: demoUser.id,
        title: "Dizayn tizimini nashr qilish",
        description: "Komponentlar kutubxonasi, hujjatlar va namuna loyiha tayyorlash.",
        type: "quarterly",
        year: 2026,
        quarter: 3,
        domain: "Biznes",
        targetMetric: "v1.0 nashr",
        status: "done",
        progress: 100,
      },
    ])
    .returning();

  const [engGoal, marathonGoal] = seededGoals;

  const seededTasks = await db
    .insert(tasks)
    .values([
      {
        userId: demoUser.id,
        goalId: engGoal.id,
        date: "2026-07-09",
        title: "20 ta yangi ingliz so'zi yodlash",
        priority: 1,
        isTimeBlocked: true,
        startTime: "18:00",
        endTime: "18:30",
        status: "todo",
        source: "manual",
      },
      {
        userId: demoUser.id,
        goalId: marathonGoal.id,
        date: "2026-07-09",
        title: "5 km yugurish mashg'uloti",
        priority: 2,
        isTimeBlocked: false,
        status: "done",
        source: "manual",
      },
      {
        userId: demoUser.id,
        goalId: null,
        date: "2026-07-10",
        title: "Kitobdan 30 bet o'qish",
        priority: 3,
        isTimeBlocked: false,
        status: "todo",
        source: "manual",
      },
    ])
    .returning();

  console.log("Seed tugadi:");
  console.log(`  users: 1 (${demoUser.email})`);
  console.log(`  goals: ${seededGoals.length}`);
  console.log(`  tasks: ${seededTasks.length}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed xatosi:", err);
    process.exit(1);
  });
