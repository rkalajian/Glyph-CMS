'use client';

import './RecentBlogPostsBlock.css';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getStrapiImageUrl, getFocalPointStyle } from '../../lib/strapi';
import type { StrapiImage } from '../../types/strapi';

function ArrowIcon() {
  return (
    <svg className="recent-news__arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M6.5 2L3.5 5L6.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M3.5 2L6.5 5L3.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function getPageNumbers(currentPage: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages: (number | '...')[] = [];
  const add = (n: number) => { if (!pages.includes(n)) pages.push(n); };
  add(1);
  if (currentPage > 3) pages.push('...');
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) add(i);
  if (currentPage < totalPages - 2) pages.push('...');
  add(totalPages);
  return pages;
}

interface FeedItem {
  documentId: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  displayDate?: string | null;
  publishedAt?: string | null;
  coverImage?: StrapiImage | null;
  categories?: Array<{ documentId: string; name: string; slug: string }> | null;
}

interface Props {
  items: FeedItem[];
  heading?: string | null;
  description?: string | null;
  postsPerPage: number;
  logoUrl?: string;
  basePath: string;
}

export function RecentBlogPostsClient({ items, heading, description, postsPerPage, logoUrl, basePath }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / postsPerPage);
  const start = (currentPage - 1) * postsPerPage;
  const pageItems = items.slice(start, start + postsPerPage);
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  if (items.length === 0) return null;

  return (
    <section className="recent-news" aria-label={heading ?? 'Recent news'}>
      <div className="recent-news__inner">
        {(heading || description) && (
          <div className="recent-news__header">
            {heading && <h2 className="recent-news__heading">{heading}</h2>}
            {description && <p className="recent-news__description">{description}</p>}
          </div>
        )}

        <div className="recent-news__grid">
          {pageItems.map((item) => (
            <Link
              key={item.documentId}
              href={`${basePath}/${item.slug}`}
              className="recent-news__card"
              aria-label={item.title}
            >
              <div className="recent-news__image">
                {(getStrapiImageUrl(item.coverImage) ?? logoUrl) && (
                  <Image
                    src={getStrapiImageUrl(item.coverImage) ?? logoUrl ?? ''}
                    alt={item.coverImage?.alternativeText ?? item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px"
                    className="object-cover"
                    style={getFocalPointStyle(item.coverImage)}
                  />
                )}
              </div>
              <div className="recent-news__content">
                <div>
                  <div className="recent-news__title-row">
                    <span className="recent-news__title">{item.title}</span>
                    <ArrowIcon />
                  </div>
                  {item.excerpt && (
                    <p className="recent-news__excerpt">{item.excerpt}</p>
                  )}
                </div>
                <div className="recent-news__meta">
                  <span className="recent-news__date">{formatDate(item.displayDate ?? item.publishedAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <nav className="recent-news__pagination" aria-label="Pagination">
            <button
              className="recent-news__page-btn recent-news__page-btn--prev"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft />
              <span className="recent-news__prev-label">PREVIOUS</span>
            </button>

            <div className="recent-news__page-numbers recent-news__page-numbers--desktop">
              {pageNumbers.map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="recent-news__page-ellipsis" aria-hidden="true">...</span>
                ) : (
                  <button
                    key={p}
                    className={`recent-news__page-num${currentPage === p ? ' recent-news__page-num--active' : ''}`}
                    onClick={() => setCurrentPage(p)}
                    aria-label={`Page ${p}`}
                    aria-current={currentPage === p ? 'page' : undefined}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            <div className="recent-news__page-numbers recent-news__page-numbers--mobile" aria-hidden="true">
              {[currentPage - 1, currentPage, currentPage + 1]
                .filter((p) => p >= 1 && p <= totalPages)
                .map((p) => (
                  <button
                    key={p}
                    className={`recent-news__page-num${currentPage === p ? ' recent-news__page-num--active' : ''}`}
                    onClick={() => setCurrentPage(p)}
                    tabIndex={-1}
                  >
                    {p}
                  </button>
                ))}
            </div>

            <button
              className="recent-news__page-btn recent-news__page-btn--next"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <span className="recent-news__next-label">NEXT</span>
              <ChevronRight />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
