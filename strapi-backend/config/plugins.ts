import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
  const mailgunKey = env('MAILGUN_API_KEY', '');
  const mailgunDomain = env('MAILGUN_DOMAIN', '');
  const useMailgun = Boolean(mailgunKey && mailgunDomain);

  return {
    email: useMailgun
      ? {
          config: {
            provider: 'mailgun',
            providerOptions: {
              key: mailgunKey,
              domain: mailgunDomain,
              url: env('MAILGUN_URL', 'https://api.mailgun.net'),
            },
            settings: {
              defaultFrom: env('MAILGUN_DEFAULT_FROM', ''),
              defaultReplyTo: env('MAILGUN_DEFAULT_REPLY_TO', ''),
            },
          },
        }
      : {},
  };
};

export default config;
