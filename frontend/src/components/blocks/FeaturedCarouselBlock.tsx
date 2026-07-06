'use client';
import { useState } from 'react';
import { getStrapiImageUrl, getFocalPointStyle } from '../../lib/strapi';
import { RichText } from '../RichText';
import './FeaturedCarouselBlock.css';
import type { StrapiBlockFeaturedCarousel } from '../../types/strapi';

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <circle cx="18" cy="18" r="17.5" stroke="currentColor" strokeOpacity="0.6" />
      <path d="M13 23L23 13M23 13H15M23 13V21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" width="12" height="12">
      <path d="M9 6H3M3 6L6 3M3 6L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" width="12" height="12">
      <path d="M3 6H9M9 6L6 3M9 6L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FeaturedCarouselBlock({ slides }: StrapiBlockFeaturedCarousel) {
  const validSlides = (slides ?? []).filter(s => s.image);
  const [current, setCurrent] = useState(0);
  const count = validSlides.length;

  if (!count) return null;

  const slide = validSlides[current];
  const prev = () => setCurrent(i => (i - 1 + count) % count);
  const next = () => setCurrent(i => (i + 1) % count);

  const NavDots = () => (
    <div className="featured-carousel__dots" role="tablist" aria-label="Slides">
      {validSlides.map((_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === current}
          onClick={() => setCurrent(i)}
          className={`featured-carousel__dot${i === current ? ' featured-carousel__dot--active' : ''}`}
          aria-label={`Slide ${i + 1}`}
        />
      ))}
    </div>
  );

  return (
    <section className="featured-carousel" aria-label={slide.heading}>
      <div className="featured-carousel__card">
        {/* Photos */}
        <div className="featured-carousel__photo" aria-hidden="true">
          {validSlides.map((s, i) => (
            <img
              key={i}
              src={getStrapiImageUrl(s.image) ?? ''}
              alt=""
              width={1240}
              height={661}
              className={`featured-carousel__slide${i === current ? ' featured-carousel__slide--active' : ''}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              style={getFocalPointStyle(s.image)}
            />
          ))}
        </div>

        {/* Panel */}
        <div className="featured-carousel__panel">
          <div className="featured-carousel__panel-top">
            <div className="featured-carousel__heading-row">
              {slide.linkUrl ? (
                <a href={slide.linkUrl} className="featured-carousel__heading-link" aria-label={`View all — ${slide.heading}`}>
                  <h2 className="featured-carousel__heading">{slide.heading}</h2>
                  <ArrowUpRightIcon className="featured-carousel__arrow-icon" />
                </a>
              ) : (
                <h2 className="featured-carousel__heading">{slide.heading}</h2>
              )}
            </div>
            {slide.body && <RichText content={slide.body} className="featured-carousel__body" />}
          </div>

          {count > 1 && (
            <div className="featured-carousel__nav-desktop">
              <button onClick={prev} className="featured-carousel__nav-btn" aria-label="Previous slide">
                <ArrowLeftIcon />
              </button>
              <NavDots />
              <button onClick={next} className="featured-carousel__nav-btn" aria-label="Next slide">
                <ArrowRightIcon />
              </button>
            </div>
          )}
        </div>
      </div>

      {count > 1 && (
        <div className="featured-carousel__nav-mobile">
          <button onClick={prev} className="featured-carousel__nav-btn" aria-label="Previous slide">
            <ArrowLeftIcon />
          </button>
          <NavDots />
          <button onClick={next} className="featured-carousel__nav-btn" aria-label="Next slide">
            <ArrowRightIcon />
          </button>
        </div>
      )}
    </section>
  );
}
