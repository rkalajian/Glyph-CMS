/* eslint-disable react-refresh/only-export-components */
import { getPage } from '@/lib/strapi';
import { buildPageMetadata } from '@/lib/metadata';
import { HomePage as HomePageTemplate } from '@/theme/templates/HomePage';

export async function generateMetadata() {
  const page = await getPage('home');
  return buildPageMetadata(page?.title);
}

export default async function HomePage() {
  const page = await getPage('home');
  return <HomePageTemplate page={page} />;
}
