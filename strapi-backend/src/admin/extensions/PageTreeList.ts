/**
 * Replaces the Pages CM list view with a flat alphabetical tree:
 *   Parent A
 *     ↳ Child 1
 *     ↳ Child 2
 *   Parent B
 *     ↳ Child 3
 *
 * Strategy:
 *   1. Intercept GET requests to the CM pages list endpoint.
 *   2. Fetch all CM pages (for IDs, draft status, etc.) — no populate needed.
 *   3. Fetch parent relationships from the public REST API, which reliably
 *      supports populate[parent]=true (verified independently).
 *   4. Merge, build tree order, return as a single page with ↳-prefixed children.
 */

const PAGE_UID = 'api::page.page';
const CM_PATH = `/content-manager/collection-types/${PAGE_UID}`;

type CMPage = {
  id: number;
  documentId: string;
  title: string;
  [key: string]: unknown;
};

type CMListResponse = {
  results: CMPage[];
  pagination: { page: number; pageSize: number; pageCount: number; total: number };
  [key: string]: unknown;
};

type RestPage = {
  documentId: string;
  parent?: { documentId: string } | null;
};

function isPageListFetch(url: string): boolean {
  try {
    const u = new URL(url, window.location.origin);
    if (!u.pathname.endsWith(CM_PATH)) return false;
    // Single-doc and action fetches have extra path segments after the UID
    const afterUid = u.pathname.slice(u.pathname.indexOf(CM_PATH) + CM_PATH.length);
    return !afterUid || afterUid === '/';
  } catch {
    return false;
  }
}

function buildTreeList(pages: CMPage[], parentMap: Map<string, string>): CMPage[] {
  // Attach parent info from REST API map
  const withParent = pages.map(p => ({
    ...p,
    _parentDocumentId: parentMap.get(p.documentId) ?? null,
  }));

  const topLevel = withParent
    .filter(p => !p._parentDocumentId)
    .sort((a, b) => a.title.localeCompare(b.title));

  const childMap = new Map<string, typeof withParent>();
  for (const p of withParent) {
    if (p._parentDocumentId) {
      const arr = childMap.get(p._parentDocumentId) ?? [];
      arr.push(p);
      childMap.set(p._parentDocumentId, arr);
    }
  }

  const result: CMPage[] = [];
  for (const parent of topLevel) {
    result.push(parent);
    const children = (childMap.get(parent.documentId) ?? [])
      .sort((a, b) => a.title.localeCompare(b.title));
    for (const child of children) {
      result.push({ ...child, title: '    ↳ ' + child.title });
    }
  }

  // Orphaned entries (parent set but parent page not in list) — append alphabetically
  const placed = new Set(result.map(p => p.documentId));
  withParent
    .filter(p => !placed.has(p.documentId))
    .sort((a, b) => a.title.localeCompare(b.title))
    .forEach(p => result.push(p));

  return result;
}

let busy = false;

export function initPageTreeList() {
  if (typeof window === 'undefined') return;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async function patchedFetch(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    if (busy) return originalFetch(input, init);

    const url =
      input instanceof Request ? input.url :
      input instanceof URL ? input.href :
      String(input);

    const method = (init?.method ?? 'GET').toUpperCase();
    if (method !== 'GET' || !isPageListFetch(url)) {
      return originalFetch(input, init);
    }

    // Forward auth header from the original request
    const srcHeaders = init?.headers ? new Headers(init.headers as HeadersInit) : new Headers();
    const auth = srcHeaders.get('Authorization');
    const authHeaders: Record<string, string> = { Accept: 'application/json' };
    if (auth) authHeaders['Authorization'] = auth;

    busy = true;
    try {
      // Fetch all CM pages (no populate needed — just IDs, titles, status)
      const [cmRes, restRes] = await Promise.all([
        originalFetch(
          `${CM_PATH}?page=1&pageSize=200&sort=title:ASC`,
          { headers: authHeaders }
        ),
        // Fetch parent relationships — explicit field selection required for Strapi 5 populate
        originalFetch(
          `/api/pages?status=published&populate[parent][fields][0]=documentId&fields[0]=documentId&fields[1]=title&pagination[pageSize]=200`
        ),
      ]);

      if (!cmRes.ok) return originalFetch(input, init);

      const cmData: CMListResponse = await cmRes.json();

      // Build documentId → parentDocumentId map from REST API
      const parentMap = new Map<string, string>();
      if (restRes.ok) {
        const restData = await restRes.json() as { data?: RestPage[] };
        for (const p of restData.data ?? []) {
          if (p.parent?.documentId) {
            parentMap.set(p.documentId, p.parent.documentId);
          }
        }
      }

      const ordered = buildTreeList(cmData.results ?? [], parentMap);
      const total = ordered.length;

      const modified: CMListResponse = {
        ...cmData,
        results: ordered,
        pagination: { page: 1, pageSize: total, pageCount: 1, total },
      };

      return new Response(JSON.stringify(modified), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      return originalFetch(input, init);
    } finally {
      busy = false;
    }
  };
}
