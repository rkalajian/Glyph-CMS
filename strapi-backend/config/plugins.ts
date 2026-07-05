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
    'users-permissions': {
      config: {
        jwtSecret: env('JWT_SECRET'),
      },
    },
    upload: useCloudinary
      ? {
          config: {
            sizeLimit: 314572800, // 300 MB
            provider: '@strapi/provider-upload-cloudinary',
            providerOptions: {
              cloud_name: cloudinaryName,
              api_key: cloudinaryKey,
              api_secret: cloudinarySecret,
            },
            actionOptions: {
              upload: {
                resource_type: 'auto',
                // Auto-select quality and serve WebP/AVIF based on browser support
                transformation: [{ quality: 'auto:good', fetch_format: 'auto' }],
                eager: [
                  { width: 1920, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' },
                  { width: 1000, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' },
                  { width: 750, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' },
                  { width: 500, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' },
                ],
                eager_async: true,
              },
              uploadStream: {
                resource_type: 'auto',
                transformation: [{ quality: 'auto:good', fetch_format: 'auto' }],
              },
              delete: {},
            },
          },
        }
      : {
          config: {
            sizeLimit: 314572800, // 300 MB
            sizeOptimization: true,
            autoOrientation: true,
            breakpoints: {
              xlarge: 1920,
              large: 1000,
              medium: 750,
              small: 500,
              xsmall: 64,
            },
          },
        },
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
