import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { addDays } from "date-fns";

/** Current local date (YYYY-MM-DD) in the given timezone. */
export function todayISO(timezone: string, now: Date = new Date()): string {
  return formatInTimeZone(now, timezone, "yyyy-MM-dd");
}

/** Add n days to a YYYY-MM-DD string (timezone-agnostic calendar math). */
export function addDaysISO(dateISO: string, n: number): string {
  const d = new Date(`${dateISO}T12:00:00Z`);
  return formatInTimeZone(addDays(d, n), "UTC", "yyyy-MM-dd");
}

/**
 * UTC ISO boundaries [start, end) that cover the given local calendar day
 * in the given timezone. Useful for Calendar freebusy/list queries.
 */
export function dayRangeUTC(
  dateISO: string,
  timezone: string,
): { startISO: string; endISO: string } {
  const start = fromZonedTime(`${dateISO}T00:00:00`, timezone);
  const nextISO = addDaysISO(dateISO, 1);
  const end = fromZonedTime(`${nextISO}T00:00:00`, timezone);
  return { startISO: start.toISOString(), endISO: end.toISOString() };
}

/** Weekday-aware helpers for weekly summaries. */
export function weekRangeISO(
  timezone: string,
  now: Date = new Date(),
): { weekStartISO: string; weekEndISO: string } {
  const today = todayISO(timezone, now);
  // ISO week starting Monday
  const dow = new Date(`${today}T12:00:00Z`).getUTCDay(); // 0=Sun..6=Sat
  const diffToMonday = (dow + 6) % 7;
  const weekStartISO = addDaysISO(today, -diffToMonday);
  const weekEndISO = addDaysISO(weekStartISO, 6);
  return { weekStartISO, weekEndISO };
}
