import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
  const mailgunKey = env('MAILGUN_API_KEY', '');
  const mailgunDomain = env('MAILGUN_DOMAIN', '');
  const useMailgun = Boolean(mailgunKey && mailgunDomain);

  const cloudinaryName = env('CLOUDINARY_NAME', '');
  const cloudinaryKey = env('CLOUDINARY_KEY', '');
  const cloudinarySecret = env('CLOUDINARY_SECRET', '');
  const useCloudinary = Boolean(cloudinaryName && cloudinaryKey && cloudinarySecret);

  return {
    'strapi-cloud': { enabled: false },
    upload: useCloudinary
      ? {
          config: {
            provider: '@strapi/provider-upload-cloudinary',
            providerOptions: {
              cloud_name: cloudinaryName,
              api_key: cloudinaryKey,
              api_secret: cloudinarySecret,
            },
            actionOptions: {
              upload: {},
              uploadStream: {},
              delete: {},
            },
          },
        }
      : {},
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
