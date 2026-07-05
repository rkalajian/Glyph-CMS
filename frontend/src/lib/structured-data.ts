/**
 * schema.org JSON-LD builders. Render with <JsonLd data={...} />.
 * Organization name/domain come from Theme Options / env — nothing site-specific here.
 */
import type { StrapiBlogPost, StrapiPressRelease, StrapiEvent, StrapiBlock } from '../types/strapi';
import { getStrapiImageUrl } from './strapi';
import { SITE_DOMAIN } from './metadata';

const BASE = `https://${SITE_DOMAIN}`;
const abs = (url: string | null): string | null =>
  url && url.startsWith('http') ? url : url ? `${BASE}${url}` : null;

/** Flattens Strapi rich-text blocks to a plain-text string, truncated for meta use. */
function blocksToText(blocks: StrapiBlock[], max = 300): string {
  const walk = (node: unknown): string => {
    if (!node || typeof node !== 'object') return '';
    const n = node as { text?: string; children?: unknown[] };
    if (typeof n.text === 'string') return n.text;
    if (Array.isArray(n.children)) return n.children.map(walk).join('');
    return '';
  };
  const text = blocks.map(walk).join(' ').replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/** schema.org Article for a blog post or press release. */
export function articleSchema(
  item: StrapiBlogPost | StrapiPressRelease,
  url: string,
  orgName: string,
  authorName?: string
): Record<string, unknown> {
  const image = abs(getStrapiImageUrl(item.coverImage));
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title,
    ...(item.excerpt && { description: item.excerpt }),
    ...(image && { image: [image] }),
    datePublished: item.publishedAt ?? item.createdAt,
    dateModified: item.updatedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': authorName ? 'Person' : 'Organization', name: authorName ?? orgName },
    publisher: { '@type': 'Organization', name: orgName },
  };
}

/** schema.org Event. */
export function eventSchema(event: StrapiEvent, url: string, orgName: string): Record<string, unknown> {
  const image = abs(getStrapiImageUrl(event.image));
  const description =
    typeof event.description === 'string'
      ? event.description
      : event.description
        ? blocksToText(event.description)
        : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.startDate,
    ...(event.endDate && { endDate: event.endDate }),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(description && { description }),
    ...(image && { image: [image] }),
    url,
    ...(event.location && { location: { '@type': 'Place', name: event.location } }),
    organizer: { '@type': 'Organization', name: orgName, url: BASE },
  };
}

/** schema.org BreadcrumbList from ordered [name, path] pairs. */
export function breadcrumbSchema(items: { name: string; path: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE}${item.path}`,
    })),
  };
}
