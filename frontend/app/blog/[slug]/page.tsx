/* eslint-disable react-refresh/only-export-components */
import { notFound } from 'next/navigation';
import { getBlogPost, getBlogPosts } from '@/lib/strapi';
import { buildPageMetadata } from '@/lib/metadata';
import { BlogPost as BlogPostTemplate } from '@/theme/templates/BlogPost';

export async function generateStaticParams() {
  let page = 1;
  const slugs: string[] = [];

  while (true) {
    const { data, meta } = await getBlogPosts({ pageSize: 100, page });
    slugs.push(...data.map((p) => p.slug));
    if (page >= meta.pagination.pageCount) break;
    page++;
  }

  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  return buildPageMetadata(post?.title, {
    description: post?.excerpt,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();
  return <BlogPostTemplate post={post} />;
}
