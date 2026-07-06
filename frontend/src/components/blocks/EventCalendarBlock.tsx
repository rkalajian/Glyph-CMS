import { getEvents } from '../../lib/strapi';
import { EventCalendar } from '../../theme/templates/EventCalendar';

export async function EventCalendarBlock() {
  const events = await getEvents();
  return <EventCalendar page={null} events={events} />;
}
