/* eslint-disable react-refresh/only-export-components */
import { notFound } from 'next/navigation';
import { getPressRelease, getPressReleases } from '@/lib/strapi';
import { buildPageMetadata } from '@/lib/metadata';
import { PressPost as PressPostTemplate } from '@/theme/templates/PressPost';

export async function generateStaticParams() {
  let page = 1;
  const slugs: string[] = [];

  while (true) {
    const { data, meta } = await getPressReleases({ pageSize: 100, page });
    slugs.push(...data.map((p) => p.slug));
    if (page >= meta.pagination.pageCount) break;
    page++;
  }

  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const release = await getPressRelease(slug);
  return buildPageMetadata(release?.title, {
    description: release?.excerpt,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const release = await getPressRelease(slug);
  if (!release) notFound();
  return <PressPostTemplate release={release} />;
}
