import { factories } from '@strapi/strapi';

export default factories.createCoreRouter(
  'api::navigation.navigation' as Parameters<typeof factories.createCoreRouter>[0]
);
