/**
 * Blog post listing with category filter.
 * Reads ?category=slug from URL and fetches posts + categories from Strapi.
 */

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPage, getBlogPosts, getBlogCategories, getStrapiImageUrl } from '../../lib/strapi';
import { formatDate } from '../../utils/format';
import { RichText } from '../../components/RichText';
import { DocumentTitle } from '../../components/DocumentTitle';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Pagination } from '../../components/Pagination';
import { useThemeOptions } from '../../contexts/ThemeContext';
import type { StrapiBlogPost, StrapiBlogCategory, StrapiPage } from '../../types/strapi';

const MotionLink = motion(Link);

export function BlogList() {
  const [searchParams] = useSearchParams();
  const themeOptions = useThemeOptions();
  const categorySlug = searchParams.get('category') ?? undefined;
  const pageNum = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const pageSize = Math.max(1, Math.min(100, themeOptions?.blogPostsPerPage ?? 12));

  const [page, setPage] = useState<StrapiPage | null>(null);
  const [posts, setPosts] = useState<StrapiBlogPost[]>([]);
  const [pagination, setPagination] = useState<{ page: number; pageSize: number; pageCount: number; total: number } | null>(null);
  const [categories, setCategories] = useState<StrapiBlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getPage('blog'),
      getBlogPosts({ categorySlug, page: pageNum, pageSize }),
      getBlogCategories(),
    ])
      .then(([pageData, { data: postsData, meta }, categoriesData]) => {
        setPage(pageData ?? null);
        setPosts(postsData);
        setPagination(meta.pagination);
        setCategories(categoriesData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [categorySlug, pageNum, pageSize]);

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
                <MotionLink
                  to="/blog"
                  className={`inline-block px-3 py-2 rounded text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                    !categorySlug
                      ? 'bg-accent text-white'
                      : 'bg-border text-fg'
                  }`}
                  whileHover={!categorySlug ? undefined : { backgroundColor: 'rgba(37, 99, 235, 0.2)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  All
                </MotionLink>
              </li>
              {categories.map((cat) => (
                <li key={cat.documentId}>
                  <MotionLink
                    to={`/blog?category=${encodeURIComponent(cat.slug)}`}
                    className={`inline-block px-3 py-2 rounded text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                      categorySlug === cat.slug
                        ? 'bg-accent text-white'
                        : 'bg-border text-fg'
                    }`}
                    whileHover={categorySlug === cat.slug ? undefined : { backgroundColor: 'rgba(37, 99, 235, 0.2)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {cat.name}
                  </MotionLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {posts.length === 0 ? (
        <p>No posts yet{categorySlug ? ' in this category' : ''}.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0" role="list">
          {posts.map((post, index) => {
            const coverUrl = getStrapiImageUrl(post.coverImage);
            const isFirstImage = index === 0;
            return (
              <li key={post.documentId}>
                <motion.article
                  className="flex flex-col h-full rounded-lg border border-border overflow-hidden bg-bg"
                  whileHover={{ borderColor: 'rgba(37, 99, 235, 0.3)' }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-t-lg"
                  >
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={post.coverImage?.alternativeText ?? post.title}
                        width={post.coverImage?.width ?? 640}
                        height={post.coverImage?.height ?? 400}
                        loading={isFirstImage ? 'eager' : 'lazy'}
                        fetchPriority={isFirstImage ? 'high' : undefined}
                        className="w-full aspect-16/10 object-cover"
                      />
                    ) : (
                      <div
                        className="w-full aspect-16/10 bg-border flex items-center justify-center text-muted text-sm"
                        aria-hidden
                      >
                        No image
                      </div>
                    )}
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="text-lg font-semibold mb-2">
                      <MotionLink
                        to={`/blog/${post.slug}`}
                        className="text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 rounded line-clamp-2"
                        whileHover={{ color: 'var(--color-accent)' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {post.title}
                      </MotionLink>
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
                                <MotionLink
                                  to={`/blog?category=${encodeURIComponent(cat.slug)}`}
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
                    {post.excerpt && (
                      <p className="text-muted text-sm line-clamp-3 flex-1">{post.excerpt}</p>
                    )}
                  </div>
                </motion.article>
              </li>
            );
          })}
        </ul>
      )}
      {pagination && pagination.pageCount > 1 && (
        <Pagination
          meta={pagination}
          basePath="/blog"
          searchParams={categorySlug ? { category: categorySlug } : undefined}
        />
      )}
    </article>
  );
}
