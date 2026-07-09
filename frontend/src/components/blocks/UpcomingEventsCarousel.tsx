'use client';

import { useRef, useState, useEffect } from 'react';
import { isMultiDayEvent, formatEventRangeShort } from '../../utils/format';
import { EventDetailsButton } from '../EventDetailsModal';
import type { StrapiBlock } from '../../types/strapi';

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
  description?: string | StrapiBlock[] | null;
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

function EventCard({ event, now }: { event: EventCardData; now: Date }) {
  const date = new Date(event.startDate);
  // Pin to the site's timezone so server (build, UTC) and client (visitor-local)
  // render identical text — otherwise hydration mismatches (React #418).
  const TZ = process.env.NEXT_PUBLIC_TIMEZONE || 'America/New_York';
  const multiDay = isMultiDayEvent(event.startDate, event.endDate);
  // Multi-day events stay listed until they're over, so once underway show
  // today's date on the badge instead of a stale start date. Events that
  // haven't started yet still show their actual start date.
  const badgeDate = multiDay && now >= date ? now : date;
  const month = badgeDate.toLocaleString('en-US', { month: 'short', timeZone: TZ }).toUpperCase();
  const day = badgeDate.toLocaleString('en-US', { day: 'numeric', timeZone: TZ });
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
          {multiDay && (
            <p className="event-card__multiday">
              <span className="event-card__multiday-tag">Multi-Day</span>
              <span className="event-card__multiday-range">
                {formatEventRangeShort(event.startDate, event.endDate)}
              </span>
            </p>
          )}
          <h3 className="event-card__title-row">
            <EventDetailsButton
              triggerClassName="event-card__title-link"
              event={{
                title: event.title,
                startDate: event.startDate,
                endDate: event.endDate,
                allDay: event.allDay,
                location: event.location,
                url: event.url,
                description: event.description,
                imageUrl: event.imageUrl,
              }}
            >
              <span className="event-card__title">{event.title}</span>
              <span className="event-card__arrow"><ArrowNEIcon /></span>
            </EventDetailsButton>
          </h3>
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
  serverNow: string;
}

export function UpcomingEventsCarousel({ events, serverNow }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Until mounted, "now" is the server's build timestamp (identical on SSR and the
  // first client render → no hydration mismatch); after mount, use the real date.
  const [clientNow, setClientNow] = useState<Date | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setClientNow(new Date()), []);
  const now = clientNow ?? new Date(serverNow);

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
          <EventCard key={event.id} event={event} now={now} />
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
