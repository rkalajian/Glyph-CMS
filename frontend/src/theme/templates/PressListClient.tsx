'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getPressReleases, getStrapiImageUrl } from '../../lib/strapi';
import { formatDate } from '../../utils/format';
import { RichText } from '../../components/RichText';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Pagination } from '../../components/Pagination';
import type { StrapiPressRelease, StrapiPressReleaseCategory, StrapiPage } from '../../types/strapi';

const MotionLink = motion(Link);

interface PressListClientProps {
  page: StrapiPage | null;
  categories: StrapiPressReleaseCategory[];
  pageSize: number;
}

export function PressListClient({ page, categories, pageSize }: PressListClientProps) {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category') ?? undefined;
  const pageNum = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);

  const [releases, setReleases] = useState<StrapiPressRelease[]>([]);
  const [pagination, setPagination] = useState<{ page: number; pageSize: number; pageCount: number; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    getPressReleases({ categorySlug, page: pageNum, pageSize })
      .then(({ data, meta }) => {
        setReleases(data);
        setPagination(meta.pagination);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [categorySlug, pageNum, pageSize]);

  if (loading) {
    return (
      <article aria-busy="true">
        <p>Loading releases…</p>
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

  const displayTitle = page?.title ?? 'Press';
  const subtitle = page?.subtitle ?? 'Latest announcements';

  return (
    <article>
      <header className="mb-8">
        <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: displayTitle }]} />
        <h1 className="text-3xl font-bold mb-2">{displayTitle}</h1>
        {subtitle && <p className="text-muted mb-4">{subtitle}</p>}
        {page?.content && (
          <div className="mb-4">
            <RichText content={page.content} />
          </div>
        )}

        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 my-4">
            <Link href="/press" className={`px-3 py-1 rounded text-sm ${!categorySlug ? 'bg-accent text-white' : 'bg-border text-fg'}`}>
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.documentId}
                href={`/press?category=${encodeURIComponent(cat.slug)}`}
                className={`px-3 py-1 rounded text-sm ${categorySlug === cat.slug ? 'bg-accent text-white' : 'bg-border text-fg'}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {releases && releases.length > 0 ? (
        <>
          <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
            {releases.map((release) => {
              const coverUrl = getStrapiImageUrl(release.coverImage);
              return (
                <MotionLink
                  key={release.documentId}
                  href={`/press/${release.slug}`}
                  className="group block rounded-lg border border-border overflow-hidden hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {coverUrl && (
                    <img
                      src={coverUrl}
                      alt={release.coverImage?.alternativeText ?? release.title}
                      width={release.coverImage?.width ?? 400}
                      height={release.coverImage?.height ?? 250}
                      loading="lazy"
                      className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                    />
                  )}
                  <div className="p-4">
                    <h2 className="font-semibold mb-2 group-hover:text-accent transition-colors">
                      {release.title}
                    </h2>
                    <p className="text-sm text-muted mb-3">{release.excerpt}</p>
                    <time className="text-xs text-muted" dateTime={release.publishedAt ?? release.createdAt}>
                      {formatDate(release.publishedAt ?? release.createdAt)}
                    </time>
                  </div>
                </MotionLink>
              );
            })}
          </div>

          {pagination && (
            <Pagination
              meta={pagination}
              basePath="/press"
              searchParams={{ ...(categorySlug && { category: categorySlug }) }}
              pageParam="page"
            />
          )}
        </>
      ) : (
        <p className="text-muted">No press releases found.</p>
      )}
    </article>
  );
}
