/* eslint-disable react-refresh/only-export-components */
import { getPage, getEvents } from '@/lib/strapi';
import { buildPageMetadata } from '@/lib/metadata';
import { EventCalendar as EventCalendarTemplate } from '@/theme/templates/EventCalendar';

export async function generateMetadata() {
  const page = await getPage('events');
  return buildPageMetadata(page?.title);
}

export default async function EventsPage() {
  const [page, events] = await Promise.all([
    getPage('events'),
    getEvents(),
  ]);
  return <EventCalendarTemplate page={page} events={events} />;
}
