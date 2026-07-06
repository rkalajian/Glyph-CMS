'use client';

import { useRef, useState, useEffect } from 'react';

export interface EventCardData {
  id: number;
  title: string;
  slug: string;
  startDate: string;
  endDate: string | null;
  allDay: boolean;
  location: string | null;
  url: string | null;
  imageUrl: string | null;
  focalPoint?: { x: number; y: number } | null;
}

function ArrowNEIcon() {
  return (
    <svg className="event-card__arrow-icon" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5.5M11.5 2.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="event-card__meta-icon" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 3.5V7l2.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="event-card__meta-icon" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1C4.79 1 3 2.79 3 5c0 3.5 4 8 4 8s4-4.5 4-8c0-2.21-1.79-4-4-4z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="7" cy="5" r="1.4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function EventCard({ event }: { event: EventCardData }) {
  const date = new Date(event.startDate);
  // Pin to the site's timezone so server (build, UTC) and client (visitor-local)
  // render identical text — otherwise hydration mismatches (React #418).
  const TZ = process.env.NEXT_PUBLIC_TIMEZONE || 'America/New_York';
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: TZ }).toUpperCase();
  const day = date.toLocaleString('en-US', { day: 'numeric', timeZone: TZ });
  const timeStr = event.allDay
    ? 'All Day'
    : date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: TZ });

  return (
    <div className="event-card">
      <div className="event-card__image">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            width={600}
            height={200}
            className="event-card__img"
            loading="lazy"
            style={event.focalPoint ? { objectPosition: `${event.focalPoint.x}% ${event.focalPoint.y}%` } : undefined}
          />
        ) : (
          <div className="event-card__img event-card__img--placeholder" aria-hidden="true" />
        )}
      </div>
      <div className="event-card__body">
        <div className="event-card__date">
          <span className="event-card__month">{month}</span>
          <span className="event-card__day">{day}</span>
        </div>
        <div className="event-card__divider" aria-hidden="true" />
        <div className="event-card__info">
          <div className="event-card__title-row">
            {event.url ? (
              <a href={event.url} className="event-card__title-link">
                <h3 className="event-card__title">{event.title}</h3>
                <span className="event-card__arrow"><ArrowNEIcon /></span>
              </a>
            ) : (
              <h3 className="event-card__title">{event.title}</h3>
            )}
          </div>
          {!event.allDay && (
            <div className="event-card__meta">
              <ClockIcon />
              <span>{timeStr}</span>
            </div>
          )}
          {event.location && (
            <div className="event-card__meta">
              <PinIcon />
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                className="event-card__location-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {event.location}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface Props {
  events: EventCardData[];
}

export function UpcomingEventsCarousel({ events }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const cards = Array.from(container.querySelectorAll('.event-card'));
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = cards.indexOf(entry.target as Element);
            if (idx >= 0) setActiveIdx(idx);
          }
        });
      },
      { root: container, threshold: 0.5 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [events]);

  const scrollToCard = (idx: number) => {
    const container = scrollRef.current;
    const cards = container?.querySelectorAll('.event-card');
    cards?.[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  return (
    <>
      <div ref={scrollRef} className="upcoming-events__grid">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      {events.length > 1 && (
        <div className="upcoming-events__dots" role="tablist" aria-label="Event navigation">
          {events.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIdx}
              aria-label={`Event ${i + 1}`}
              className={`upcoming-events__dot${i === activeIdx ? ' upcoming-events__dot--active' : ''}`}
              onClick={() => scrollToCard(i)}
            />
          ))}
        </div>
      )}
    </>
  );
}
