/* eslint-disable react-refresh/only-export-components */
import { notFound } from 'next/navigation';
import { getPage, getPages } from '@/lib/strapi';
import { buildPageMetadata } from '@/lib/metadata';
import { PageTemplate as PageTemplateComponent } from '@/theme/templates/PageTemplate';

export async function generateStaticParams() {
  const pages = await getPages();
  if (pages.length === 0) return [{ slug: '__placeholder' }];
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === '__placeholder') return buildPageMetadata('Page');
  const page = await getPage(slug);
  return buildPageMetadata(page?.title);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === '__placeholder') return notFound();
  const page = await getPage(slug);
  if (!page) notFound();
  return <PageTemplateComponent page={page} />;
}
