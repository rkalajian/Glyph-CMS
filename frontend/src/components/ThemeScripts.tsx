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

function buildMarkerioScriptUrl(marker: StrapiThemeOptions['marker']): string | null {
  const customUrl = marker?.markerioScriptUrl?.trim();
  if (customUrl) return customUrl;
  const id = marker?.markerioId?.trim();
  return id ? `https://marker.io/script/v2/${id}` : null;
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

    // Google Tag Manager – header script
    const gtmHeaderId = gtm?.gtmHeaderId?.trim();
    if (gtmHeaderId) {
      const script = document.createElement('script');
      script.id = 'gtm-script';
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmHeaderId}');
      `.trim();
      document.head.appendChild(script);
      toRemove.push('gtm-script');
    }

    // Marker.io – feedback widget script
    const markerioUrl = buildMarkerioScriptUrl(marker);
    if (markerioUrl && isValidMarkerioUrl(markerioUrl)) {
      const script = document.createElement('script');
      script.id = 'markerio-script';
      script.src = markerioUrl;
      script.async = true;
      document.head.appendChild(script);
      toRemove.push('markerio-script');
    }

    return () => {
      toRemove.forEach((id) => document.getElementById(id)?.remove());
    };
  }, [gtm?.gtmHeaderId, marker?.markerioId, marker?.markerioScriptUrl]);

  // GTM noscript iframe – fallback when JavaScript is disabled
  const gtmBodyId = gtm?.gtmBodyId?.trim() || gtm?.gtmHeaderId?.trim();
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
