import { google } from "googleapis";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { accounts } from "@/lib/db/schema";

/**
 * Build an authorized OAuth2 client for a user from their stored Google tokens.
 * Auto-refreshes and persists new access tokens. Returns null if the user has no
 * Google account connected.
 */
async function getOAuthClient(userId: string) {
  const [account] = await db
    .select()
    .from(accounts)
    .where(
      and(eq(accounts.userId, userId), eq(accounts.provider, "google")),
    )
    .limit(1);

  if (!account || !account.access_token) return null;

  const client = new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET,
  );

  client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token ?? undefined,
    expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
  });

  // Persist refreshed tokens back to the DB.
  client.on("tokens", async (tokens) => {
    await db
      .update(accounts)
      .set({
        access_token: tokens.access_token ?? account.access_token,
        expires_at: tokens.expiry_date
          ? Math.floor(tokens.expiry_date / 1000)
          : account.expires_at,
        ...(tokens.refresh_token
          ? { refresh_token: tokens.refresh_token }
          : {}),
      })
      .where(
        and(eq(accounts.userId, userId), eq(accounts.provider, "google")),
      );
  });

  return client;
}

export async function isGoogleConnected(userId: string): Promise<boolean> {
  const [account] = await db
    .select({ id: accounts.access_token })
    .from(accounts)
    .where(and(eq(accounts.userId, userId), eq(accounts.provider, "google")))
    .limit(1);
  return Boolean(account?.id);
}

export type BusySlot = { start: string; end: string; summary?: string };

/**
 * Returns busy slots (as HH:MM local strings via the provided timezone) for a day.
 */
export async function getBusySlots(
  userId: string,
  timeMinISO: string,
  timeMaxISO: string,
  timezone: string,
): Promise<BusySlot[]> {
  try {
    const auth = await getOAuthClient(userId);
    if (!auth) return [];
    const calendar = google.calendar({ version: "v3", auth });
    const res = await calendar.freebusy.query({
      requestBody: {
        timeMin: timeMinISO,
        timeMax: timeMaxISO,
        timeZone: timezone,
        items: [{ id: "primary" }],
      },
    });
    const busy = res.data.calendars?.primary?.busy ?? [];
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: timezone,
    });
    return busy.map((b) => ({
      start: b.start ? fmt.format(new Date(b.start)) : "",
      end: b.end ? fmt.format(new Date(b.end)) : "",
    }));
  } catch (err) {
    console.error("getBusySlots failed:", err);
    return [];
  }
}

/**
 * Create a calendar event for a time-blocked task. Returns the event id or null.
 * dateISO is YYYY-MM-DD, start/end are HH:MM local strings.
 */
export async function createCalendarEvent(
  userId: string,
  params: {
    summary: string;
    description?: string;
    dateISO: string;
    startTime: string; // HH:MM
    endTime: string; // HH:MM
    timezone: string;
  },
): Promise<string | null> {
  try {
    const auth = await getOAuthClient(userId);
    if (!auth) return null;
    const calendar = google.calendar({ version: "v3", auth });
    const res = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: params.summary,
        description: params.description,
        start: {
          dateTime: `${params.dateISO}T${params.startTime}:00`,
          timeZone: params.timezone,
        },
        end: {
          dateTime: `${params.dateISO}T${params.endTime}:00`,
          timeZone: params.timezone,
        },
      },
    });
    return res.data.id ?? null;
  } catch (err) {
    console.error("createCalendarEvent failed:", err);
    return null;
  }
}

export async function deleteCalendarEvent(
  userId: string,
  eventId: string,
): Promise<void> {
  try {
    const auth = await getOAuthClient(userId);
    if (!auth) return;
    const calendar = google.calendar({ version: "v3", auth });
    await calendar.events.delete({ calendarId: "primary", eventId });
  } catch (err) {
    console.error("deleteCalendarEvent failed:", err);
  }
}

export type CalendarEventLite = {
  id: string;
  summary: string;
  start: string; // ISO
  end: string; // ISO
};

/** List events in a date range, for the /calendar page. */
export async function listEvents(
  userId: string,
  timeMinISO: string,
  timeMaxISO: string,
): Promise<CalendarEventLite[]> {
  try {
    const auth = await getOAuthClient(userId);
    if (!auth) return [];
    const calendar = google.calendar({ version: "v3", auth });
    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: timeMinISO,
      timeMax: timeMaxISO,
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 100,
    });
    return (res.data.items ?? [])
      .filter((e) => e.start?.dateTime && e.end?.dateTime)
      .map((e) => ({
        id: e.id ?? "",
        summary: e.summary ?? "(untitled)",
        start: e.start!.dateTime!,
        end: e.end!.dateTime!,
      }));
  } catch (err) {
    console.error("listEvents failed:", err);
    return [];
  }
}
