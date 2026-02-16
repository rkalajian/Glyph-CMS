/**
 * Injects GTM and Marker.io scripts from Theme Options.
 * Scripts are added to document.head in useEffect to avoid SSR/hydration issues.
 * GTM noscript iframe is rendered inline for no-JS fallback.
 */

import { useEffect } from 'react';
import type { StrapiThemeOptions } from '../types/strapi';

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

  // Inline script content
  const script = document.createElement('script');
  script.id = 'markerio-script';
  script.innerHTML = s;
  document.head.appendChild(script);
  return true;
}

interface ThemeScriptsProps {
  options: StrapiThemeOptions | null;
}

export function ThemeScripts({ options }: ThemeScriptsProps) {
  const gtm = options?.gtm;
  const marker = options?.marker;

  useEffect(() => {
    if (!options) return;

    const toRemove: string[] = [];

    // Google Tag Manager – header script (ID e.g. GTM-XXX or full snippet)
    const gtmHeaderSnippet = gtm?.gtmHeaderSnippet?.trim();
    if (gtmHeaderSnippet) {
      const script = document.createElement('script');
      script.id = 'gtm-script';
      const isGtmId = /^GTM-[A-Z0-9]+$/i.test(gtmHeaderSnippet);
      script.innerHTML = isGtmId
        ? `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmHeaderSnippet}');`
        : gtmHeaderSnippet;
      document.head.appendChild(script);
      toRemove.push('gtm-script');
    }

    // Marker.io – feedback widget (URL or snippet from Theme Options)
    const markerSnippet = marker?.markerSnippet?.trim();
    if (markerSnippet && injectMarkerSnippet(markerSnippet)) {
      toRemove.push('markerio-script');
    }

    return () => {
      toRemove.forEach((id) => document.getElementById(id)?.remove());
    };
  }, [gtm?.gtmHeaderSnippet, marker?.markerSnippet]);

  // GTM noscript iframe – fallback when JavaScript is disabled
  const gtmBodySnippet = gtm?.gtmBodySnippet?.trim() || gtm?.gtmHeaderSnippet?.trim();
  const gtmBodyId = gtmBodySnippet && /^GTM-[A-Z0-9]+$/i.test(gtmBodySnippet) ? gtmBodySnippet : null;
  if (!gtmBodyId) return null;

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
