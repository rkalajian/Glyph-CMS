import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::navigation.navigation' as Parameters<typeof factories.createCoreService>[0]
);
