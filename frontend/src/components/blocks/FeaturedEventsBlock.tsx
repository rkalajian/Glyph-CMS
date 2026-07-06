import { getFeaturedEvents, getStrapiImageUrl } from '../../lib/strapi';
import { FeaturedEventsCarousel } from './FeaturedEventsCarousel';
import './FeaturedEventsBlock.css';
import type { StrapiBlockFeaturedEvents } from '../../types/strapi';

function extractText(desc: unknown): string | null {
  if (!desc) return null;
  if (typeof desc === 'string') return desc.slice(0, 300) || null;
  if (Array.isArray(desc)) {
    const text = (desc as Array<{ type?: string; children?: Array<{ text?: string }> }>)
      .filter((b) => b.type === 'paragraph')
      .flatMap((b) => b.children ?? [])
      .map((c) => c.text ?? '')
      .join(' ')
      .slice(0, 300);
    return text || null;
  }
  return null;
}

export async function FeaturedEventsBlock({ heading, limit }: StrapiBlockFeaturedEvents) {
  const events = await getFeaturedEvents(limit ?? 5);

  const slides = events.map((e) => ({
    id: e.id,
    title: e.title,
    description: extractText(e.description),
    imageUrl: getStrapiImageUrl(e.image) ?? null,
    href: e.url || `/events/${e.slug}`,
    focalPoint: e.image?.focalPoint ?? null,
  }));

  return (
    <section className="featured-events" aria-labelledby="featured-events-heading">
      <div className="featured-events__inner">
        <h2 id="featured-events-heading" className="featured-events__section-heading">
          {heading ?? 'Featured Events'}
        </h2>
        {slides.length > 0 ? (
          <FeaturedEventsCarousel slides={slides} />
        ) : (
          <p className="featured-events__empty">No featured events at this time.</p>
        )}
      </div>
    </section>
  );
}
