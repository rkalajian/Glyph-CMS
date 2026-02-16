/**
 * Email service using Mailgun config from Theme Options or env.
 * Use strapi.service('api::theme-options.email').send(...)
 */

import type { Core } from '@strapi/strapi';

interface MailgunConfig {
  apiKey?: string | null;
  domain?: string | null;
  host?: string | null;
  defaultFrom?: string | null;
  defaultReplyTo?: string | null;
}

interface SendOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  replyTo?: string;
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async send(options: SendOptions): Promise<{ success: boolean; error?: string }> {
    const key = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    let apiKey = key ?? '';
    let mailgunDomain = domain ?? '';
    let defaultFrom = process.env.MAILGUN_DEFAULT_FROM ?? '';
    let defaultReplyTo = process.env.MAILGUN_DEFAULT_REPLY_TO ?? '';
    let host = process.env.MAILGUN_URL ?? 'https://api.mailgun.net';

    // Prefer Theme Options config when set
    try {
      const themeDoc = await strapi.documents('api::theme-options.theme-option').findFirst({
        status: 'published',
        populate: ['mailgun'],
      });
      const mailgun = ((themeDoc as { mailgun?: MailgunConfig })?.mailgun ?? {}) as MailgunConfig;
      if (mailgun.apiKey) apiKey = mailgun.apiKey;
      if (mailgun.domain) mailgunDomain = mailgun.domain;
      if (mailgun.host) host = /^https?:\/\//i.test(mailgun.host) ? mailgun.host : `https://${mailgun.host}`;
      if (mailgun.defaultFrom) defaultFrom = mailgun.defaultFrom;
      if (mailgun.defaultReplyTo) defaultReplyTo = mailgun.defaultReplyTo;
    } catch {
      // Use env defaults
    }

    if (!apiKey || !mailgunDomain) {
      return { success: false, error: 'Mailgun not configured. Set MAILGUN_API_KEY and MAILGUN_DOMAIN, or configure in Theme Options > Mailgun.' };
    }

    const from = options.from ?? defaultFrom;
    if (!from) {
      return { success: false, error: 'From address required. Set MAILGUN_DEFAULT_FROM or Theme Options > Mailgun > Default From.' };
    }

    try {
      const Mailgun = (await import('mailgun.js')).default;
      const FormData = (await import('form-data')).default;
      const mailgun = new Mailgun(FormData);
      const mg = mailgun.client({
        username: 'api',
        key: apiKey,
        url: host,
      });

      const to = Array.isArray(options.to) ? options.to : [options.to];
      await mg.messages.create(mailgunDomain, {
        from,
        to,
        subject: options.subject,
        text: options.text ?? options.html ?? '',
        html: options.html ?? undefined,
        'h:Reply-To': options.replyTo ?? (defaultReplyTo || undefined),
      });

      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      strapi.log?.error?.('Mailgun send failed:', err);
      return { success: false, error: msg };
    }
  },
});
