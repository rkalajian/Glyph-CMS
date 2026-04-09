/**
 * Strapi REST API client
 *
 * In dev: uses relative /api so Next.js proxy forwards to Strapi
 * In prod: uses NEXT_PUBLIC_STRAPI_URL (required for deploy)
 *
 * Strapi 5 uses status=published (not publicationState=live) and
 * populate[0]=x&populate[1]=y for multiple relations.
 *
 * Uses Zod for runtime validation of external API data.
 */

import { parseStrapiResponse, strapiSiteAlertSchema } from './strapi-schemas';
import type {
  StrapiResponse,
  StrapiPage,
  StrapiBlogPost,
  StrapiBlogCategory,
  StrapiPressRelease,
  StrapiPressReleaseCategory,
  StrapiPagination,
  StrapiEvent,
  StrapiSiteAlert,
  StrapiNavItem,
  StrapiThemeOptions,
  StrapiImage,
  StrapiForm,
} from '../types/strapi';

/** Base URL for Strapi API. In dev, empty so Next.js proxy works. */
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  (process.env.NODE_ENV === 'development' ? '' : 'http://localhost:1337');

// -----------------------------------------------------------------------------
// Internal helpers
// -----------------------------------------------------------------------------

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<StrapiResponse<T>> {
  const url = `${STRAPI_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const base = `Strapi API error: ${res.status} ${res.statusText}`;
    const hints: Record<number, string> = {
      400: ' — Invalid query params. Strapi 5 uses status=published and populate[0]=field, populate[1]=field.',
      403: ' — Enable permissions: Strapi Admin → Settings → Users & Permissions → Roles → Public → enable find for theme-option (and other content types).',
      404: ' — Is Strapi running? Run `cd strapi-backend && npm run develop`.',
    };
    const hint = hints[res.status] ?? '';
    throw new Error(base + hint);
  }

  return res.json();
}

function toArray<T>(data: T | T[] | null | undefined): T[] {
  if (data == null) return [];
  return Array.isArray(data) ? data : [data];
}

// -----------------------------------------------------------------------------
// Image helpers
// -----------------------------------------------------------------------------

/**
 * Resolves a Strapi image to a full URL.
 * Handles absolute URLs and relative paths (e.g. /uploads/...).
 */
export function getStrapiImageUrl(
  image: StrapiImage | null | undefined
): string | null {
  if (!image?.url || typeof image.url !== 'string') return null;
  const url = image.url.trim();
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = STRAPI_URL.replace(/\/$/, '');
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
}

// -----------------------------------------------------------------------------
// Content API
// -----------------------------------------------------------------------------

export async function getPage(slug: string): Promise<StrapiPage | null> {
  const res = await fetchApi<StrapiPage>(
    `/api/pages?filters[slug][$eq]=${encodeURIComponent(slug)}&status=published&populate=*`
  );
  const pages = toArray(res.data) as StrapiPage[];
  return pages[0] ?? null;
}

export async function getPages(): Promise<StrapiPage[]> {
  const res = await fetchApi<StrapiPage>(
    '/api/pages?status=published&sort=title:asc'
  );
  return toArray(res.data) as StrapiPage[];
}

export async function getBlogPost(slug: string): Promise<StrapiBlogPost | null> {
  const res = await fetchApi<StrapiBlogPost>(
    `/api/blog-posts?filters[slug][$eq]=${encodeURIComponent(slug)}&status=published&populate[0]=coverImage&populate[1]=categories&populate[2]=parent`
  );
  const posts = toArray(res.data) as StrapiBlogPost[];
  return posts[0] ?? null;
}

export interface BlogPostsResult {
  data: StrapiBlogPost[];
  meta: { pagination: StrapiPagination };
}

export async function getBlogPosts(opts?: {
  categorySlug?: string;
  page?: number;
  pageSize?: number;
}): Promise<BlogPostsResult> {
  const { categorySlug, page = 1, pageSize = 12 } = opts ?? {};
  let url = `/api/blog-posts?status=published&sort=publishedAt:desc&populate[0]=coverImage&populate[1]=categories&pagination[page]=${page}&pagination[pageSize]=${Math.max(1, Math.min(100, pageSize))}`;
  if (categorySlug) {
    url += `&filters[categories][slug][$eq]=${encodeURIComponent(categorySlug)}`;
  }
  const res = await fetchApi<StrapiBlogPost>(url);
  const data = toArray(res.data) as StrapiBlogPost[];
  const pagination = res.meta?.pagination ?? { page: 1, pageSize, pageCount: 1, total: data.length };
  return { data, meta: { pagination } };
}

export async function getBlogCategories(): Promise<StrapiBlogCategory[]> {
  const res = await fetchApi<StrapiBlogCategory>(
    '/api/blog-categories?status=published&sort=name:asc'
  );
  return toArray(res.data) as StrapiBlogCategory[];
}

export async function getPressRelease(slug: string): Promise<StrapiPressRelease | null> {
  const res = await fetchApi<StrapiPressRelease>(
    `/api/press-releases?filters[slug][$eq]=${encodeURIComponent(slug)}&status=published&populate[0]=coverImage&populate[1]=categories`
  );
  const releases = toArray(res.data) as StrapiPressRelease[];
  return releases[0] ?? null;
}

export interface PressReleasesResult {
  data: StrapiPressRelease[];
  meta: { pagination: StrapiPagination };
}

export async function getPressReleases(opts?: {
  categorySlug?: string;
  page?: number;
  pageSize?: number;
}): Promise<PressReleasesResult> {
  const { categorySlug, page = 1, pageSize = 12 } = opts ?? {};
  let url = `/api/press-releases?status=published&sort=publishedAt:desc&populate[0]=coverImage&populate[1]=categories&pagination[page]=${page}&pagination[pageSize]=${Math.max(1, Math.min(100, pageSize))}`;
  if (categorySlug) {
    url += `&filters[categories][slug][$eq]=${encodeURIComponent(categorySlug)}`;
  }
  const res = await fetchApi<StrapiPressRelease>(url);
  const data = toArray(res.data) as StrapiPressRelease[];
  const pagination = res.meta?.pagination ?? { page: 1, pageSize, pageCount: 1, total: data.length };
  return { data, meta: { pagination } };
}

export async function getPressReleaseCategories(): Promise<StrapiPressReleaseCategory[]> {
  const res = await fetchApi<StrapiPressReleaseCategory>(
    '/api/press-release-categories?status=published&sort=name:asc'
  );
  return toArray(res.data) as StrapiPressReleaseCategory[];
}

export async function getEvents(): Promise<StrapiEvent[]> {
  const res = await fetchApi<StrapiEvent>(
    '/api/events?status=published&sort=startDate:asc&populate[0]=image'
  );
  return toArray(res.data) as StrapiEvent[];
}

// -----------------------------------------------------------------------------
// Navigation (single type: Utility Nav, Primary Nav, Footer Nav modules)
// -----------------------------------------------------------------------------

type NavSubLinkInput = {
  id?: number;
  documentId?: string;
  label: string;
  url: string;
  order?: number;
  openInNewTab?: boolean;
};

type NavLinkInput = {
  id?: number;
  documentId?: string;
  label: string;
  url: string;
  order?: number;
  openInNewTab?: boolean;
  subnav?: NavSubLinkInput[] | null;
};

function toNavItem(
  item: NavLinkInput,
  prefix: string,
  i: number
): StrapiNavItem {
  const docId = item.documentId ?? (item.id != null ? `${prefix}-${item.id}` : `${prefix}-${i}`);
  const subnav: StrapiNavItem[] | undefined = item.subnav && item.subnav.length > 0
    ? [...item.subnav]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((sub, j) => ({
          id: sub.id ?? j,
          documentId: sub.documentId ?? (sub.id != null ? `${prefix}-${i}-sub-${sub.id}` : `${prefix}-${i}-sub-${j}`),
          label: sub.label,
          url: sub.url,
          menu: prefix as 'primary' | 'utility' | 'footer',
          order: sub.order,
          openInNewTab: sub.openInNewTab ?? false,
          createdAt: '',
          updatedAt: '',
        }))
    : undefined;
  return {
    id: item.id ?? i,
    documentId: docId,
    label: item.label,
    url: item.url,
    menu: prefix as 'primary' | 'utility' | 'footer',
    order: item.order ?? i,
    openInNewTab: item.openInNewTab ?? false,
    subnav,
    createdAt: '',
    updatedAt: '',
  };
}

export async function getNavigation(): Promise<{
  utilityNav: StrapiNavItem[];
  primaryNav: StrapiNavItem[];
  footerNav: StrapiNavItem[];
}> {
  let res: Awaited<ReturnType<typeof fetchApi<{
    utilityNav?: NavLinkInput[];
    primaryNav?: NavLinkInput[];
    footerNav?: NavLinkInput[];
  }>>>;
  try {
    res = await fetchApi<{
      utilityNav?: NavLinkInput[];
      primaryNav?: NavLinkInput[];
      footerNav?: NavLinkInput[];
    }>(
      '/api/navigation?status=published&populate=*'
    );
  } catch {
    return { utilityNav: [], primaryNav: [], footerNav: [] };
  }
  const raw = res?.data;
  // Single type: data is the document object directly
  const data = raw != null && !Array.isArray(raw) ? raw : Array.isArray(raw) && raw.length > 0 ? raw[0] : null;
  if (data == null || typeof data !== 'object') {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[getNavigation] No data from Strapi — using defaults. Is Strapi running? (cd strapi-backend && npm run develop)');
    }
    return { utilityNav: [], primaryNav: [], footerNav: [] };
  }
  const d = data as Record<string, unknown> & {
    utilityNav?: NavLinkInput[];
    primaryNav?: NavLinkInput[];
    footerNav?: NavLinkInput[];
  };
  const toNavItems = (arr: NavLinkInput[] | undefined, prefix: string): StrapiNavItem[] =>
    (arr ?? [])
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((item, i) => toNavItem(item, prefix, i));
  return {
    utilityNav: toNavItems(d.utilityNav, 'utility'),
    primaryNav: toNavItems(d.primaryNav, 'primary'),
    footerNav: toNavItems(d.footerNav, 'footer'),
  };
}

// -----------------------------------------------------------------------------
// Theme options (GTM, Marker.io, social links)
// -----------------------------------------------------------------------------

/** Normalize Strapi response: v5 flat format or v4 attributes wrapper */
function normalizeThemeOptions(
  raw: unknown
): StrapiThemeOptions | null {
  if (raw == null || typeof raw !== 'object') return null;
  if (Array.isArray(raw)) return null;
  const obj = raw as Record<string, unknown>;
  // Strapi v4: data.attributes
  const attrs = (obj.attributes ?? obj) as Record<string, unknown>;
  return {
    documentId: (obj.documentId ?? attrs.documentId) as string | undefined,
    siteName: (attrs.siteName ?? obj.siteName) as string | null | undefined,
    logo: (attrs.logo ?? obj.logo) as StrapiThemeOptions['logo'],
    frontendMode: (attrs.frontendMode ?? obj.frontendMode ?? 'react') as 'react' | 'static' | null | undefined,
    showBreadcrumbs: (attrs.showBreadcrumbs ?? obj.showBreadcrumbs) as boolean | undefined,
    blogPostsPerPage: (attrs.blogPostsPerPage ?? obj.blogPostsPerPage) as number | undefined,
    pressReleasesPerPage: (attrs.pressReleasesPerPage ?? obj.pressReleasesPerPage) as number | undefined,
    marker: (attrs.marker ?? obj.marker) as StrapiThemeOptions['marker'],
    gtm: (attrs.gtm ?? obj.gtm) as StrapiThemeOptions['gtm'],
    social: (attrs.social ?? obj.social) as StrapiThemeOptions['social'],
    publishedAt: (attrs.publishedAt ?? obj.publishedAt) as string | null | undefined,
    updatedAt: (attrs.updatedAt ?? obj.updatedAt) as string | undefined,
  };
}

export async function getThemeOptions(): Promise<StrapiThemeOptions | null> {
  try {
    const res = await fetchApi<unknown>(
      '/api/theme-option?status=published&populate=*'
    );
    const data = res.data;
    if (data == null) return null;
    return normalizeThemeOptions(data);
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------------
// Site alerts (scheduled banners)
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Forms (form builder, embeddable)
// -----------------------------------------------------------------------------

export async function getForm(slug: string): Promise<StrapiForm | null> {
  const res = await fetchApi<StrapiForm>(
    `/api/forms/slug/${encodeURIComponent(slug)}`
  );
  const form = res.data;
  if (Array.isArray(form)) return form[0] ?? null;
  return form && typeof form === 'object' ? form : null;
}

export async function getFormBySlug(slug: string): Promise<StrapiForm | null> {
  const res = await fetchApi<StrapiForm>(
    `/api/forms?filters[slug][$eq]=${encodeURIComponent(slug)}&status=published`
  );
  const forms = toArray(res.data) as StrapiForm[];
  return forms[0] ?? null;
}

export async function submitForm(formSlug: string, data: Record<string, string | number | boolean>): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/form-submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: { form: formSlug, ...data },
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { ok: false, error: (err as { error?: { message?: string } })?.error?.message ?? 'Submission failed' };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Submission failed' };
  }
}

// -----------------------------------------------------------------------------
// Site alerts (scheduled banners)
// -----------------------------------------------------------------------------

export async function getSiteAlerts(): Promise<StrapiSiteAlert[]> {
  let raw: Awaited<ReturnType<typeof fetchApi<unknown>>>;
  try {
    raw = await fetchApi<unknown>(
      '/api/site-alerts?status=published&sort[0]=startDate:asc'
    );
  } catch {
    return [];
  }
  const parsed = parseStrapiResponse(raw, strapiSiteAlertSchema, '[getSiteAlerts]');
  const alerts = (parsed ? toArray(parsed.data) : []) as StrapiSiteAlert[];
  const now = new Date();
  return alerts.filter((a) => {
    const start = new Date(a.startDate);
    const end = a.endDate ? new Date(a.endDate) : null;
    return start <= now && (!end || end >= now);
  });
}

// getForms is needed for generateStaticParams in /embed/form/[slug]/page.tsx
export async function getForms(): Promise<StrapiForm[]> {
  const res = await fetchApi<StrapiForm>(
    '/api/forms?status=published&sort=slug:asc'
  );
  return toArray(res.data) as StrapiForm[];
}
