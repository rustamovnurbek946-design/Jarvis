import type { Goal, Task, DailyLog } from "@/lib/db/schema";

type Locale = "uz" | "ru" | "en";

const LANG_NAME: Record<Locale, string> = {
  uz: "Uzbek",
  ru: "Russian",
  en: "English",
};

export const systemPrompt = (locale: Locale) => `
You are "Jarvis", a thoughtful personal productivity assistant. You help the user
turn their yearly and quarterly goals into a concrete daily plan.

Write ALL natural-language output (analysis text, task titles, descriptions,
motivation) in ${LANG_NAME[locale]}. Be concise, warm, and practical.

Principles:
- Every task you propose should visibly serve one of the user's ACTIVE goals.
  Set goalId to the matching goal's id, or null if it is general upkeep.
- Produce a realistic day: 5-8 tasks. Mark the 2-4 most important / focus tasks as
  time-blocked with a start and end time (HH:MM, 24h). Leave the rest as a
  priority list (isTimeBlocked=false, no times).
- Respect the user's existing calendar busy slots — never schedule a time-blocked
  task that overlaps a busy slot.
- Balance domains across the week; if the user seems overloaded or tired, lighten
  the load and include recovery.
- Base tomorrow on what actually happened today (completed vs not, their notes).
`;

type BuildInput = {
  locale: Locale;
  todayISO: string;
  tomorrowISO: string;
  timezone: string;
  goals: Goal[];
  todayTasks: Task[];
  dailyLog: DailyLog | null;
  busySlots: { start: string; end: string; summary?: string }[];
};

export function buildPlanPrompt(input: BuildInput): string {
  const {
    todayISO,
    tomorrowISO,
    timezone,
    goals,
    todayTasks,
    dailyLog,
    busySlots,
  } = input;

  const goalLines = goals.length
    ? goals
        .map(
          (g) =>
            `- [${g.id}] (${g.type}${g.quarter ? ` Q${g.quarter}` : ""} ${g.year}) ` +
            `${g.domain ? `{${g.domain}} ` : ""}${g.title}` +
            `${g.targetMetric ? ` — target: ${g.targetMetric}` : ""} — progress ${g.progress}%`,
        )
        .join("\n")
    : "(no active goals defined)";

  const taskLines = todayTasks.length
    ? todayTasks
        .map(
          (t) =>
            `- [${t.status}] ${t.title}${
              t.isTimeBlocked && t.startTime ? ` (${t.startTime}-${t.endTime})` : ""
            }`,
        )
        .join("\n")
    : "(no tasks were planned for today)";

  const busyLines = busySlots.length
    ? busySlots
        .map((b) => `- ${b.start}-${b.end}${b.summary ? ` (${b.summary})` : ""}`)
        .join("\n")
    : "(no busy calendar slots tomorrow)";

  return `
TIMEZONE: ${timezone}
TODAY: ${todayISO}
PLAN FOR (TOMORROW): ${tomorrowISO}

USER'S ACTIVE GOALS:
${goalLines}

TODAY'S TASKS AND STATUS:
${taskLines}

USER'S NOTES ABOUT TODAY:
${dailyLog?.freeText?.trim() || "(no notes provided)"}

TOMORROW'S CALENDAR BUSY SLOTS (do not overlap these with time-blocked tasks):
${busyLines}

Now:
1) Analyze TODAY (goal alignment, productivity, balance/burnout, a motivating note)
   and give 0-10 scores.
2) Build TOMORROW's task list per the principles.
`;
}

// Prompt for a lightweight weekly summary
export function buildWeeklyPrompt(input: {
  locale: Locale;
  goals: Goal[];
  weekTasks: Task[];
  weekStartISO: string;
  weekEndISO: string;
}): string {
  const { goals, weekTasks, weekStartISO, weekEndISO } = input;
  const done = weekTasks.filter((t) => t.status === "done").length;
  const goalLines = goals
    .map((g) => `- [${g.id}] ${g.title} (progress ${g.progress}%)`)
    .join("\n");
  return `
Weekly review for ${weekStartISO} .. ${weekEndISO}.
Tasks completed this week: ${done}/${weekTasks.length}.

ACTIVE GOALS:
${goalLines || "(none)"}

Write a short weekly summary: what moved forward, what stalled, and 2-3 focus
suggestions for next week. Then, for each goal, suggest an updated progress
percentage (0-100) reflecting the week.
`;
}
