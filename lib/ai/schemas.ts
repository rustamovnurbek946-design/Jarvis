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
