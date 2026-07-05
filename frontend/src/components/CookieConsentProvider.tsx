'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface CookieConsentContextValue {
  consent: 'accepted' | 'declined' | null;
  accept: () => void;
  decline: () => void;
  openSettings: () => void;
}

const STORAGE_KEY = 'cookie_consent';

export const CookieConsentContext = createContext<CookieConsentContextValue>({
  consent: null,
  accept: () => {},
  decline: () => {},
  openSettings: () => {},
});

export function useCookieConsent() {
  return useContext(CookieConsentContext);
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<'accepted' | 'declined' | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'accepted' || stored === 'declined' ? stored : null;
  });

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setConsent('accepted');
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setConsent('declined');
  }

  function openSettings() {
    localStorage.removeItem(STORAGE_KEY);
    setConsent(null);
  }

  return (
    <CookieConsentContext.Provider value={{ consent, accept, decline, openSettings }}>
      {children}
    </CookieConsentContext.Provider>
  );
}
