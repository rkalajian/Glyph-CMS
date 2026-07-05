'use client';

/**
 * Injects GTM and Marker.io scripts from Theme Options.
 * Scripts are added to document.head in useEffect to avoid SSR/hydration issues.
 * GTM noscript iframe is rendered inline for no-JS fallback.
 */

import { useEffect } from 'react';
import type { StrapiThemeOptions } from '../types/strapi';
import { useCookieConsent } from './CookieConsentProvider';

function extractGtmId(snippet: string): string | null {
  if (/^GTM-[A-Z0-9]+$/i.test(snippet.trim())) return snippet.trim().toUpperCase();
  const match = snippet.match(/GTM-[A-Z0-9]+/i);
  return match ? match[0].toUpperCase() : null;
}

function extractScriptContent(snippet: string): string {
  const match = snippet.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  return match ? match[1].trim() : snippet.trim();
}

function isValidMarkerioUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const isHttps = parsed.protocol === 'https:';
    const isMarkerDomain =
      parsed.hostname.includes('marker.io') ||
      parsed.hostname.includes('marker.com');
    return isHttps && isMarkerDomain;
  } catch {
    return false;
  }
}

function injectMarkerSnippet(snippet: string): boolean {
  const s = snippet.trim();
  if (!s) return false;

  // URL: use as script src
  try {
    new URL(s);
    if (isValidMarkerioUrl(s)) {
      const script = document.createElement('script');
      script.id = 'markerio-script';
      script.src = s;
      script.async = true;
      document.head.appendChild(script);
      return true;
    }
  } catch {
    /* not a URL */
  }

  // Try to extract script src from HTML
  const srcMatch = s.match(/<script[^>]+src=["']([^"']+)["']/i);
  if (srcMatch && isValidMarkerioUrl(srcMatch[1])) {
    const script = document.createElement('script');
    script.id = 'markerio-script';
    script.src = srcMatch[1];
    script.async = true;
    document.head.appendChild(script);
    return true;
  }

  // Inline script content — strip outer <script> wrapper if present
  const scriptContentMatch = s.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  const content = scriptContentMatch ? scriptContentMatch[1].trim() : s;
  const script = document.createElement('script');
  script.id = 'markerio-script';
  script.innerHTML = content;
  document.head.appendChild(script);
  return true;
}

interface ThemeScriptsProps {
  options: StrapiThemeOptions | null;
}

export function ThemeScripts({ options }: ThemeScriptsProps) {
  const gtm = options?.gtm;
  const marker = options?.marker;
  const { consent } = useCookieConsent();

  useEffect(() => {
    if (!options) return;

    const toRemove: string[] = [];

    // Google Tag Manager — only inject after user accepts cookies
    const gtmHeaderSnippet = gtm?.gtmHeaderSnippet?.trim();
    if (gtmHeaderSnippet && consent === 'accepted') {
      const script = document.createElement('script');
      script.id = 'gtm-script';
      const gtmId = extractGtmId(gtmHeaderSnippet);
      script.innerHTML = gtmId
        ? `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');`
        : extractScriptContent(gtmHeaderSnippet);
      document.head.appendChild(script);
      toRemove.push('gtm-script');
    }

    // Marker.io — feedback widget; intentionally not gated behind cookie consent
    // (session feedback tool, not analytics/advertising)
    const markerSnippet = marker?.markerSnippet?.trim();
    if (markerSnippet && injectMarkerSnippet(markerSnippet)) {
      toRemove.push('markerio-script');
    }

    return () => {
      toRemove.forEach((id) => document.getElementById(id)?.remove());
    };
  }, [gtm?.gtmHeaderSnippet, marker?.markerSnippet, consent]);

  // GTM noscript iframe — only render when consent given
  const gtmBodySnippet = gtm?.gtmBodySnippet?.trim() || gtm?.gtmHeaderSnippet?.trim();
  const gtmBodyId = gtmBodySnippet ? extractGtmId(gtmBodySnippet) : null;
  if (!gtmBodyId || consent !== 'accepted') return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmBodyId}`}
        height="0"
        width="0"
        className="hidden invisible"
        title="Google Tag Manager"
      />
    </noscript>
  );
}
