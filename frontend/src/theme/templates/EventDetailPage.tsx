import { getStrapiImageUrl } from '../../lib/strapi';
import { formatEventDate, isExternalUrl } from '../../utils/format';
import { RichText } from '../../components/RichText';
import { Breadcrumb } from '../../components/Breadcrumb';
import type { StrapiEvent } from '../../types/strapi';

interface EventDetailPageProps {
  event: StrapiEvent;
}

export function EventDetailPage({ event }: EventDetailPageProps) {
  const imageUrl = getStrapiImageUrl(event.image);
  const dateLabel = formatEventDate(event.startDate, event.endDate, event.allDay);

  return (
    <article>
      <header className="mb-8">
        <Breadcrumb
          items={[
            { label: 'Home', url: '/' },
            { label: 'Events', url: '/events' },
            { label: event.title },
          ]}
        />
        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-muted mb-2">
          {dateLabel && (
            <time dateTime={event.startDate}>{dateLabel}</time>
          )}
          {event.location && (
            <>
              <span aria-hidden="true">·</span>
              <span>{event.location}</span>
            </>
          )}
        </div>
        {imageUrl && (
          <figure className="mt-4">
            <img
              src={imageUrl}
              alt={event.image?.alternativeText ?? event.title}
              width={event.image?.width ?? 1200}
              height={event.image?.height ?? 630}
              fetchPriority="high"
              loading="eager"
              className="w-full max-h-96 object-cover rounded-lg"
            />
          </figure>
        )}
      </header>
      {event.description && <RichText content={event.description} />}
      {event.url && (
        <p className="mt-6">
          <a
            href={event.url}
            className="inline-flex items-center min-h-[44px] px-5 py-2.5 rounded-lg bg-accent text-white font-medium hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent transition-colors"
            {...(isExternalUrl(event.url) && { target: '_blank', rel: 'noopener noreferrer' })}
          >
            Learn More
            {isExternalUrl(event.url) && <span className="sr-only"> (opens in a new tab)</span>}
          </a>
        </p>
      )}
    </article>
  );
}
