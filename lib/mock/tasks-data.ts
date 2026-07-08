/**
 * Placeholder seed data for the Tasks / Day-analysis pages, carried over
 * from the Claude Design prototype. Sprint 2 replaces this with real
 * Drizzle-backed data (see lib/db/schema.ts `tasks` table).
 */
export type Priority = "high" | "mid" | "low";

export interface MockTask {
  id: number;
  title: string;
  goal: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  priority: Priority;
  done: boolean;
}

export const PRIORITY: Record<Priority, { label: string; bg: string; fg: string }> = {
  high: { label: "Yuqori", bg: "var(--color-error-light)", fg: "var(--color-error)" },
  mid: { label: "O'rta", bg: "var(--color-warning-light)", fg: "var(--color-warning)" },
  low: { label: "Past", bg: "var(--color-success-light)", fg: "var(--color-success)" },
};

export const INITIAL_TASKS: MockTask[] = [
  { id: 1, title: "20 ta yangi ingliz so'zi yodlash", goal: "Ingliz tili B2", date: "2026-07-03", time: "18:00", priority: "high", done: false },
  { id: 2, title: "5 km yugurish mashg'uloti", goal: "Marafon", date: "2026-07-03", time: "07:00", priority: "mid", done: true },
  { id: 3, title: "Kitobdan 30 bet o'qish", goal: "Har oy kitob", date: "2026-07-03", time: "21:00", priority: "low", done: false },
  { id: 4, title: "Suhbat darsiga tayyorgarlik", goal: "Ingliz tili B2", date: "2026-07-04", time: "15:00", priority: "mid", done: false },
  { id: 5, title: "Interval yugurish (8 km)", goal: "Marafon", date: "2026-07-05", time: "08:00", priority: "high", done: false },
  { id: 6, title: "Oylik kitob konspektini yozish", goal: "Har oy kitob", date: "2026-07-07", time: "20:00", priority: "low", done: false },
];

export const TODAY = "2026-07-03";

const UZ_MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];

export function addDaysISO(iso: string, n: number): string {
  const d = new Date(iso + "T00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function whenOf(date: string): "today" | "upcoming" {
  return date <= TODAY ? "today" : "upcoming";
}

export function formatDue(date: string, time?: string): string {
  let day: string;
  if (date === TODAY) day = "Bugun";
  else if (date === addDaysISO(TODAY, 1)) day = "Ertaga";
  else {
    const d = new Date(date + "T00:00");
    day = `${d.getDate()}-${UZ_MONTHS[d.getMonth()]}`;
  }
  return time ? `${day}, ${time}` : day;
}
