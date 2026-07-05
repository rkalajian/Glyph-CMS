import type { MetadataRoute } from 'next';
import { getBlogPosts, getEvents, getPages, getPressReleases } from '@/lib/strapi';

export const dynamic = 'force-static';

const BASE = `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN ?? 'localhost'}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.NEXT_PUBLIC_NOINDEX === 'true') return [];

  const [pages, { data: blogPosts }, { data: pressReleases }, events] = await Promise.all([
    getPages(),
    getBlogPosts({ pageSize: 100 }),
    getPressReleases({ pageSize: 100 }),
    getEvents(),
  ]);

  return [
    { url: `${BASE}/`, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${BASE}/blog/`, priority: 0.8, changeFrequency: 'daily' },
    { url: `${BASE}/press/`, priority: 0.6, changeFrequency: 'weekly' },
    { url: `${BASE}/events/`, priority: 0.8, changeFrequency: 'daily' },
    { url: `${BASE}/contact/`, priority: 0.5, changeFrequency: 'monthly' },
    { url: `${BASE}/search/`, priority: 0.5, changeFrequency: 'daily' },

    // "home" is the homepage content page; the section slugs already have listing URLs above
    ...(pages ?? [])
      .filter((p) => !['home', 'blog', 'press', 'events', 'contact'].includes(p.slug))
      .map((p) => ({
        url: `${BASE}/pages/${p.slug}/`,
        lastModified: p.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),

    ...(blogPosts ?? []).map((p) => ({
      url: `${BASE}/blog/${p.slug}/`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),

    ...(pressReleases ?? []).map((p) => ({
      url: `${BASE}/press/${p.slug}/`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),

    ...(events ?? []).map((e) => ({
      url: `${BASE}/events/${e.slug}/`,
      lastModified: e.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
