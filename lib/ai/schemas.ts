import { z } from "zod";

// Structured output the AI must return when generating the next day's plan.
export const dailyAnalysisSchema = z.object({
  goalAlignment: z
    .string()
    .describe("Short paragraph: how well today's work served the active goals"),
  productivity: z
    .string()
    .describe("Short paragraph on completion rate and productivity"),
  balance: z
    .string()
    .describe("Short paragraph on balance across domains and burnout risk"),
  motivationNote: z
    .string()
    .describe("One short motivating, encouraging note to the user"),
  scores: z.object({
    goalAlignment: z.number().min(0).max(10),
    productivity: z.number().min(0).max(10),
    balance: z.number().min(0).max(10),
  }),
});

export const generatedTaskSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  goalId: z
    .string()
    .nullable()
    .optional()
    .describe("id of the related goal from the provided list, or null"),
  priority: z.number().int().min(1).max(3).describe("1=high, 2=medium, 3=low"),
  isTimeBlocked: z
    .boolean()
    .describe("true for important/fixed work that should get a time slot"),
  startTime: z
    .string()
    .nullable()
    .optional()
    .describe("HH:MM 24h, only when isTimeBlocked"),
  endTime: z
    .string()
    .nullable()
    .optional()
    .describe("HH:MM 24h, only when isTimeBlocked"),
});

export const planResultSchema = z.object({
  analysis: dailyAnalysisSchema,
  tomorrowTasks: z
    .array(generatedTaskSchema)
    .describe("5-8 tasks for tomorrow, mixed time-blocked and priority list"),
});

export type PlanResult = z.infer<typeof planResultSchema>;
export type GeneratedTask = z.infer<typeof generatedTaskSchema>;

// Goal fields extracted from a transcribed Telegram voice message.
// Shape mirrors lib/db/schema.ts's GoalDraft type.
export const goalDraftSchema = z.object({
  title: z.string().describe("Short, clear goal title in the user's language"),
  description: z
    .string()
    .nullable()
    .optional()
    .describe("Extra detail from the transcript, or null if none"),
  type: z
    .enum(["yearly", "quarterly"])
    .describe(
      "'yearly' unless the transcript clearly refers to a specific quarter/chorak",
    ),
  year: z.number().int().describe("Calendar year the goal belongs to"),
  quarter: z
    .number()
    .int()
    .min(1)
    .max(4)
    .nullable()
    .optional()
    .describe("1-4, only when type is 'quarterly', otherwise null"),
  domain: z
    .string()
    .nullable()
    .optional()
    .describe("Free-text life domain tag, e.g. 'Sog'liq', 'Biznes', or null if unclear"),
  targetMetric: z
    .string()
    .nullable()
    .optional()
    .describe("How success is measured, if mentioned, otherwise null"),
});

export type GoalDraftAI = z.infer<typeof goalDraftSchema>;
