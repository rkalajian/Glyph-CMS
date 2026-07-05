'use client';

import { useCookieConsent } from './CookieConsentProvider';

export function CookieSettingsButton() {
  const { openSettings } = useCookieConsent();

  return (
    <button
      type="button"
      className="text-sm text-muted underline hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded cursor-pointer"
      onClick={openSettings}
    >
      Cookie Settings
    </button>
  );
}
