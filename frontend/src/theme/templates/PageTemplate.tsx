/**
 * Template for Strapi Pages
 * Renders CMS page content by slug
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPage } from '../../lib/strapi';
import { DocumentTitle } from '../../components/DocumentTitle';
import { RichText } from '../../components/RichText';
import { Breadcrumb } from '../../components/Breadcrumb';
import { BlockRenderer } from '../../components/blocks/BlockRenderer';
import type { StrapiPage } from '../../types/strapi';

export function PageTemplate() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<StrapiPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    getPage(slug)
      .then(setPage)
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

  if (error || !page) {
    return (
      <article>
        <h1>Page not found</h1>
        <p>{error ?? 'The requested page could not be found.'}</p>
      </article>
    );
  }

  const title = page.seoTitle ?? page.title;

  const breadcrumbItems = page.parent
    ? [
        { label: 'Home', url: '/' },
        { label: page.parent.title, url: `/pages/${page.parent.slug}` },
        { label: page.title },
      ]
    : [{ label: 'Home', url: '/' }, { label: page.title }];

  const hasBlocks = page.blocks && page.blocks.length > 0;

  return (
    <article>
      <DocumentTitle title={title} />
      <header className="mb-8">
        <Breadcrumb items={breadcrumbItems} />
        {!hasBlocks && <h1 className="text-3xl font-bold">{page.title}</h1>}
      </header>
      {hasBlocks ? <BlockRenderer blocks={page.blocks} /> : <RichText content={page.content} />}
    </article>
  );
}
