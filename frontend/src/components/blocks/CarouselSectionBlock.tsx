import { getStrapiImageUrl } from '../../lib/strapi';
import { CarouselSectionCarousel } from './CarouselSectionCarousel';
import { RichText } from '../RichText';
import './CarouselSectionBlock.css';
import type { StrapiBlockCarouselSection } from '../../types/strapi';

export function CarouselSectionBlock({ heading, description, programs }: StrapiBlockCarouselSection) {
  const cards = (programs ?? []).map((card) => ({
    id: card.id,
    title: card.title,
    description: card.description ?? null,
    linkText: card.linkText ?? null,
    linkUrl: card.linkUrl ?? null,
    imageUrl: getStrapiImageUrl(card.image) ?? null,
    imageAlt: card.image?.alternativeText ?? card.title,
    focalPoint: card.image?.focalPoint ?? null,
  }));

  return (
    <section className="carousel-section">
      <div className="carousel-section__inner">
        {(heading || description) && (
          <div className="carousel-section__header">
            {heading && <h2 className="carousel-section__heading">{heading}</h2>}
            {description && <RichText content={description} className="carousel-section__description" />}
          </div>
        )}
        <CarouselSectionCarousel cards={cards} />
      </div>
    </section>
  );
}
