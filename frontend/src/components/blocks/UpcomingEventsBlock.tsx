import { getUpcomingEvents, getStrapiImageUrl } from '../../lib/strapi';
import { UpcomingEventsCarousel } from './UpcomingEventsCarousel';
import { RichText } from '../RichText';
import './UpcomingEventsBlock.css';
import type { StrapiBlockUpcomingEvents } from '../../types/strapi';

export async function UpcomingEventsBlock({
  heading,
  description,
  limit,
  ctaText,
  ctaUrl,
}: StrapiBlockUpcomingEvents) {
  const events = await getUpcomingEvents(limit ?? 6);

  const cards = events.map((e) => ({
    id: e.id,
    title: e.title,
    slug: e.slug,
    startDate: e.startDate,
    endDate: e.endDate ?? null,
    allDay: e.allDay ?? false,
    location: e.location ?? null,
    url: e.url ?? null,
    imageUrl: getStrapiImageUrl(e.image) ?? null,
    focalPoint: e.image?.focalPoint ?? null,
  }));

  return (
    <section className="upcoming-events">
      <div className="upcoming-events__inner">
        <h2 className="upcoming-events__heading">{heading ?? 'Upcoming Events'}</h2>
        {description && (
          <RichText content={description} className="upcoming-events__description" />
        )}
        {cards.length > 0 ? (
          <UpcomingEventsCarousel events={cards} />
        ) : (
          <p className="font-sans text-ink text-center opacity-60">No upcoming events at this time.</p>
        )}
        {ctaUrl && ctaText && (
          <div className="upcoming-events__cta-wrap">
            <a href={ctaUrl} className="upcoming-events__cta">
              {ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
