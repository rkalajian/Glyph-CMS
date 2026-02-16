/**
 * Blog post listing with category filter.
 * Reads ?category=slug from URL and fetches posts + categories from Strapi.
 */

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getPage, getBlogPosts, getBlogCategories } from '../lib/strapi';
import { formatDate } from '../utils/format';
import { RichText } from '../components/RichText';
import { DocumentTitle } from '../components/DocumentTitle';
import { Breadcrumb } from '../components/Breadcrumb';
import type { StrapiBlogPost, StrapiBlogCategory, StrapiPage } from '../types/strapi';

export function BlogList() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category') ?? undefined;

  const [page, setPage] = useState<StrapiPage | null>(null);
  const [posts, setPosts] = useState<StrapiBlogPost[]>([]);
  const [categories, setCategories] = useState<StrapiBlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getPage('blog'),
      getBlogPosts(categorySlug),
      getBlogCategories(),
    ])
      .then(([pageData, postsData, categoriesData]) => {
        setPage(pageData ?? null);
        setPosts(postsData);
        setCategories(categoriesData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [categorySlug]);

  if (loading) {
    return (
      <article aria-busy="true" aria-live="polite">
        <p>Loading posts…</p>
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

  const title = page?.seoTitle ?? page?.title ?? 'Blog';
  const displayTitle = page?.title ?? 'Blog';
  const subtitle = page?.subtitle ?? 'Latest posts';

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
          <nav aria-label="Blog categories" className="mt-4">
            <ul className="flex flex-wrap gap-2 list-none m-0 p-0">
              <li>
                <Link
                  to="/blog"
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
                    to={`/blog?category=${encodeURIComponent(cat.slug)}`}
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

      {posts.length === 0 ? (
        <p>No posts yet{categorySlug ? ' in this category' : ''}.</p>
      ) : (
        <ul className="list-none p-0 m-0 space-y-8" role="list">
          {posts.map((post) => (
            <li key={post.documentId}>
              <article className="border-b border-border pb-6">
                <h2 className="text-xl font-semibold mb-2">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-fg hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
                  >
                    {post.title}
                  </Link>
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted mb-2">
                  <time dateTime={post.publishedAt ?? post.createdAt}>
                    {formatDate(post.publishedAt ?? post.createdAt)}
                  </time>
                  {post.categories && post.categories.length > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <ul className="flex flex-wrap gap-2 list-none m-0 p-0" role="list">
                        {post.categories.map((cat) => (
                          <li key={cat.documentId}>
                            <Link
                              to={`/blog?category=${encodeURIComponent(cat.slug)}`}
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
                {post.excerpt && (
                  <p className="text-muted">{post.excerpt}</p>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
