import { Suspense } from 'react';
import { buildPageMetadata } from '@/lib/metadata';
import { getThemeOptions } from '@/lib/strapi';
import { SearchPage } from '@/components/SearchPage';

export async function generateMetadata() {
  return buildPageMetadata('Search', { canonicalPath: '/search/' });
}

export default async function SearchRoute() {
  const themeOptions = await getThemeOptions();
  const searchConfig = themeOptions?.searchConfig ?? [];
  return (
    <Suspense>
      <SearchPage searchConfig={searchConfig} />
    </Suspense>
  );
}
