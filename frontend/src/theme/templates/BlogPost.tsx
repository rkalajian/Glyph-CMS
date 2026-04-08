'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { getStrapiImageUrl } from '../../lib/strapi';
import { formatDate } from '../../utils/format';
import { RichText } from '../../components/RichText';
import { Breadcrumb } from '../../components/Breadcrumb';
import type { StrapiBlogPost } from '../../types/strapi';

const MotionLink = motion(Link);

interface BlogPostProps {
  post: StrapiBlogPost;
}

export function BlogPost({ post }: BlogPostProps) {
  const coverUrl = getStrapiImageUrl(post.coverImage);

  return (
    <article>
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
                    <MotionLink
                      href={`/blog?category=${encodeURIComponent(cat.slug)}`}
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
              alt={post.coverImage?.alternativeText ?? post.title}
              width={post.coverImage?.width ?? 1200}
              height={post.coverImage?.height ?? 630}
              fetchPriority="high"
              loading="eager"
              className="w-full max-h-96 object-cover rounded-lg"
            />
          </figure>
        )}
      </header>
      <RichText content={post.content} />
    </article>
  );
}
