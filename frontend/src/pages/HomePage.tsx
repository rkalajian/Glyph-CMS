/**
 * Home page – editable in CMS.
 * Fetches the Page with slug "home". Falls back to defaults if none exists.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPage } from '../lib/strapi';
import { RichText } from '../components/RichText';
import { DocumentTitle } from '../components/DocumentTitle';
import { LINK_ACCENT } from '../utils/classes';
import type { StrapiPage } from '../types/strapi';

const DEFAULT_QUICK_LINKS = [
  { url: '/blog', label: 'Read the blog' },
  { url: '/press', label: 'Press releases' },
  { url: '/events', label: 'View events' },
  { url: '/contact', label: 'Contact us' },
];

export function HomePage() {
  const [page, setPage] = useState<StrapiPage | null | undefined>(undefined);

  useEffect(() => {
    getPage('home')
      .then(setPage)
      .catch(() => setPage(null));
  }, []);

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
  const quickLinks = (page?.quickLinks?.length ? page.quickLinks : DEFAULT_QUICK_LINKS) as Array<{
    url: string;
    label: string;
  }>;

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
    </article>
  );
}
