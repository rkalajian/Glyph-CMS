import type { Metadata } from 'next';
import { getThemeOptions } from './strapi';

/**
 * Shared helper to build page metadata with theme options.
 * Call this from each page's generateMetadata export.
 */
export async function buildPageMetadata(
  title?: string,
  opts?: { description?: string }
): Promise<Metadata> {
  const themeOptions = await getThemeOptions();
  const siteName = themeOptions?.siteName?.trim();
  const fullTitle = siteName
    ? (title ? `${title} | ${siteName}` : siteName)
    : (title ?? '');
  return {
    title: fullTitle,
    description: opts?.description,
  };
}
