/* eslint-disable react-refresh/only-export-components */
import { notFound } from 'next/navigation';
import { getEvent, getEvents, getStrapiImageUrl, getThemeOptions } from '@/lib/strapi';
import { buildPageMetadata, SITE_DOMAIN } from '@/lib/metadata';
import { eventSchema } from '@/lib/structured-data';
import { JsonLd } from '@/components/JsonLd';
import { EventDetailPage } from '@/theme/templates/EventDetailPage';

export async function generateStaticParams() {
  try {
    const events = await getEvents();
    if (events.length === 0) return [{ slug: '__placeholder' }];
    return events.map((e) => ({ slug: e.slug }));
  } catch {
    return [{ slug: '__placeholder' }];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === '__placeholder') return buildPageMetadata('Events');
  const event = await getEvent(slug);
  const desc = typeof event?.description === 'string' ? event.description : undefined;
  return buildPageMetadata(event?.title ?? undefined, {
    description: desc,
    canonicalPath: `/events/${slug}/`,
    image: getStrapiImageUrl(event?.image),
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === '__placeholder') return notFound();
  const [event, themeOptions] = await Promise.all([getEvent(slug), getThemeOptions()]);
  if (!event) notFound();
  const orgName = themeOptions?.siteName?.trim() || 'Glyph';
  return (
    <>
      <JsonLd data={eventSchema(event, `https://${SITE_DOMAIN}/events/${slug}/`, orgName)} />
      <EventDetailPage event={event} />
    </>
  );
}
