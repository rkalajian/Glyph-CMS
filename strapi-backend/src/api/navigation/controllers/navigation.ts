import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::navigation.navigation' as Parameters<typeof factories.createCoreController>[0]
);
