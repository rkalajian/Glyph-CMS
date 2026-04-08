/* eslint-disable react-refresh/only-export-components */
import { Suspense } from 'react';
import { getPage, getPressReleaseCategories, getThemeOptions } from '@/lib/strapi';
import { buildPageMetadata } from '@/lib/metadata';
import { PressListClient } from '@/theme/templates/PressListClient';

export async function generateMetadata() {
  const page = await getPage('press');
  return buildPageMetadata(page?.title);
}

export default async function PressPage() {
  const [page, categories, themeOptions] = await Promise.all([
    getPage('press'),
    getPressReleaseCategories(),
    getThemeOptions(),
  ]);

  const pageSize = themeOptions?.pressReleasesPerPage ?? 12;

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PressListClient
        page={page}
        categories={categories}
        pageSize={pageSize}
      />
    </Suspense>
  );
}
