'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { search } from '@/lib/strapi';
import type { StrapiSearchContentTypeConfig, StrapiSearchResult } from '../types/strapi';

const STRAPI_PUBLIC_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

function imageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('//')) return url;
  return `${STRAPI_PUBLIC_URL}${url}`;
}

interface SearchPageProps {
  searchConfig: StrapiSearchContentTypeConfig[];
}

const LABEL_DEFAULTS: Record<string, string> = {
  'pages': 'Pages',
  'blog-posts': 'Blog Posts',
  'press-releases': 'Press Releases',
  'events': 'Events',
};

export function SearchPage({ searchConfig }: SearchPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQ = searchParams.get('q') ?? '';
  const initialTypes = searchParams.get('types')?.split(',').filter(Boolean) ?? [];

  const [query, setQuery] = useState(initialQ);
  const [activeTypes, setActiveTypes] = useState<string[]>(initialTypes);
  const [results, setResults] = useState<StrapiSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Enabled content types from config; fall back to all known types
  const enabledTypes: Array<{ type: string; label: string }> = searchConfig.length
    ? searchConfig
        .filter((c) => c.enabled !== false)
        .map((c) => ({
          type: c.contentType,
          label: c.label?.trim() || LABEL_DEFAULTS[c.contentType] || c.contentType,
        }))
    : Object.entries(LABEL_DEFAULTS).map(([type, label]) => ({ type, label }));

  const runSearch = useCallback(async (q: string, types: string[]) => {
    if (q.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const res = await search(q.trim(), types.length ? types : undefined);
      setResults(res.data);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync URL params → state on mount
  useEffect(() => {
    if (initialQ.length >= 2) runSearch(initialQ, initialTypes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce query changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (activeTypes.length) params.set('types', activeTypes.join(','));
      router.replace(`/search?${params}`, { scroll: false });
      runSearch(query, activeTypes);
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, activeTypes, router, runSearch]);

  function toggleType(type: string) {
    setActiveTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  // Group results by type for display
  const grouped: Record<string, StrapiSearchResult[]> = {};
  for (const r of results) {
    if (!grouped[r.type]) grouped[r.type] = [];
    grouped[r.type].push(r);
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search</h1>

        {enabledTypes.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 mb-4" role="group" aria-label="Filter by type">
            <span className="text-sm text-muted">Filter:</span>
            {enabledTypes.map(({ type, label }) => {
              const active = activeTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleType(type)}
                  aria-pressed={active}
                  className={`min-h-[32px] px-3 py-1 rounded-full text-sm border transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    active
                      ? 'bg-accent text-white border-accent'
                      : 'bg-transparent text-fg border-border hover:border-fg'
                  }`}
                >
                  {label}
                  {active && (
                    <span className="ml-1.5 text-xs opacity-80">{grouped[type]?.length ?? 0}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {!searched && !loading && (
          <p className="text-sm text-muted mb-2">Enter at least 2 characters to search.</p>
        )}

        <div className="relative max-w-xl">
          <label htmlFor="site-search" className="sr-only">Search the site</label>
          <input
            ref={inputRef}
            id="site-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="w-full min-h-[44px] px-4 py-2.5 rounded-lg border border-border bg-bg text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            autoComplete="off"
          />
          {loading && (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-border border-t-accent animate-spin"
              aria-hidden="true"
            />
          )}
        </div>
      </header>

      <div aria-live="polite">
        {searched && results.length === 0 && !loading && (
          <p className="text-muted">No results found for &ldquo;{query}&rdquo;.</p>
        )}

        {searched && results.length > 0 && (
          <p className="text-sm text-muted mb-6">
            {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>
        )}

        {Object.entries(grouped).map(([type, items]) => {
          const typeLabel = enabledTypes.find((t) => t.type === type)?.label ?? type;
          return (
            <section key={type} className="mb-10" aria-label={typeLabel}>
              <h2 className="text-xl font-semibold mb-4">{typeLabel}</h2>
              <ul className="list-none m-0 p-0 space-y-4" role="list">
                {items.map((item) => (
                  <li key={item.documentId}>
                    <Link
                      href={item.url}
                      className="flex gap-4 items-start rounded-lg border border-border p-4 hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                    >
                      {item.image?.url && (
                        <img
                          src={imageUrl(item.image.url)}
                          alt={item.image.alternativeText ?? item.title}
                          width={80}
                          height={60}
                          className="w-20 h-15 object-cover rounded shrink-0"
                          loading="lazy"
                        />
                      )}
                      <span className="flex flex-col gap-1 min-w-0">
                        <span className="font-semibold text-fg">{item.title}</span>
                        {item.excerpt && (
                          <span className="text-sm text-muted line-clamp-2">{item.excerpt}</span>
                        )}
                        <span className="text-xs text-muted truncate">{item.url}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
