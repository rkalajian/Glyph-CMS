import type { Core } from '@strapi/strapi';

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: corsOrigins,
    },
  },
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      // JSON/form/text bodies stay small — only multipart uploads need 300 MB.
      // Large non-file limits let anyone POST huge payloads to any endpoint.
      formLimit: '5mb',
      jsonLimit: '5mb',
      textLimit: '5mb',
      formidable: {
        maxFileSize: 314572800, // 300 MB (media uploads)
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
