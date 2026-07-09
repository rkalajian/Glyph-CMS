/**
 * Shared formatting utilities for dates, numbers, etc.
 */

/**
 * Formats an ISO date string for display (e.g. "February 12, 2025").
 * Returns empty string if the date is invalid or null.
 */
export function formatDate(
  dateStr: string | null | undefined
): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/** True for absolute http(s) URLs (external links get target="_blank"). */
export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

// Pin to one timezone so server (build, UTC) and client (visitor-local)
// render identical text — otherwise hydration mismatches (React #418).
const SITE_TZ = process.env.NEXT_PUBLIC_TIMEZONE ?? 'America/New_York';

/** YYYY-MM-DD key for a date in the site's timezone (en-CA yields ISO order). */
function zonedDayKey(d: Date): string {
  return d.toLocaleDateString('en-CA', { timeZone: SITE_TZ });
}

/**
 * True when an event spans more than one calendar day in the site's timezone.
 * endDate is treated as inclusive (matching Strapi's stored convention).
 */
export function isMultiDayEvent(
  startDate?: string | null,
  endDate?: string | null
): boolean {
  if (!startDate || !endDate) return false;
  try {
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return false;
    return zonedDayKey(s) !== zonedDayKey(e);
  } catch {
    return false;
  }
}

/**
 * Compact date-range string for badges/tags. No times.
 * Single day:        "Sep 15"
 * Same-month range:  "Sep 15–18"
 * Cross-month range: "Sep 28 – Oct 2"
 * Cross-year range:  "Dec 30, 2026 – Jan 2, 2027"
 */
export function formatEventRangeShort(
  startDate: string,
  endDate?: string | null
): string {
  if (!startDate) return '';
  try {
    const s = new Date(startDate);
    const sMonth = s.toLocaleString('en-US', { month: 'short', timeZone: SITE_TZ });
    const sDay = s.toLocaleString('en-US', { day: 'numeric', timeZone: SITE_TZ });
    if (!isMultiDayEvent(startDate, endDate)) return `${sMonth} ${sDay}`;
    const e = new Date(endDate!);
    const eMonth = e.toLocaleString('en-US', { month: 'short', timeZone: SITE_TZ });
    const eDay = e.toLocaleString('en-US', { day: 'numeric', timeZone: SITE_TZ });
    const sYear = s.toLocaleString('en-US', { year: 'numeric', timeZone: SITE_TZ });
    const eYear = e.toLocaleString('en-US', { year: 'numeric', timeZone: SITE_TZ });
    if (sYear !== eYear) return `${sMonth} ${sDay}, ${sYear} – ${eMonth} ${eDay}, ${eYear}`;
    if (sMonth === eMonth) return `${sMonth} ${sDay}–${eDay}`;
    return `${sMonth} ${sDay} – ${eMonth} ${eDay}`;
  } catch {
    return '';
  }
}

/**
 * Formats an event date range for display.
 * All-day single: "March 15, 2025"
 * All-day same-month range: "March 15–18, 2025"
 * All-day cross-month range: "March 30 – April 2, 2025"
 * Timed single: "March 15, 2025 · 10:00 AM"
 * Timed same-day: "March 15, 2025 · 10:00 AM – 2:00 PM"
 * Timed multi-day: "March 15, 2025 at 10:00 AM – March 16, 2025 at 2:00 PM"
 */
export function formatEventDate(
  startDate: string,
  endDate?: string | null,
  allDay?: boolean | null
): string {
  if (!startDate) return '';
  try {
    const start = new Date(startDate);
    // Pin to one timezone so server (build, UTC) and client (visitor-local)
    // render identical text — otherwise hydration mismatches (React #418).
    const TZ = process.env.NEXT_PUBLIC_TIMEZONE ?? 'America/New_York';
    const dateOpts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: TZ };
    const timeOpts: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: TZ };
    const dayOpts: Intl.DateTimeFormatOptions = { day: 'numeric', timeZone: TZ };

    if (allDay) {
      const startStr = start.toLocaleDateString('en-US', dateOpts);
      if (!endDate) return startStr;
      const end = new Date(endDate);
      const startParts = { y: start.toLocaleString('en-US', { year: 'numeric', timeZone: TZ }), m: start.toLocaleString('en-US', { month: 'long', timeZone: TZ }) };
      const endParts = { y: end.toLocaleString('en-US', { year: 'numeric', timeZone: TZ }), m: end.toLocaleString('en-US', { month: 'long', timeZone: TZ }) };
      if (startParts.y === endParts.y && startParts.m === endParts.m) {
        return `${startParts.m} ${start.toLocaleString('en-US', dayOpts)}–${end.toLocaleString('en-US', dayOpts)}, ${startParts.y}`;
      }
      return `${startStr} – ${end.toLocaleDateString('en-US', dateOpts)}`;
    }

    const startDateStr = start.toLocaleDateString('en-US', dateOpts);
    const startTimeStr = start.toLocaleTimeString('en-US', timeOpts);
    if (!endDate) return `${startDateStr} · ${startTimeStr}`;
    const end = new Date(endDate);
    const endDateStr = end.toLocaleDateString('en-US', dateOpts);
    const endTimeStr = end.toLocaleTimeString('en-US', timeOpts);
    if (startDateStr === endDateStr) return `${startDateStr} · ${startTimeStr} – ${endTimeStr}`;
    return `${startDateStr} at ${startTimeStr} – ${endDateStr} at ${endTimeStr}`;
  } catch {
    return '';
  }
}
