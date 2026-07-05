export default {
  routes: [
    {
      method: 'POST',
      path: '/events/sync-calendar',
      handler: 'event.syncCalendar',
      config: { auth: false, policies: [], middlewares: [] },
    },
  ],
};
