'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getStrapiImageUrl } from '../../lib/strapi';
import { RichText } from '../../components/RichText';
import { Breadcrumb } from '../../components/Breadcrumb';
import type { StrapiEvent, StrapiPage } from '../../types/strapi';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getMonthDays(year: number, month: number): (Date | null)[][] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const daysInMonth = last.getDate();

  const rows: (Date | null)[][] = [];
  let row: (Date | null)[] = [];

  // Leading empty cells
  for (let i = 0; i < startPad; i++) {
    row.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    row.push(new Date(year, month, d));
    if (row.length === 7) {
      rows.push(row);
      row = [];
    }
  }

  if (row.length > 0) {
    while (row.length < 7) row.push(null);
    rows.push(row);
  }

  return rows;
}

function eventsOnDate(events: StrapiEvent[], date: Date): StrapiEvent[] {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();

  return events.filter((ev) => {
    const start = new Date(ev.startDate);
    const end = ev.endDate ? new Date(ev.endDate) : start;
    const dayStart = new Date(y, m, d);
    const dayEnd = new Date(y, m, d, 23, 59, 59, 999);
    return start <= dayEnd && end >= dayStart;
  });
}

function formatTime(dateStr: string, allDay?: boolean): string {
  if (allDay) return 'All day';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

interface EventCalendarProps {
  page: StrapiPage | null;
  events: StrapiEvent[];
}

export function EventCalendar({ page, events }: EventCalendarProps) {
  const [viewDate, setViewDate] = useState(() => new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const calendarDays = useMemo(() => getMonthDays(year, month), [year, month]);

  const goPrev = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1));
  const goNext = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1));
  const goToday = () => setViewDate(new Date());

  const displayTitle = page?.title ?? 'Event Calendar';
  const subtitle = page?.subtitle;

  return (
    <article>
      <header className="mb-8">
        <Breadcrumb items={[{ label: 'Home', url: '/' }, { label: displayTitle }]} />
        <h1 className="text-3xl font-bold mb-4">{displayTitle}</h1>
        {subtitle && <p className="text-muted mb-4">{subtitle}</p>}
        {page?.content && (
          <div className="mb-4">
            <RichText content={page.content} />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2" role="group" aria-label="Calendar navigation">
            <motion.button
              type="button"
              onClick={goPrev}
              className="px-4 py-2 rounded border border-border bg-bg text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 min-h-[44px] min-w-[44px]"
              aria-label="Previous month"
              whileHover={{ backgroundColor: 'var(--color-border)' }}
              whileTap={{ scale: 0.98 }}
            >
              ←
            </motion.button>
            <h2 id="calendar-month" className="text-xl font-semibold min-w-[180px] text-center">
              {MONTH_LABELS[month]} {year}
            </h2>
            <motion.button
              type="button"
              onClick={goNext}
              className="px-4 py-2 rounded border border-border bg-bg text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 min-h-[44px] min-w-[44px]"
              aria-label="Next month"
              whileHover={{ backgroundColor: 'var(--color-border)' }}
              whileTap={{ scale: 0.98 }}
            >
              →
            </motion.button>
          </div>
          <motion.button
            type="button"
            onClick={goToday}
            className="px-4 py-2 rounded border border-border bg-bg text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 min-h-[44px]"
            aria-label="Go to current month"
            whileHover={{ backgroundColor: 'var(--color-border)' }}
            whileTap={{ scale: 0.98 }}
          >
            Today
          </motion.button>
        </div>
      </header>

      <div
        className="overflow-x-auto"
        role="region"
        aria-label={`Calendar for ${MONTH_LABELS[month]} ${year}`}
      >
        <table
          className="w-full min-w-[400px] border-collapse"
          role="grid"
          aria-readonly="true"
          aria-label={`${MONTH_LABELS[month]} ${year} calendar`}
        >
          <thead>
            <tr>
              {WEEKDAY_LABELS.map((label) => (
                <th
                  key={label}
                  scope="col"
                  className="border border-border p-2 text-left text-sm font-medium bg-border/30"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendarDays.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((date, colIdx) => {
                  const dayEvents = date ? eventsOnDate(events, date) : [];
                  const isToday =
                    date &&
                    date.getDate() === new Date().getDate() &&
                    date.getMonth() === new Date().getMonth() &&
                    date.getFullYear() === new Date().getFullYear();

                  return (
                    <td
                      key={colIdx}
                      className="border border-border p-2 align-top min-h-[100px]"
                    >
                      {date ? (
                        <>
                          <span
                            className={`inline-flex w-8 h-8 items-center justify-center rounded text-sm ${
                              isToday
                                ? 'bg-accent text-white font-semibold'
                                : 'text-fg'
                            }`}
                          >
                            {date.getDate()}
                          </span>
                          <ul className="mt-2 space-y-1 list-none p-0 m-0" role="list">
                            {dayEvents.slice(0, 3).map((ev) => (
                              <li key={ev.documentId}>
                                <details className="group">
                                  <summary className="cursor-pointer text-sm text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 rounded list-none [&::-webkit-details-marker]:hidden">
                                    <span className="font-medium">{ev.title}</span>
                                    {!ev.allDay && (
                                      <span className="block text-muted text-xs">
                                        {formatTime(ev.startDate, ev.allDay)}
                                      </span>
                                    )}
                                  </summary>
                                  <div className="mt-2 p-2 text-sm border-l-2 border-accent/50 pl-2">
                                    {ev.image && getStrapiImageUrl(ev.image) && (
                                      <img
                                        src={getStrapiImageUrl(ev.image)!}
                                        alt={ev.image.alternativeText ?? ev.title}
                                        width={ev.image.width ?? 400}
                                        height={ev.image.height ?? 200}
                                        className="w-full rounded object-cover mb-2 max-h-32"
                                        loading="lazy"
                                      />
                                    )}
                                    {ev.location && (
                                      <p className="text-muted">📍 {ev.location}</p>
                                    )}
                                    {ev.url && (
                                      <a
                                        href={ev.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-1 text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 rounded"
                                      >
                                        View event →
                                      </a>
                                    )}
                                    {ev.description && (
                                      <div className="mt-1">
                                        <RichText content={ev.description} />
                                      </div>
                                    )}
                                  </div>
                                </details>
                              </li>
                            ))}
                            {dayEvents.length > 3 && (
                              <li className="text-sm text-muted">
                                +{dayEvents.length - 3} more
                              </li>
                            )}
                          </ul>
                        </>
                      ) : (
                        <span className="sr-only">Empty</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
