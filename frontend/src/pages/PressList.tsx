/**
 * Press release listing with category filter.
 * Reads ?category=slug from URL and fetches releases + categories from Strapi.
 */

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getPage, getPressReleases, getPressReleaseCategories } from '../lib/strapi';
import { formatDate } from '../utils/format';
import { RichText } from '../components/RichText';
import { DocumentTitle } from '../components/DocumentTitle';
import { Breadcrumb } from '../components/Breadcrumb';
import type { StrapiPressRelease, StrapiPressReleaseCategory, StrapiPage } from '../types/strapi';

export function PressList() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category') ?? undefined;

  const [page, setPage] = useState<StrapiPage | null>(null);
  const [releases, setReleases] = useState<StrapiPressRelease[]>([]);
  const [categories, setCategories] = useState<StrapiPressReleaseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getPage('press'),
      getPressReleases(categorySlug),
      getPressReleaseCategories(),
    ])
      .then(([pageData, releasesData, categoriesData]) => {
        setPage(pageData ?? null);
        setReleases(releasesData);
        setCategories(categoriesData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [categorySlug]);

  if (loading) {
    return (
      <article aria-busy="true" aria-live="polite">
        <p>Loading press releases…</p>
      </article>
    );
  }

  if (error) {
    return (
      <article>
        <h1>Error</h1>
        <p>{error}</p>
      </article>
    );
  }

  const title = page?.seoTitle ?? page?.title ?? 'Press';
  const displayTitle = page?.title ?? 'Press';
  const subtitle = page?.subtitle ?? 'Latest press releases';

  return (
    <article>
      <DocumentTitle title={title} />
      <header className="mb-8">
        <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: displayTitle }]} />
        <h1 className="text-3xl font-bold">{displayTitle}</h1>
        <p className="text-muted mt-2">{subtitle}</p>
        {page?.content && (
          <div className="mt-4">
            <RichText content={page.content} />
          </div>
        )}

        {categories.length > 0 && (
          <nav aria-label="Press categories" className="mt-4">
            <ul className="flex flex-wrap gap-2 list-none m-0 p-0">
              <li>
                <Link
                  to="/press"
                  className={`inline-block px-3 py-2 rounded text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                    !categorySlug
                      ? 'bg-accent text-white'
                      : 'bg-border text-fg hover:bg-accent/20'
                  }`}
                >
                  All
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.documentId}>
                  <Link
                    to={`/press?category=${encodeURIComponent(cat.slug)}`}
                    className={`inline-block px-3 py-2 rounded text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                      categorySlug === cat.slug
                        ? 'bg-accent text-white'
                        : 'bg-border text-fg hover:bg-accent/20'
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {releases.length === 0 ? (
        <p>No press releases yet{categorySlug ? ' in this category' : ''}.</p>
      ) : (
        <ul className="list-none p-0 m-0 space-y-8" role="list">
          {releases.map((release) => (
            <li key={release.documentId}>
              <article className="border-b border-border pb-6">
                <h2 className="text-xl font-semibold mb-2">
                  <Link
                    to={`/press/${release.slug}`}
                    className="text-fg hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
                  >
                    {release.title}
                  </Link>
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted mb-2">
                  <time dateTime={release.publishedAt ?? release.createdAt}>
                    {formatDate(release.publishedAt ?? release.createdAt)}
                  </time>
                  {release.categories && release.categories.length > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <ul className="flex flex-wrap gap-2 list-none m-0 p-0" role="list">
                        {release.categories.map((cat) => (
                          <li key={cat.documentId}>
                            <Link
                              to={`/press?category=${encodeURIComponent(cat.slug)}`}
                              className="text-accent hover:underline"
                            >
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                {release.excerpt && (
                  <p className="text-muted">{release.excerpt}</p>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
