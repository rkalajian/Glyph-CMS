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
 *  - Events removed from Google Calendar are pruned from Strapi, but only:
 *      • events that originated from Google (have a googleCalendarEventId),
 *      • events in the sync window (startDate >= timeMin) — past events are
 *        never touched since Google no longer returns them,
 *      • and only when the Google fetch completed cleanly (a partial/failed
 *        fetch must never trigger a mass delete).
 *    Manually-created Strapi events are always left alone.
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

/**
 * Short deterministic hash of a Google Calendar event id, used as a slug suffix.
 *
 * Must hash the FULL id, not a trailing slice — recurring-event instance ids
 * look like `<seriesId>_<YYYYMMDD>T<HHMMSS>Z`, and for a daily series at a
 * fixed time, the last 8 characters (the `HHMMSSZ` portion) are IDENTICAL
 * across every occurrence. Slicing collided across instances and caused
 * "attribute must be unique" slug errors that aborted the whole sync run.
 */
function hashId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

/** Resolve start/end datetimes and allDay flag from a Google Calendar event */
function resolveDates(ev: GoogleCalendarEvent): {
  startDate: string;
  endDate: string | null;
  allDay: boolean;
} {
  const allDay = !ev.start.dateTime;

  if (allDay) {
    // All-day: Google gives YYYY-MM-DD with no time-of-day. Anchor at noon UTC
    // (not midnight) so the date survives conversion to America/New_York
    // (UTC-4/-5) on the frontend without rolling back to the previous day.
    const startDate = new Date(ev.start.date + 'T12:00:00Z').toISOString();
    const endDate = ev.end?.date
      ? new Date(ev.end.date + 'T12:00:00Z').toISOString()
      : null;
    return { startDate, endDate, allDay: true };
  }

  return {
    startDate: new Date(ev.start.dateTime!).toISOString(),
    endDate: ev.end?.dateTime ? new Date(ev.end.dateTime).toISOString() : null,
    allDay: false,
  };
}

/**
 * Fetch all upcoming events from a Google Calendar (handles pagination).
 *
 * `complete` is false if any page errored — callers must treat the event list
 * as partial and skip destructive pruning when it is false.
 */
async function fetchGoogleCalendarEvents(
  calendarId: string,
  apiKey: string,
  timeMin: string,
  strapi: Core.Strapi
): Promise<{ events: GoogleCalendarEvent[]; complete: boolean }> {
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
      return { events: allEvents, complete: false };
    }

    const body = (await res.json()) as GoogleCalendarListResponse;
    if (body.error) {
      strapi.log.error(`[gcal-sync] Google Calendar API error: ${body.error.message}`);
      return { events: allEvents, complete: false };
    }

    for (const ev of body.items ?? []) {
      if (ev.status !== 'cancelled') allEvents.push(ev);
    }

    pageToken = body.nextPageToken;
  } while (pageToken);

  return { events: allEvents, complete: true };
}

/**
 * Delete Strapi events that originated from Google Calendar but are no longer
 * present in the fetched set. Scoped to the sync window (startDate >= timeMin)
 * so past events — which Google no longer returns — are never removed.
 */
async function pruneRemovedEvents(
  liveIds: Set<string>,
  timeMin: string,
  strapi: Core.Strapi
): Promise<number> {
  const docService = strapi.documents(EVENT_UID);

  // All synced, future events in any state (draft or published).
  const candidates = await docService.findMany({
    filters: {
      googleCalendarEventId: { $notNull: true },
      startDate: { $gte: timeMin },
    },
    fields: ['documentId', 'googleCalendarEventId', 'title'],
    status: 'draft',
    pagination: { pageSize: 1000 },
  });

  let deleted = 0;
  for (const ev of candidates ?? []) {
    if (liveIds.has(ev.googleCalendarEventId)) continue;
    try {
      await docService.delete({ documentId: ev.documentId });
      deleted++;
      strapi.log.info(`[gcal-sync] Deleted event removed from Google Calendar: "${ev.title}" (${ev.googleCalendarEventId})`);
    } catch (err) {
      strapi.log.error(`[gcal-sync] Failed to delete event "${ev.title}" (${ev.documentId}):`, err);
    }
  }
  return deleted;
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

  // New event — generate a stable slug from title + a hash of the full gcal id
  const baseSlug = slugify(title) || 'event';
  const slug = `${baseSlug}-${hashId(gcalEvent.id)}`;

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

/** Load calendar config from Theme Options, falling back to env vars */
async function loadConfig(strapi: Core.Strapi): Promise<{
  calendarId: string;
  apiKey: string;
  syncEnabled: boolean;
} | null> {
  try {
    const settings = await strapi.documents('api::theme-options.theme-option' as Parameters<typeof strapi.documents>[0]).findFirst({}) as {
      googleCalendarId?: string | null;
      googleCalendarApiKey?: string | null;
      googleCalendarSyncEnabled?: boolean | null;
    } | null;

    const calendarId = settings?.googleCalendarId?.trim() || process.env.GOOGLE_CALENDAR_ID;
    const apiKey = settings?.googleCalendarApiKey?.trim() || process.env.GOOGLE_CALENDAR_API_KEY;
    const syncEnabled = settings?.googleCalendarSyncEnabled ?? true;

    if (!calendarId || !apiKey) return null;
    return { calendarId, apiKey, syncEnabled };
  } catch {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const apiKey = process.env.GOOGLE_CALENDAR_API_KEY;
    if (!calendarId || !apiKey) return null;
    return { calendarId, apiKey, syncEnabled: true };
  }
}

/** Main sync entrypoint — call this from bootstrap and from the cron job */
export async function syncGoogleCalendar(strapi: Core.Strapi): Promise<void> {
  const config = await loadConfig(strapi);

  if (!config) {
    // Not configured — skip silently (feature is opt-in)
    return;
  }

  const { calendarId, apiKey, syncEnabled } = config;

  if (!syncEnabled) {
    strapi.log.info('[gcal-sync] Sync disabled in Event Feed settings — skipping');
    return;
  }

  strapi.log.info('[gcal-sync] Starting Google Calendar sync…');

  try {
    const timeMin = new Date().toISOString();
    const { events: gcalEvents, complete } = await fetchGoogleCalendarEvents(
      calendarId,
      apiKey,
      timeMin,
      strapi
    );
    strapi.log.info(`[gcal-sync] Fetched ${gcalEvents.length} events from Google Calendar`);

    let created = 0;
    let updated = 0;
    let failed = 0;

    // Each event is upserted independently — one bad event (e.g. a stale
    // slug collision) must not abort the rest of the batch.
    for (const ev of gcalEvents) {
      try {
        const result = await upsertEvent(ev, strapi);
        if (result === 'updated') updated++; else created++;
      } catch (err) {
        failed++;
        strapi.log.error(`[gcal-sync] Failed to sync event "${ev.summary ?? ev.id}" (${ev.id}):`, err);
      }
    }

    // Prune events removed from Google Calendar — but only after a clean fetch.
    // A partial fetch would make live events look deleted and wipe them out.
    let deleted = 0;
    if (complete) {
      const liveIds = new Set(gcalEvents.map((ev) => ev.id));
      deleted = await pruneRemovedEvents(liveIds, timeMin, strapi);
    } else {
      strapi.log.warn('[gcal-sync] Incomplete fetch — skipping prune of removed events');
    }

    strapi.log.info(`[gcal-sync] Done — ${created} created, ${updated} updated, ${deleted} deleted, ${failed} failed`);
  } catch (err) {
    strapi.log.error('[gcal-sync] Sync failed:', err);
  }
}
