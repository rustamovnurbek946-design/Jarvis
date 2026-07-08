import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  primaryKey,
  date,
  jsonb,
  time,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

// ---------- Enums ----------
export const localeEnum = pgEnum("locale", ["uz", "ru", "en"]);
export const goalTypeEnum = pgEnum("goal_type", ["yearly", "quarterly"]);
export const goalStatusEnum = pgEnum("goal_status", ["active", "done", "paused"]);
export const taskStatusEnum = pgEnum("task_status", ["todo", "done", "skipped"]);
export const taskSourceEnum = pgEnum("task_source", ["ai", "manual", "telegram"]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "evening",
  "weekly",
  "task",
]);

// ---------- Auth.js (NextAuth) tables ----------
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  // App-specific fields
  locale: localeEnum("locale").notNull().default("uz"),
  timezone: text("timezone").notNull().default("Asia/Tashkent"),
  telegramChatId: text("telegram_chat_id"),
  telegramLinkCode: text("telegram_link_code"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [{ compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }) }],
);

// ---------- App tables ----------
export const goals = pgTable("goals", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  type: goalTypeEnum("type").notNull(),
  year: integer("year").notNull(),
  quarter: integer("quarter"), // 1-4, null for yearly
  parentGoalId: text("parent_goal_id"),
  domain: text("domain"), // free-text tag e.g. "Sog'liq", "Biznes"
  targetMetric: text("target_metric"),
  status: goalStatusEnum("status").notNull().default("active"),
  progress: integer("progress").notNull().default(0), // 0-100
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const tasks = pgTable(
  "tasks",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    goalId: text("goal_id").references(() => goals.id, { onDelete: "set null" }),
    date: date("date").notNull(), // the day this task belongs to (YYYY-MM-DD)
    title: text("title").notNull(),
    description: text("description"),
    priority: integer("priority").notNull().default(2), // 1 high .. 3 low
    isTimeBlocked: boolean("is_time_blocked").notNull().default(false),
    startTime: time("start_time"),
    endTime: time("end_time"),
    status: taskStatusEnum("status").notNull().default("todo"),
    source: taskSourceEnum("source").notNull().default("manual"),
    calendarEventId: text("calendar_event_id"),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("tasks_user_date_idx").on(t.userId, t.date, t.id)],
);

export const dailyLogs = pgTable(
  "daily_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    freeText: text("free_text"),
    // aiAnalysis: { goalAlignment, productivity, balance, motivationNote, scores{...} }
    aiAnalysis: jsonb("ai_analysis").$type<DailyAnalysis | null>(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("daily_logs_user_date_idx").on(t.userId, t.date)],
);

export const notifications = pgTable("notifications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull(),
  sentAt: timestamp("sent_at", { mode: "date" }).notNull().defaultNow(),
  payload: jsonb("payload"),
});

// ---------- Relations ----------
export const usersRelations = relations(users, ({ many }) => ({
  goals: many(goals),
  tasks: many(tasks),
  dailyLogs: many(dailyLogs),
}));

export const goalsRelations = relations(goals, ({ one, many }) => ({
  user: one(users, { fields: [goals.userId], references: [users.id] }),
  parent: one(goals, {
    fields: [goals.parentGoalId],
    references: [goals.id],
    relationName: "goal_parent",
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
  goal: one(goals, { fields: [tasks.goalId], references: [goals.id] }),
}));

export const dailyLogsRelations = relations(dailyLogs, ({ one }) => ({
  user: one(users, { fields: [dailyLogs.userId], references: [users.id] }),
}));

// ---------- Shared types ----------
export type DailyAnalysis = {
  goalAlignment: string;
  productivity: string;
  balance: string;
  motivationNote: string;
  scores: {
    goalAlignment: number; // 0-10
    productivity: number; // 0-10
    balance: number; // 0-10
  };
};

export type User = typeof users.$inferSelect;
export type Goal = typeof goals.$inferSelect;
export type NewGoal = typeof goals.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type DailyLog = typeof dailyLogs.$inferSelect;
