/**
 * Single press release template.
 * Fetches release by slug, renders cover image, metadata, and rich text content.
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { getPressRelease, getStrapiImageUrl } from '../../lib/strapi';
import { formatDate } from '../../utils/format';
import { DocumentTitle } from '../../components/DocumentTitle';
import { RichText } from '../../components/RichText';
import { Breadcrumb } from '../../components/Breadcrumb';
import type { StrapiPressRelease } from '../../types/strapi';

const MotionLink = motion(Link);

export function PressPost() {
  const { slug } = useParams<{ slug: string }>();
  const [release, setRelease] = useState<StrapiPressRelease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    getPressRelease(slug)
      .then(setRelease)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <article aria-busy="true" aria-live="polite">
        <p>Loading…</p>
      </article>
    );
  }

  if (error || !release) {
    return (
      <article>
        <h1>Press release not found</h1>
        <p>{error ?? 'The requested press release could not be found.'}</p>
        <MotionLink to="/press" className="text-accent" whileHover={{ textDecoration: 'underline' }} whileTap={{ scale: 0.98 }}>
          Back to press
        </MotionLink>
      </article>
    );
  }

  const coverUrl = getStrapiImageUrl(release.coverImage);

  return (
    <article>
      <DocumentTitle title={release.seoTitle ?? release.title} />
      <header className="mb-8">
        <Breadcrumb
          items={[
            { label: 'Home', url: '/' },
            { label: 'Press', url: '/press' },
            { label: release.title },
          ]}
        />
        <h1 className="text-3xl font-bold mb-2">{release.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-muted mb-2">
          <time dateTime={release.publishedAt ?? release.createdAt}>
            {formatDate(release.publishedAt ?? release.createdAt)}
          </time>
          {release.categories && release.categories.length > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <ul className="flex flex-wrap gap-2 list-none m-0 p-0" role="list">
                {release.categories.map((cat) => (
                  <li key={cat.documentId}>
                    <MotionLink
                      to={`/press?category=${encodeURIComponent(cat.slug)}`}
                      className="text-accent"
                      whileHover={{ textDecoration: 'underline' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {cat.name}
                    </MotionLink>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        {coverUrl && (
          <figure className="mt-4">
            <img
              src={coverUrl}
              alt={release.coverImage?.alternativeText ?? release.title}
              width={release.coverImage?.width ?? 1200}
              height={release.coverImage?.height ?? 630}
              fetchPriority="high"
              loading="eager"
              className="w-full max-h-96 object-cover rounded-lg"
            />
          </figure>
        )}
      </header>
      <RichText content={release.content} />
    </article>
  );
}
