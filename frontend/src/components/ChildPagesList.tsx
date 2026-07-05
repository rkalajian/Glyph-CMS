import Link from 'next/link';
import type { StrapiPage } from '../types/strapi';

interface ChildPagesListProps {
  pages: StrapiPage[];
}

/**
 * Server-rendered list of child pages — gives crawlers real <a> links to
 * subsections (SEO) and gives visitors an "In this section" index.
 */
export function ChildPagesList({ pages }: ChildPagesListProps) {
  if (!pages || pages.length === 0) return null;

  return (
    <nav className="my-12 lg:my-16" aria-label="Subsections">
      <h2 className="text-2xl font-bold text-fg mb-6 lg:mb-8">In this section</h2>
      <ul className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {pages.map((page) => (
          <li key={page.documentId}>
            <Link
              href={`/pages/${page.slug}`}
              className="block font-semibold text-fg hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-2 py-1 transition-colors"
            >
              {page.title}
            </Link>
            {page.subtitle && (
              <p className="text-sm text-muted mt-2 m-0">{page.subtitle}</p>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
