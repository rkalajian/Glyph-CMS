'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { RichText } from './RichText';
import { formatEventDate } from '../utils/format';
import type { StrapiBlock } from '../types/strapi';
import './EventDetailsModal.css';

export interface EventDetails {
  title: string;
  startDate: string;
  endDate?: string | null;
  allDay?: boolean | null;
  location?: string | null;
  url?: string | null;
  description?: string | StrapiBlock[] | null;
  imageUrl?: string | null;
}

function hasDescription(d: EventDetails['description']): boolean {
  if (!d) return false;
  if (typeof d === 'string') return d.trim().length > 0;
  return Array.isArray(d) && d.length > 0;
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="event-details__meta-icon">
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 6h12M5.5 1.5v3M10.5 1.5v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="event-details__meta-icon">
      <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.8 4.5 8.5 4.5 8.5s4.5-4.7 4.5-8.5c0-2.5-2-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="6" r="1.6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="event-details__close-icon">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

interface Props {
  event: EventDetails;
  /** Trigger content — e.g. the card's title + arrow icon. */
  children: React.ReactNode;
  /** Extra class for the trigger button, so callers can align it with card styling. */
  triggerClassName?: string;
}

/**
 * Accessible trigger + modal showing an event's full details. Uses the native
 * <dialog> element, which provides focus trapping, Escape-to-close, focus
 * restore, and an inert background for free — WCAG 2.2 compliant with minimal
 * custom logic.
 */
export function EventDetailsButton({ event, children, triggerClassName }: Props) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
    } else if (!open && dialog.open) {
      dialog.close();
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  const dateStr = formatEventDate(event.startDate, event.endDate, event.allDay);

  return (
    <>
      <button
        type="button"
        className={`event-details__trigger${triggerClassName ? ` ${triggerClassName}` : ''}`}
        aria-haspopup="dialog"
        aria-label={`View details for ${event.title}`}
        onClick={() => setOpen(true)}
      >
        {children}
      </button>

      <dialog
        ref={dialogRef}
        className="event-details__dialog"
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          // Close when the backdrop (the dialog element itself) is clicked.
          if (e.target === dialogRef.current) setOpen(false);
        }}
      >
        <div className="event-details__panel">
          <button
            type="button"
            className="event-details__close"
            aria-label="Close details"
            onClick={() => setOpen(false)}
            autoFocus
          >
            <CloseIcon />
          </button>

          {event.imageUrl && (
            <img
              src={event.imageUrl}
              alt=""
              className="event-details__image"
              width={800}
              height={360}
            />
          )}

          <div className="event-details__content">
            <h2 id={titleId} className="event-details__title">{event.title}</h2>

            <dl className="event-details__meta">
              {dateStr && (
                <div className="event-details__meta-row">
                  <dt className="sr-only">Date</dt>
                  <CalendarIcon />
                  <dd>{dateStr}</dd>
                </div>
              )}
              {event.location && (
                <div className="event-details__meta-row">
                  <dt className="sr-only">Location</dt>
                  <PinIcon />
                  <dd>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="event-details__link"
                    >
                      {event.location}
                    </a>
                  </dd>
                </div>
              )}
            </dl>

            {hasDescription(event.description) && (
              <div className="event-details__description">
                <RichText content={event.description!} />
              </div>
            )}

            {event.url && (
              <a
                href={event.url}
                {...(/^https?:\/\//i.test(event.url) && { target: '_blank', rel: 'noopener noreferrer' })}
                className="event-details__cta"
              >
                Learn More
              </a>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
