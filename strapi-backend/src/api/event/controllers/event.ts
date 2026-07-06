import { createHash, timingSafeEqual } from 'node:crypto';
import { factories } from '@strapi/strapi';
import { syncGoogleCalendar } from '../../../google-calendar-sync';

/** Constant-time string comparison (hashes first so lengths never leak). */
function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export default factories.createCoreController('api::event.event', ({ strapi }) => ({
  async syncCalendar(ctx) {
    const secret = process.env.WEBHOOK_SECRET;

    // Fail closed in production: an unauthenticated trigger burns Google API
    // quota and lets anyone hammer the sync. Dev stays open for convenience.
    if (!secret) {
      if (process.env.NODE_ENV === 'production') {
        strapi.log.warn('[gcal-sync] POST /api/events/sync-calendar rejected — WEBHOOK_SECRET is not set');
        return ctx.unauthorized('Webhook secret not configured');
      }
    } else {
      const provided = ctx.request.headers['x-webhook-secret'];
      if (typeof provided !== 'string' || !safeEqual(provided, secret)) {
        return ctx.unauthorized();
      }
    }

    await syncGoogleCalendar(strapi);
    ctx.body = { ok: true };
  },
}));
