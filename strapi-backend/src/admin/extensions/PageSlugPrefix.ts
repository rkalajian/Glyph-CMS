/**
 * On the Page edit view, renders the parent-path prefix as a locked, inline
 * segment to the left of the slug input:
 *
 *   [about-us/] [careers           ][↺]
 *
 * Parent detection uses the public REST API (same approach as PageTreeList) —
 * the CM detail response does not reliably populate relation fields.
 */

const PAGE_UID   = 'api::page.page';
const CM_PREFIX  = `/content-manager/collection-types/${PAGE_UID}`;
// Matches /content-manager/collection-types/api::page.page/<documentId>
const DOC_ID_RE  = new RegExp(`${CM_PREFIX.replace('.', '\\.')}/([a-z0-9]+)(?:/|\\?|$)`);

const PREFIX_ID  = 'czp-slug-prefix';
const STYLES_ID  = 'czp-slug-prefix-styles';

const STYLES = `
#${PREFIX_ID} {
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-right: none;
  border-radius: 4px 0 0 4px;
  font-size: 13px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: #475569;
  white-space: nowrap;
  user-select: none;
  cursor: default;
  flex-shrink: 0;
  line-height: 1;
}
#${PREFIX_ID} + input,
#${PREFIX_ID} ~ input {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  border-left-color: transparent !important;
}
`;

function injectStyles() {
  if (document.getElementById(STYLES_ID)) return;
  const style = document.createElement('style');
  style.id = STYLES_ID;
  style.textContent = STYLES;
  document.head.appendChild(style);
}

function isOnPageEdit(): boolean {
  return window.location.pathname.startsWith(CM_PREFIX + '/') &&
    !window.location.pathname.endsWith('/create');
}

function currentDocId(): string | null {
  const m = window.location.pathname.match(DOC_ID_RE);
  return m ? m[1] : null;
}

function findSlugInput(): HTMLInputElement | null {
  const byId = document.getElementById('slug');
  if (byId instanceof HTMLInputElement) return byId;
  return document.querySelector<HTMLInputElement>('input[name="slug"]');
}

function removePrefix(): void {
  const el = document.getElementById(PREFIX_ID);
  if (!el) return;
  const parent = el.parentElement;
  el.remove();
  if (parent && !parent.querySelector(`#${PREFIX_ID}`)) {
    parent.style.removeProperty('display');
    parent.style.removeProperty('align-items');
  }
}

function setInputLeaf(input: HTMLInputElement, leaf: string): void {
  if (input.value === leaf) return;
  const nativeSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype, 'value'
  )?.set;
  if (nativeSetter) {
    nativeSetter.call(input, leaf);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

let inputStripped = false;

function updateDisplay(parentSlug?: string | null): void {
  if (!isOnPageEdit()) {
    removePrefix();
    inputStripped = false;
    return;
  }

  const input = findSlugInput();
  if (!input) { removePrefix(); return; }

  const value = input.value;

  // Derive prefix from stored slug or known parent
  let prefix: string | null = null;
  if (value.includes('/')) {
    prefix = value.slice(0, value.lastIndexOf('/') + 1);
    if (!inputStripped) {
      inputStripped = true;
      setInputLeaf(input, value.slice(value.lastIndexOf('/') + 1));
    }
  } else if (parentSlug) {
    prefix = parentSlug.endsWith('/') ? parentSlug : `${parentSlug}/`;
  }

  if (!value.includes('/') && !parentSlug) inputStripped = false;

  if (!prefix) { removePrefix(); return; }

  let el = document.getElementById(PREFIX_ID);
  if (!el) {
    el = document.createElement('span');
    el.id = PREFIX_ID;
    el.setAttribute('aria-hidden', 'true');
    const row = input.parentElement;
    if (!row) return;
    row.insertBefore(el, input);
    row.style.display = 'flex';
    row.style.alignItems = 'stretch';
  }
  el.textContent = prefix;
}

// ─── REST-based parent detection ─────────────────────────────────────────────

const parentSlugCache  = new Map<string, string | null>(); // docId → parent slug or null
let   latestDocId: string | null = null;

async function fetchAndDisplayParent(docId: string): Promise<void> {
  if (parentSlugCache.has(docId)) {
    updateDisplay(parentSlugCache.get(docId));
    return;
  }

  try {
    const res = await fetch(
      `/api/pages?filters[documentId][$eq]=${docId}&populate[parent][fields][0]=slug&fields[0]=documentId&pagination[pageSize]=1`,
      { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json() as { data?: Array<{ documentId: string; parent?: { slug: string } | null }> };
    const page  = data?.data?.[0];
    const slug  = page?.parent?.slug ?? null;
    parentSlugCache.set(docId, slug);
    if (docId === latestDocId) updateDisplay(slug);
  } catch {
    parentSlugCache.set(docId, null);
  }
}

function checkCurrentPage(): void {
  if (!isOnPageEdit()) {
    latestDocId = null;
    removePrefix();
    inputStripped = false;
    return;
  }

  const docId = currentDocId();
  if (!docId) return;

  if (docId !== latestDocId) {
    latestDocId = docId;
    inputStripped = false;
    // If we already have cached data, show immediately; otherwise fetch
    if (parentSlugCache.has(docId)) {
      updateDisplay(parentSlugCache.get(docId));
    } else {
      fetchAndDisplayParent(docId);
    }
  } else {
    // Same page, just re-render (e.g. after React re-render cleared the element)
    const slug = parentSlugCache.has(docId) ? (parentSlugCache.get(docId) ?? null) : null;
    updateDisplay(slug);
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────

export function initPageSlugPrefix() {
  if (typeof window === 'undefined') return;

  injectStyles();

  let debounce: ReturnType<typeof setTimeout> | null = null;
  let lastPath = '';

  const observer = new MutationObserver(() => {
    if (debounce) clearTimeout(debounce);
    debounce = setTimeout(() => {
      debounce = null;
      const path = window.location.pathname;

      if (path !== lastPath) {
        lastPath = path;
        if (!isOnPageEdit()) {
          latestDocId = null;
          removePrefix();
          inputStripped = false;
          return;
        }
      }

      checkCurrentPage();
    }, 150);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Re-run when slug value changes (title-based regeneration)
  document.addEventListener('input', (e) => {
    const target = e.target as HTMLElement;
    if (target.id === 'slug' || (target as HTMLInputElement).name === 'slug') {
      const slug = latestDocId ? (parentSlugCache.get(latestDocId) ?? null) : null;
      updateDisplay(slug);
    }
  }, true);
}
