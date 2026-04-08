/* eslint-disable react-refresh/only-export-components */
import { getForms } from '@/lib/strapi';
import { buildPageMetadata } from '@/lib/metadata';
import { FormEmbedPage as FormEmbedPageTemplate } from '@/theme/templates/FormEmbedPage';

export async function generateStaticParams() {
  const forms = await getForms();
  return forms.map((f) => ({ slug: f.slug }));
}

export const dynamicParams = false;

export async function generateMetadata() {
  return buildPageMetadata('Form');
}

export default async function FormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <FormEmbedPageTemplate slug={slug} />;
}
