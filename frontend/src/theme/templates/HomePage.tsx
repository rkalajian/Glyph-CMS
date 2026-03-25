/**
 * Home page – editable in CMS.
 * Uses preloaded data when available (static build), otherwise fetches.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePreload } from '../../contexts/PreloadContext';
import { getPage } from '../../lib/strapi';
import { RichText } from '../../components/RichText';
import { DocumentTitle } from '../../components/DocumentTitle';
import { BlockRenderer } from '../../components/blocks/BlockRenderer';
import { LINK_ACCENT } from '../../utils/classes';
import type { StrapiPage } from '../../types/strapi';

export function HomePage() {
  const preload = usePreload();
  const [page, setPage] = useState<StrapiPage | null | undefined>(
    () => (preload?.route === '/' && preload?.page != null ? (preload.page as StrapiPage) : preload?.route === '/' ? null : undefined)
  );

  useEffect(() => {
    if (preload?.route === '/') return;
    getPage('home')
      .then(setPage)
      .catch(() => setPage(null));
  }, [preload]);

  if (page === undefined) {
    return (
      <article aria-busy="true">
        <p>Loading…</p>
      </article>
    );
  }

  const title = page?.seoTitle ?? page?.title ?? 'Welcome';
  const displayTitle = page?.title ?? 'Welcome';
  const subtitle = page?.subtitle ?? 'A simple, templatable CMS powered by Glyph.';
  const quickLinks = (page?.quickLinks?.length ? page.quickLinks : null) as Array<{
    url: string;
    label: string;
  }> | null;
  const hasBlocks = page?.blocks && page.blocks.length > 0;

  if (hasBlocks) {
    return (
      <article>
        <DocumentTitle title={title} />
        <BlockRenderer blocks={page!.blocks} />
      </article>
    );
  }

  return (
    <article>
      <DocumentTitle title={title} />
      <h1 className="text-3xl font-bold mb-4">{displayTitle}</h1>
      <p className="text-lg text-muted mb-6">{subtitle}</p>
      {page?.content && (
        <div className="mb-6">
          <RichText content={page.content} />
        </div>
      )}
      {quickLinks && quickLinks.length > 0 && (
        <nav aria-label="Quick links">
          <ul className="flex gap-4 list-none p-0 m-0 flex-wrap">
            {quickLinks.map(({ url, label }) => {
              const isExternal = url.startsWith('http://') || url.startsWith('https://');
              const linkClass = `${LINK_ACCENT} py-2 px-4`;
              return (
                <li key={`${url}-${label}`}>
                  {isExternal ? (
                    <a href={url} className={linkClass} target="_blank" rel="noopener noreferrer">
                      {label}
                    </a>
                  ) : (
                    <Link to={url} className={linkClass}>
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </article>
  );
}
