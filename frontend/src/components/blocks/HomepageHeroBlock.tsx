'use client';
import { useState, useEffect, useCallback } from 'react';
import { getStrapiImageUrl, getFocalPointStyle } from '../../lib/strapi';
import './HomepageHeroBlock.css';
import type { StrapiBlockHomepageHero } from '../../types/strapi';

export function HomepageHeroBlock({ slides, anchorId }: StrapiBlockHomepageHero) {
  const validSlides = (slides ?? []).filter((s) => s.image);
  const count = validSlides.length;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % count), [count]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + count) % count), [count]);

  useEffect(() => {
    if (count <= 1 || paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [count, next, paused]);

  if (!count) return null;

  const activeSlide = validSlides[current];

  return (
    <section className="homepage-hero" id={anchorId || undefined} aria-label={activeSlide.heading}>
      {validSlides.map((slide, i) => {
        const src = getStrapiImageUrl(slide.image);
        if (!src) return null;
        return (
          <img
            key={slide.id ?? i}
            src={src}
            alt=""
            aria-hidden="true"
            width={1440}
            height={700}
            className={`homepage-hero__bg${i === current ? ' homepage-hero__bg--active' : ''}`}
            fetchPriority={i === 0 ? 'high' : 'auto'}
            loading={i === 0 ? 'eager' : 'lazy'}
            style={getFocalPointStyle(slide.image)}
          />
        );
      })}

      <div className="homepage-hero__overlay" aria-hidden="true" />

      {count > 1 && (
        <>
          <button className="homepage-hero__arrow homepage-hero__arrow--prev" onClick={prev} aria-label="Previous slide">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true"><path d="M10.5 3L5.5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button className="homepage-hero__arrow homepage-hero__arrow--next" onClick={next} aria-label="Next slide">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true"><path d="M5.5 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </>
      )}

      <div className="homepage-hero__content">
        <div className="homepage-hero__text">
          <h1 className="homepage-hero__heading">{activeSlide.heading}</h1>
          {activeSlide.ctaUrl && (
            <a
              href={activeSlide.ctaUrl}
              className="homepage-hero__cta"
              // Visible CTA text is often generic ("Learn More"); give the link a
              // descriptive accessible name for SEO/screen readers via the slide heading.
              aria-label={`${activeSlide.ctaText || 'Get tickets'}: ${activeSlide.heading}`}
            >
              {activeSlide.ctaText || 'GET TICKETS'}
            </a>
          )}
        </div>

        {count > 1 && (
          <div className="homepage-hero__dots-row">
            <div className="homepage-hero__dots" role="tablist" aria-label="Slide indicators">
              {validSlides.map((_, i) => (
                <button
                  key={i}
                  className={`homepage-hero__dot${i === current ? ' homepage-hero__dot--active' : ''}`}
                  onClick={() => setCurrent(i)}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              className="homepage-hero__pause"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
              aria-pressed={paused}
            >
              {paused ? (
                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M4 2.5v11l9-5.5-9-5.5z" /></svg>
              ) : (
                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><rect x="3.5" y="2.5" width="3" height="11" rx="0.75" /><rect x="9.5" y="2.5" width="3" height="11" rx="0.75" /></svg>
              )}
            </button>
          </div>
        )}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {count > 1 && `Slide ${current + 1} of ${count}`}
        </div>
      </div>
    </section>
  );
}
