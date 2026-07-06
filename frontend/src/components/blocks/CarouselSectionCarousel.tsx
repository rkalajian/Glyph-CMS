'use client';

import { useRef, useState, useCallback } from 'react';

interface CarouselCardData {
  id?: number;
  title: string;
  description: string | null;
  linkText: string | null;
  linkUrl: string | null;
  imageUrl: string | null;
  imageAlt: string;
  focalPoint?: { x: number; y: number } | null;
}

interface CarouselSectionCarouselProps {
  cards: CarouselCardData[];
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path
        d={direction === 'left' ? 'M10 3L5 8L10 13' : 'M6 3L11 8L6 13'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M5 15L15 5M15 5H7M15 5V13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CarouselSectionCarousel({ cards }: CarouselSectionCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollTo = useCallback((idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[idx] as HTMLElement;
    if (card) {
      el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: 'smooth' });
    }
    setActiveIdx(idx);
  }, []);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardEl = el.children[0] as HTMLElement | undefined;
    const cardWidth = cardEl?.offsetWidth ?? 280;
    const idx = Math.round(el.scrollLeft / (cardWidth + 20));
    setActiveIdx(Math.max(0, Math.min(idx, cards.length - 1)));
  }, [cards.length]);

  if (cards.length === 0) return null;

  return (
    <div className="carousel-section__carousel">
      <div
        ref={scrollRef}
        className="carousel-section__grid"
        onScroll={onScroll}
        role="list"
      >
        {cards.map((card, i) => (
          <article key={card.id ?? i} className="carousel-section__card" role="listitem">
            {card.imageUrl && (
              <div className="carousel-section__card-image-wrap">
                <img
                  src={card.imageUrl}
                  alt={card.imageAlt}
                  width={280}
                  height={238}
                  className="carousel-section__card-img"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  style={card.focalPoint ? { objectPosition: `${card.focalPoint.x}% ${card.focalPoint.y}%` } : undefined}
                />
              </div>
            )}
            <div className="carousel-section__card-body">
              <h3 className="carousel-section__card-title">{card.title}</h3>
              {card.description && (
                <p className="carousel-section__card-desc">{card.description}</p>
              )}
              {card.linkUrl && (
                <a href={card.linkUrl} className="carousel-section__card-link">
                  <span>{card.linkText ?? 'Learn more'}</span>
                  <LinkArrowIcon />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
      <nav className="carousel-section__nav" aria-label="Program navigation">
        <button
          type="button"
          className="carousel-section__nav-btn"
          onClick={() => scrollTo(Math.max(0, activeIdx - 1))}
          disabled={activeIdx === 0}
          aria-label="Previous program"
        >
          <ChevronIcon direction="left" />
        </button>
        <div className="carousel-section__progress" role="tablist" aria-label="Program indicators">
          {cards.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIdx}
              aria-label={`Program ${i + 1}`}
              className={`carousel-section__bar${i === activeIdx ? ' carousel-section__bar--active' : ''}`}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className="carousel-section__nav-btn"
          onClick={() => scrollTo(Math.min(cards.length - 1, activeIdx + 1))}
          disabled={activeIdx === cards.length - 1}
          aria-label="Next program"
        >
          <ChevronIcon direction="right" />
        </button>
      </nav>
    </div>
  );
}
