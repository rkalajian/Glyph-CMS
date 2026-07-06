import { getStrapiImageUrl, getFocalPointStyle } from '../../lib/strapi';
import './MediaCardsBlock.css';
import type { StrapiBlockMediaCards } from '../../types/strapi';

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path d="M8 28L28 8M28 8H12M28 8V24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MediaCardsBlock({ cards }: StrapiBlockMediaCards) {
  if (!cards || cards.length === 0) return null;

  return (
    <section className="media-cards">
      <div className="media-cards__inner">
        <div className="media-cards__grid">
          {cards.map((card, i) => {
            const imageUrl = getStrapiImageUrl(card.image);
            const inner = (
              <>
                <div className="media-card__image">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={card.image?.alternativeText ?? ''}
                      width={card.image?.width ?? 600}
                      height={258}
                      className="media-card__img"
                      loading={i === 0 ? 'eager' : 'lazy'}
                      style={getFocalPointStyle(card.image)}
                    />
                  ) : (
                    <div className="media-card__image-placeholder" aria-hidden />
                  )}
                </div>
                <div className="media-card__content">
                  <div className="media-card__title-row">
                    {card.linkUrl ? (
                      <a href={card.linkUrl} className="media-card__link">
                        <h3 className="media-card__title">{card.title}</h3>
                        <ArrowUpRightIcon className="media-card__arrow" />
                      </a>
                    ) : (
                      <h3 className="media-card__title">{card.title}</h3>
                    )}
                  </div>
                  {card.body && <p className="media-card__body">{card.body}</p>}
                </div>
              </>
            );

            return (
              <article key={card.id ?? i} className="media-card">
                {inner}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
