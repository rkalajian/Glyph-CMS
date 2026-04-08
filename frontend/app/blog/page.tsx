/* eslint-disable react-refresh/only-export-components */
import { Suspense } from 'react';
import { getPage, getBlogCategories, getThemeOptions } from '@/lib/strapi';
import { buildPageMetadata } from '@/lib/metadata';
import { BlogListClient } from '@/theme/templates/BlogListClient';

export async function generateMetadata() {
  const page = await getPage('blog');
  return buildPageMetadata(page?.title);
}

export default async function BlogPage() {
  const [page, categories, themeOptions] = await Promise.all([
    getPage('blog'),
    getBlogCategories(),
    getThemeOptions(),
  ]);

  const pageSize = themeOptions?.blogPostsPerPage ?? 12;

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BlogListClient
        page={page}
        categories={categories}
        pageSize={pageSize}
      />
    </Suspense>
  );
}
