/**
 * Google Calendar → Strapi Event sync
 *
 * Reads GOOGLE_CALENDAR_ID and GOOGLE_CALENDAR_API_KEY from env.
 * Fetches upcoming events from a public Google Calendar and upserts
 * them into the Strapi Event collection, matching on googleCalendarEventId.
 *
 * Rules:
 *  - Title, dates, description, and location are always overwritten from Google.
 *  - `image` is NEVER overwritten — if a user has uploaded one in Strapi it is kept.
 *  - Events deleted from Google Calendar are NOT auto-deleted from Strapi
 *    (they remain for manual review/cleanup).
 */

import type { Core } from '@strapi/strapi';

const EVENT_UID = 'api::event.event';

interface GoogleCalendarEventDateTime {
  dateTime?: string; // ISO 8601 with timezone — timed events
  date?: string;     // YYYY-MM-DD — all-day events
  timeZone?: string;
}

interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  htmlLink?: string; // Link to view the event in Google Calendar
  start: GoogleCalendarEventDateTime;
  end: GoogleCalendarEventDateTime;
  status?: string; // 'confirmed' | 'tentative' | 'cancelled'
}

interface GoogleCalendarListResponse {
  items?: GoogleCalendarEvent[];
  nextPageToken?: string;
  error?: { message: string; code: number };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

/** Resolve start/end datetimes and allDay flag from a Google Calendar event */
function resolveDates(ev: GoogleCalendarEvent): {
  startDate: string;
  endDate: string | null;
  allDay: boolean;
} {
  const allDay = !ev.start.dateTime;

  if (allDay) {
    // All-day: Google gives YYYY-MM-DD, store as midnight UTC
    const startDate = new Date(ev.start.date + 'T00:00:00Z').toISOString();
    const endDate = ev.end?.date
      ? new Date(ev.end.date + 'T00:00:00Z').toISOString()
      : null;
    return { startDate, endDate, allDay: true };
  }

  return {
    startDate: new Date(ev.start.dateTime!).toISOString(),
    endDate: ev.end?.dateTime ? new Date(ev.end.dateTime).toISOString() : null,
    allDay: false,
  };
}

/** Fetch all upcoming events from a Google Calendar (handles pagination) */
async function fetchGoogleCalendarEvents(
  calendarId: string,
  apiKey: string,
  strapi: Core.Strapi
): Promise<GoogleCalendarEvent[]> {
  const timeMin = new Date().toISOString();
  const base = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
  const allEvents: GoogleCalendarEvent[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      key: apiKey,
      singleEvents: 'true',
      orderBy: 'startTime',
      timeMin,
      maxResults: '250',
    });
    if (pageToken) params.set('pageToken', pageToken);

    const res = await fetch(`${base}?${params.toString()}`);
    if (!res.ok) {
      strapi.log.error(`[gcal-sync] Google Calendar API error: ${res.status} ${res.statusText}`);
      break;
    }

    const body = (await res.json()) as GoogleCalendarListResponse;
    if (body.error) {
      strapi.log.error(`[gcal-sync] Google Calendar API error: ${body.error.message}`);
      break;
    }

    for (const ev of body.items ?? []) {
      if (ev.status !== 'cancelled') allEvents.push(ev);
    }

    pageToken = body.nextPageToken;
  } while (pageToken);

  return allEvents;
}

/**
 * Upsert a single Google Calendar event into Strapi.
 * Returns 'created' or 'updated' for logging.
 *
 * The lookup intentionally omits `status` so it finds the event
 * regardless of whether it is published or in draft — preventing
 * a duplicate-create crash when a user has unpublished an event.
 *
 * `image` is never included in the update payload so Strapi's partial
 * update leaves any manually-uploaded image untouched.
 */
async function upsertEvent(
  gcalEvent: GoogleCalendarEvent,
  strapi: Core.Strapi
): Promise<'created' | 'updated'> {
  const docService = strapi.documents(EVENT_UID);
  const { startDate, endDate, allDay } = resolveDates(gcalEvent);
  const title = gcalEvent.summary ?? '(Untitled)';

  // No `status` filter — find the event in any state (draft or published)
  const existing = await docService.findFirst({
    filters: { googleCalendarEventId: { $eq: gcalEvent.id } },
  });

  if (existing) {
    // Partial update: only synced fields are sent — `image` is not included
    // so Strapi leaves the existing image untouched.
    await docService.update({
      documentId: existing.documentId,
      data: {
        title,
        startDate,
        endDate: endDate ?? undefined,
        allDay,
        description: gcalEvent.description ?? null,
        location: gcalEvent.location ?? null,
        url: gcalEvent.htmlLink ?? null,
      },
      status: 'published',
    });
    return 'updated';
  }

  // New event — generate a stable slug from title + last 8 chars of gcal id
  const baseSlug = slugify(title) || 'event';
  const slug = `${baseSlug}-${gcalEvent.id.slice(-8)}`;

  await docService.create({
    data: {
      title,
      slug,
      startDate,
      endDate: endDate ?? undefined,
      allDay,
      description: gcalEvent.description ?? null,
      location: gcalEvent.location ?? null,
      url: gcalEvent.htmlLink ?? null,
      googleCalendarEventId: gcalEvent.id,
    },
    status: 'published',
  });
  return 'created';
}

/** Main sync entrypoint — call this from bootstrap and from the cron job */
export async function syncGoogleCalendar(strapi: Core.Strapi): Promise<void> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY;

  if (!calendarId || !apiKey) {
    // Not configured — skip silently (feature is opt-in)
    return;
  }

  strapi.log.info('[gcal-sync] Starting Google Calendar sync…');

  try {
    const gcalEvents = await fetchGoogleCalendarEvents(calendarId, apiKey, strapi);
    strapi.log.info(`[gcal-sync] Fetched ${gcalEvents.length} events from Google Calendar`);

    let created = 0;
    let updated = 0;

    for (const ev of gcalEvents) {
      const result = await upsertEvent(ev, strapi);
      if (result === 'updated') updated++; else created++;
    }

    strapi.log.info(`[gcal-sync] Done — ${created} created, ${updated} updated`);
  } catch (err) {
    strapi.log.error('[gcal-sync] Sync failed:', err);
  }
}
