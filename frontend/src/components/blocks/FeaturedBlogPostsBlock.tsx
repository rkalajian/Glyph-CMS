import './FeaturedBlogPostsBlock.css';
import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedBlogPosts, getLatestPressReleases, getHeaderOptions, getStrapiImageUrl, getFocalPointStyle } from '../../lib/strapi';
import type { StrapiBlockFeaturedBlogPosts, StrapiImage } from '../../types/strapi';

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

function ArrowIcon() {
  return (
    <svg
      className="featured-blog-posts__arrow"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 17L17 7M17 7H7M17 7V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

export async function FeaturedBlogPostsBlock({
  heading,
  description,
  limit,
  contentType,
}: StrapiBlockFeaturedBlogPosts) {
  const isPress = contentType === 'press-release';
  const basePath = isPress ? '/press' : '/blog';

  const [rawItems, headerOptions] = await Promise.all([
    isPress ? getLatestPressReleases(limit ?? 4) : getFeaturedBlogPosts(limit ?? 4),
    getHeaderOptions(),
  ]);

  if (rawItems.length === 0) return null;

  const logoUrl = getStrapiImageUrl(headerOptions?.logo) ?? undefined;

  const items: FeedItem[] = rawItems.map((item) => ({
    documentId: item.documentId,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    displayDate: (item as { displayDate?: string | null }).displayDate,
    publishedAt: item.publishedAt,
    coverImage: item.coverImage,
    categories: item.categories,
  }));

  const [featured, ...sidebar] = items;

  return (
    <section className="featured-blog-posts" aria-label={heading ?? 'Featured posts'}>
      <div className="featured-blog-posts__inner">
        {(heading || description) && (
          <div className="featured-blog-posts__header">
            {heading && <h2 className="featured-blog-posts__heading">{heading}</h2>}
            {description && (
              <p className="featured-blog-posts__description">{description}</p>
            )}
          </div>
        )}

        <div className="featured-blog-posts__grid">
          <Link
            href={`${basePath}/${featured.slug}`}
            className="featured-blog-posts__primary"
            aria-label={featured.title}
          >
            {(getStrapiImageUrl(featured.coverImage) ?? logoUrl) && (
              <div className="featured-blog-posts__primary-image">
                <Image
                  src={getStrapiImageUrl(featured.coverImage) ?? logoUrl ?? ''}
                  alt={featured.coverImage?.alternativeText ?? featured.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 522px"
                  className="object-cover"
                  style={getFocalPointStyle(featured.coverImage)}
                />
              </div>
            )}
            <div>
              <div className="featured-blog-posts__primary-title-row">
                <span className="featured-blog-posts__primary-title">{featured.title}</span>
                <ArrowIcon />
              </div>
              {featured.excerpt && (
                <p className="featured-blog-posts__primary-excerpt">{featured.excerpt}</p>
              )}
            </div>
            <div className="featured-blog-posts__author">
              <span className="featured-blog-posts__author-date">
                {formatDate(featured.displayDate ?? featured.publishedAt)}
              </span>
            </div>
          </Link>

          {sidebar.length > 0 && (
            <div className="featured-blog-posts__sidebar">
              {sidebar.map((item) => (
                <Link
                  key={item.documentId}
                  href={`${basePath}/${item.slug}`}
                  className="featured-blog-posts__sidebar-card"
                  aria-label={item.title}
                >
                  {(getStrapiImageUrl(item.coverImage) ?? logoUrl) && (
                    <div className="featured-blog-posts__sidebar-image">
                      <Image
                        src={getStrapiImageUrl(item.coverImage) ?? logoUrl ?? ''}
                        alt={item.coverImage?.alternativeText ?? item.title}
                        fill
                        sizes="222px"
                        className="object-cover"
                        style={getFocalPointStyle(item.coverImage)}
                      />
                    </div>
                  )}
                  <div className="featured-blog-posts__sidebar-content">
                    <div className="featured-blog-posts__sidebar-title-row">
                      <span className="featured-blog-posts__sidebar-title">{item.title}</span>
                      <ArrowIcon />
                    </div>
                    <div className="featured-blog-posts__author">
                      <span className="featured-blog-posts__author-date">
                        {formatDate(item.displayDate ?? item.publishedAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
