/* eslint-disable react-refresh/only-export-components */
import { notFound } from 'next/navigation';
import { getPage, getPages } from '@/lib/strapi';
import { buildPageMetadata } from '@/lib/metadata';
import { PageTemplate as PageTemplateComponent } from '@/theme/templates/PageTemplate';

export async function generateStaticParams() {
  const pages = await getPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);
  return buildPageMetadata(page?.title);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();
  return <PageTemplateComponent page={page} />;
}
