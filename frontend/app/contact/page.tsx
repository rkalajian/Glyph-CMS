/* eslint-disable react-refresh/only-export-components */
import { getPage } from '@/lib/strapi';
import { buildPageMetadata } from '@/lib/metadata';
import { ContactPage as ContactPageTemplate } from '@/theme/templates/ContactPage';

export async function generateMetadata() {
  const page = await getPage('contact');
  return buildPageMetadata(page?.title);
}

export default async function ContactPage() {
  const page = await getPage('contact');
  return <ContactPageTemplate page={page} />;
}
