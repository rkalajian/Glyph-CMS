import { factories } from '@strapi/strapi';
import { syncGoogleCalendar } from '../../../google-calendar-sync';

export default factories.createCoreController('api::event.event', ({ strapi }) => ({
  async syncCalendar(ctx) {
    const secret = process.env.WEBHOOK_SECRET;
    if (secret && ctx.request.headers['x-webhook-secret'] !== secret) {
      return ctx.unauthorized();
    }
    await syncGoogleCalendar(strapi);
    ctx.body = { ok: true };
  },
}));
