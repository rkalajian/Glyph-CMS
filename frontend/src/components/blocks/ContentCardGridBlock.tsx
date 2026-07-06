import { getStrapiImageUrl, getFocalPointStyle } from '../../lib/strapi';
import { RichText } from '../RichText';
import './ContentCardGridBlock.css';
import type { StrapiBlockContentCardGrid } from '../../types/strapi';

type ContentCardGridBlockProps = StrapiBlockContentCardGrid;

const BG_CLASS: Record<string, string> = {
  primary: 'content-card-grid--primary',
  surface:   'content-card-grid--surface',
  ink:  'content-card-grid--ink',
  highlight:   'content-card-grid--highlight',
};

const CARD_BG_CLASS: Record<string, string> = {
  highlight:   'content-card-grid--card-highlight',
  surface:   'content-card-grid--card-surface',
  primary: 'content-card-grid--card-primary',
  ink:  'content-card-grid--card-ink',
};

export function ContentCardGridBlock({ backgroundColor, cardBackgroundColor, heading, description, programs }: ContentCardGridBlockProps) {
  const cards = programs ?? [];
  const bgClass = BG_CLASS[backgroundColor ?? 'primary'] ?? BG_CLASS.primary;
  const cardBgClass = CARD_BG_CLASS[cardBackgroundColor ?? 'highlight'] ?? CARD_BG_CLASS.highlight;

  return (
    <section className={`content-card-grid ${bgClass} ${cardBgClass}`}>
      <div className="content-card-grid__inner">
      <div className="content-card-grid__header">
        {heading && <h2 className="content-card-grid__heading">{heading}</h2>}
        {description && <RichText content={description} className="content-card-grid__description" />}
      </div>
      <div className="content-card-grid__grid">
        {cards.map((card, i) => {
          const imgUrl = getStrapiImageUrl(card.image);
          return (
            <article key={card.id ?? i} className="content-card-grid__card">
              {imgUrl && (
                <div className="content-card-grid__card-image-wrap">
                  <img
                    src={imgUrl}
                    alt={card.title}
                    width={600}
                    height={238}
                    className="content-card-grid__card-image"
                    loading="lazy"
                    style={getFocalPointStyle(card.image)}
                  />
                </div>
              )}
              <div className="content-card-grid__card-body">
                <h3 className="content-card-grid__card-title">{card.title}</h3>
                {card.description && (
                  <RichText content={card.description} className="content-card-grid__card-desc" />
                )}
                {card.linkUrl && (
                  <a href={card.linkUrl} className="content-card-grid__card-link">
                    <span>{card.linkText || 'Learn more'}</span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M4.167 10h11.666M10.833 5l5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
      </div>
    </section>
  );
}
