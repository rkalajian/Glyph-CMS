import Link from 'next/link';
import { getStrapiImageUrl, getFocalPointStyle } from '../../lib/strapi';
import './QuickLinksGridBlock.css';
import type { StrapiBlockQuickLinksGrid } from '../../types/strapi';

export function QuickLinksGridBlock({ cards }: StrapiBlockQuickLinksGrid) {
  if (!cards || cards.length === 0) return null;

  return (
    <section className="quick-links-grid" aria-label="Quick links">
      {cards.map((card, i) => {
        const imgUrl = getStrapiImageUrl(card.image);
        const isExternal = card.url.startsWith('http://') || card.url.startsWith('https://');
        const content = (
          <>
            {imgUrl && (
              <img
                src={imgUrl}
                alt=""
                aria-hidden="true"
                width={360}
                height={460}
                className="quick-links-card__img"
                loading={i === 0 ? 'eager' : 'lazy'}
                style={getFocalPointStyle(card.image)}
              />
            )}
            <div className="quick-links-card__overlay" aria-hidden="true" />
            <div className="quick-links-card__footer">
              <span className="quick-links-card__title">{card.title}</span>
              <span className="quick-links-card__arrow" aria-hidden="true">
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true"><path d="M2.5 8h11M9 3.5L13.5 8 9 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </div>
          </>
        );

        return isExternal ? (
          <a
            key={i}
            href={card.url}
            className="quick-links-card"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={card.title}
          >
            {content}
          </a>
        ) : (
          <Link key={i} href={card.url} className="quick-links-card" aria-label={card.title}>
            {content}
          </Link>
        );
      })}
    </section>
  );
}
