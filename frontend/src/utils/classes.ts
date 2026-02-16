/**
 * Shared Tailwind class combinations for consistent UI.
 * Use these to reduce duplication and keep styling in one place.
 */

/** Standard focus ring for links and buttons – WCAG 2.4.7 Focus Visible. */
export const FOCUS_RING =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded';

/** Link style: accent color with hover underline. */
export const LINK_ACCENT = `text-accent hover:underline ${FOCUS_RING}`;
