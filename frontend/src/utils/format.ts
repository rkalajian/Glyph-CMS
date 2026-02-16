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
