/** Custom routes for form API - findBySlug and embed code */
export default {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/slug/:slug',
      handler: 'api::form.form.findBySlug',
      config: { auth: false },
    },
  ],
};
