'use client';

import { useEffect, useRef } from 'react';
import { useCookieConsent } from './CookieConsentProvider';

export function CookieConsentBanner() {
  const { consent, accept, decline } = useCookieConsent();
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (consent === null) {
      acceptRef.current?.focus();
    }
  }, [consent]);

  if (consent !== null) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-bg border-t border-border shadow-[0_-2px_12px_rgba(0,0,0,0.15)]"
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
      aria-describedby="cookie-banner-desc"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p id="cookie-banner-desc" className="text-sm text-fg m-0">
          We use cookies to improve your experience. Analytics only load if you accept.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            className="min-h-[44px] min-w-[88px] px-5 py-2.5 rounded-lg text-sm font-medium border border-border text-fg bg-transparent hover:border-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent transition-colors cursor-pointer"
            onClick={decline}
          >
            Decline
          </button>
          <button
            type="button"
            ref={acceptRef}
            className="min-h-[44px] min-w-[88px] px-5 py-2.5 rounded-lg text-sm font-medium bg-accent text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent transition-colors cursor-pointer"
            onClick={accept}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
