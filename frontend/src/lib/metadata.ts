import type { Metadata } from 'next';
import { getThemeOptions } from './strapi';

/** Public domain of the deployed site (used for canonical URLs and JSON-LD). */
export const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'localhost';

/**
 * Shared helper to build page metadata with theme options.
 * Call this from each page's generateMetadata export.
 */
export async function buildPageMetadata(
  title?: string,
  opts?: { description?: string; canonicalPath?: string; image?: string | null }
): Promise<Metadata> {
  const themeOptions = await getThemeOptions();
  const siteName = themeOptions?.siteName?.trim();
  const fullTitle = siteName
    ? (title ? `${title} | ${siteName}` : siteName)
    : (title ?? '');
  return {
    title: fullTitle,
    description: opts?.description,
    ...(opts?.canonicalPath && {
      alternates: { canonical: `https://${SITE_DOMAIN}${opts.canonicalPath}` },
    }),
    ...(opts?.image && {
      openGraph: { title: fullTitle, description: opts?.description, images: [opts.image] },
    }),
  };
}
