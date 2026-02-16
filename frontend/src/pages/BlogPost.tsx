/**
 * Single blog post template.
 * Fetches post by slug, renders cover image, metadata, and rich text content.
 */

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPost, getStrapiImageUrl } from '../lib/strapi';
import { formatDate } from '../utils/format';
import { DocumentTitle } from '../components/DocumentTitle';
import { RichText } from '../components/RichText';
import { Breadcrumb } from '../components/Breadcrumb';
import type { StrapiBlogPost } from '../types/strapi';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<StrapiBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    getBlogPost(slug)
      .then(setPost)
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

  if (error || !post) {
    return (
      <article>
        <h1>Post not found</h1>
        <p>{error ?? 'The requested post could not be found.'}</p>
        <Link to="/blog" className="text-accent hover:underline">
          Back to blog
        </Link>
      </article>
    );
  }

  const coverUrl = getStrapiImageUrl(post.coverImage);

  return (
    <article>
      <DocumentTitle title={post.seoTitle ?? post.title} />
      <header className="mb-8">
        <Breadcrumb
          items={
            post.parent
              ? [
                  { label: 'Blog', url: '/blog' },
                  { label: post.parent.title, url: `/blog/${post.parent.slug}` },
                  { label: post.title },
                ]
              : [
                  { label: 'Blog', url: '/blog' },
                  { label: post.title },
                ]
          }
        />
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-muted mb-2">
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
        {coverUrl && (
          <figure className="mt-4">
            <img
              src={coverUrl}
              alt={post.coverImage?.alternativeText ?? post.title}
              className="w-full max-h-96 object-cover rounded-lg"
            />
          </figure>
        )}
      </header>
      <RichText content={post.content} />
    </article>
  );
}
