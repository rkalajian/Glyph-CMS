'use client';

import { useState } from 'react';
import { isMultiDayEvent, formatEventRangeShort } from '../../utils/format';

export interface FeaturedEventSlide {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  href: string;
  startDate: string;
  endDate: string | null;
  focalPoint?: { x: number; y: number } | null;
}

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path d="M8 28L28 8M28 8H12M28 8V24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
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

interface Props {
  slides: FeaturedEventSlide[];
}

export function FeaturedEventsCarousel({ slides }: Props) {
  const [current, setCurrent] = useState(0);
  const count = slides.length;

  if (count === 0) return null;

  const prev = () => setCurrent((i) => (i - 1 + count) % count);
  const next = () => setCurrent((i) => (i + 1) % count);

  const slide = slides[current];

  const Dots = () => (
    <div className="featured-events__dots" role="tablist" aria-label="Event slides">
      {slides.map((_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === current}
          aria-label={`Event ${i + 1}`}
          onClick={() => setCurrent(i)}
          className={`featured-events__dot${i === current ? ' featured-events__dot--active' : ''}`}
        />
      ))}
    </div>
  );

  return (
    <>
      <div className="featured-events__card">
        {/* Photo layer */}
        <div className="featured-events__photo" aria-hidden="true">
          {slides.map((s, i) => (
            s.imageUrl && (
              <img
                key={s.id}
                src={s.imageUrl}
                alt=""
                width={1240}
                height={661}
                className={`featured-events__slide${i === current ? ' featured-events__slide--active' : ''}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                style={s.focalPoint ? { objectPosition: `${s.focalPoint.x}% ${s.focalPoint.y}%` } : undefined}
              />
            )
          ))}
        </div>

        {/* Panel */}
        <div className="featured-events__panel">
          <div className="featured-events__panel-top">
            {slide.startDate && (
              <p className="featured-events__date">
                <span className="featured-events__date-range">
                  {formatEventRangeShort(slide.startDate, slide.endDate)}
                </span>
                {isMultiDayEvent(slide.startDate, slide.endDate) && (
                  <span className="featured-events__multiday-tag">Multi-Day</span>
                )}
              </p>
            )}
            <div className="featured-events__title-row">
              <a
                href={slide.href}
                className="featured-events__event-link"
                aria-label={`View event: ${slide.title}`}
              >
                <h3 className="featured-events__event-title">{slide.title}</h3>
                <ArrowUpRightIcon className="featured-events__arrow-icon" />
              </a>
            </div>
            {slide.description && (
              <p className="featured-events__description">{slide.description}</p>
            )}
          </div>

          {/* Desktop nav — inside panel */}
          {count > 1 && (
            <div className="featured-events__nav-desktop" role="group" aria-label="Event navigation">
              <button
                className="featured-events__nav-btn"
                onClick={prev}
                aria-label="Previous event"
              >
                <ArrowLeftIcon />
              </button>
              <Dots />
              <button
                className="featured-events__nav-btn"
                onClick={next}
                aria-label="Next event"
              >
                <ArrowRightIcon />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav — below card */}
      {count > 1 && (
        <div className="featured-events__nav-mobile" role="group" aria-label="Event navigation">
          <button
            className="featured-events__nav-btn"
            onClick={prev}
            aria-label="Previous event"
          >
            <ArrowLeftIcon />
          </button>
          <Dots />
          <button
            className="featured-events__nav-btn"
            onClick={next}
            aria-label="Next event"
          >
            <ArrowRightIcon />
          </button>
        </div>
      )}
    </>
  );
}
