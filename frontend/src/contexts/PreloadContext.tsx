/**
 * Provides build-time preloaded data to avoid runtime fetches on static sites.
 * When window.__PRELOADED__ is set (during prerender), components use it instead of fetching.
 */

import { createContext, useContext } from 'react';

export interface PreloadedData {
  route: string;
  nav?: { utilityNav: unknown[]; primaryNav: unknown[]; footerNav: unknown[] };
  themeOptions?: Record<string, unknown> | null;
  page?: unknown;
  posts?: unknown[];
  pagination?: { page: number; pageSize: number; pageCount: number; total: number };
  categories?: unknown[];
  releases?: unknown[];
  events?: unknown[];
}

declare global {
  interface Window {
    __PRELOADED__?: PreloadedData;
  }
}

const PreloadContext = createContext<PreloadedData | null>(null);

export const PreloadProvider = PreloadContext.Provider;

export function usePreload(): PreloadedData | null {
  return useContext(PreloadContext);
}

/** Get preloaded data from window (set by prerender script). Call before first render. */
export function getPreloadedData(): PreloadedData | null {
  if (typeof window === 'undefined') return null;
  return window.__PRELOADED__ ?? null;
}
