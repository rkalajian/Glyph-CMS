/**
 * Fetches Strapi data in Node for build-time prerender.
 * Returns data in the same shape as the frontend strapi module.
 */

const BASE = (process.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');

async function fetchApi(endpoint) {
  const url = `${BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Strapi ${res.status}: ${url}`);
  return res.json();
}

function toArray(data) {
  if (data == null) return [];
  return Array.isArray(data) ? data : [data];
}

function normalizeThemeOptions(raw) {
  if (raw == null || typeof raw !== 'object') return null;
  if (Array.isArray(raw)) return null;
  const obj = raw;
  const attrs = obj.attributes ?? obj;
  return {
    documentId: obj.documentId ?? attrs.documentId,
    siteName: attrs.siteName ?? obj.siteName,
    logo: attrs.logo ?? obj.logo,
    frontendMode: attrs.frontendMode ?? obj.frontendMode ?? 'react',
    showBreadcrumbs: attrs.showBreadcrumbs ?? obj.showBreadcrumbs,
    blogPostsPerPage: attrs.blogPostsPerPage ?? obj.blogPostsPerPage,
    pressReleasesPerPage: attrs.pressReleasesPerPage ?? obj.pressReleasesPerPage,
    marker: attrs.marker ?? obj.marker,
    gtm: attrs.gtm ?? obj.gtm,
    social: attrs.social ?? obj.social,
    publishedAt: attrs.publishedAt ?? obj.publishedAt,
    updatedAt: attrs.updatedAt ?? obj.updatedAt,
  };
}

function toNavItem(item, prefix, i) {
  const docId = item.documentId ?? `${prefix}-${i}`;
  const subnav = item.subnav?.length
    ? item.subnav
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((sub, j) => ({
          id: sub.id ?? j,
          documentId: sub.documentId ?? `${prefix}-${i}-sub-${j}`,
          label: sub.label,
          url: sub.url,
          menu: prefix,
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
    menu: prefix,
    order: item.order ?? i,
    openInNewTab: item.openInNewTab ?? false,
    subnav,
    createdAt: '',
    updatedAt: '',
  };
}

export async function fetchPage(slug) {
  const res = await fetchApi(`/api/pages?filters[slug][$eq]=${encodeURIComponent(slug)}&status=published&populate=*`);
  const pages = toArray(res.data);
  return pages[0] ?? null;
}

export async function fetchThemeOptions() {
  const res = await fetchApi('/api/theme-option?status=published&populate=*');
  if (res.data == null) return null;
  return normalizeThemeOptions(res.data);
}

export async function fetchNavigation() {
  const res = await fetchApi('/api/navigation?status=published&populate=*');
  const data = res?.data;
  const d = data != null && !Array.isArray(data) ? data : Array.isArray(data) && data.length ? data[0] : null;
  if (d == null) return { utilityNav: [], primaryNav: [], footerNav: [] };
  const toNav = (arr, prefix) =>
    (arr ?? []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((item, i) => toNavItem(item, prefix, i));
  return {
    utilityNav: toNav(d.utilityNav, 'utility'),
    primaryNav: toNav(d.primaryNav, 'primary'),
    footerNav: toNav(d.footerNav, 'footer'),
  };
}

export async function fetchBlogPosts(opts = {}) {
  const { categorySlug, page = 1, pageSize = 12 } = opts;
  let url = `/api/blog-posts?status=published&sort=publishedAt:desc&populate[0]=coverImage&populate[1]=categories&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  if (categorySlug) url += `&filters[categories][slug][$eq]=${encodeURIComponent(categorySlug)}`;
  const res = await fetchApi(url);
  const data = toArray(res.data);
  const pagination = res.meta?.pagination ?? { page: 1, pageSize, pageCount: 1, total: data.length };
  return { data, meta: { pagination } };
}

export async function fetchBlogCategories() {
  const res = await fetchApi('/api/blog-categories?status=published&sort=name:asc');
  return toArray(res.data);
}

export async function fetchPressReleases(opts = {}) {
  const { categorySlug, page = 1, pageSize = 12 } = opts;
  let url = `/api/press-releases?status=published&sort=publishedAt:desc&populate[0]=coverImage&populate[1]=categories&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  if (categorySlug) url += `&filters[categories][slug][$eq]=${encodeURIComponent(categorySlug)}`;
  const res = await fetchApi(url);
  const data = toArray(res.data);
  const pagination = res.meta?.pagination ?? { page: 1, pageSize, pageCount: 1, total: data.length };
  return { data, meta: { pagination } };
}

export async function fetchPressReleaseCategories() {
  const res = await fetchApi('/api/press-release-categories?status=published&sort=name:asc');
  return toArray(res.data);
}

export async function fetchEvents() {
  const res = await fetchApi('/api/events?status=published&sort=startDate:asc');
  return toArray(res.data);
}

export async function fetchPreloadForRoute(route) {
  const [nav, themeOptions] = await Promise.all([fetchNavigation(), fetchThemeOptions()]);
  const pageSize = themeOptions?.blogPostsPerPage ?? 12;
  const pressPageSize = themeOptions?.pressReleasesPerPage ?? 12;

  if (route === '/') {
    const page = await fetchPage('home');
    return { nav, themeOptions, route, page };
  }
  if (route === '/blog') {
    const [page, { data: posts, meta }, categories] = await Promise.all([
      fetchPage('blog'),
      fetchBlogPosts({ page: 1, pageSize }),
      fetchBlogCategories(),
    ]);
    return { nav, themeOptions, route, page, posts, pagination: meta.pagination, categories };
  }
  if (route === '/press') {
    const [page, { data: releases, meta }, categories] = await Promise.all([
      fetchPage('press'),
      fetchPressReleases({ page: 1, pageSize: pressPageSize }),
      fetchPressReleaseCategories(),
    ]);
    return { nav, themeOptions, route, page, releases, pagination: meta.pagination, categories };
  }
  if (route === '/events') {
    const [page, events] = await Promise.all([fetchPage('events'), fetchEvents()]);
    return { nav, themeOptions, route, page, events };
  }
  if (route === '/contact') {
    const page = await fetchPage('contact');
    return { nav, themeOptions, route, page };
  }
  return { nav, themeOptions, route };
}
