import type { Core } from '@strapi/strapi';

const THEME_OPTIONS_UID = 'api::theme-options.theme-option';
const NAVIGATION_UID = 'api::navigation.navigation';
const PAGE_UID = 'api::page.page';
const FORM_UID = 'api::form.form';

/** Section pages: Home, Blog, Press, Events, Contact – editable in Content Manager */
const SECTION_PAGES: Array<{ slug: string; title: string; subtitle: string }> = [
  { slug: 'home', title: 'Home', subtitle: 'A simple, templatable CMS powered by Glyph.' },
  { slug: 'blog', title: 'Blog', subtitle: 'Latest posts' },
  { slug: 'press', title: 'Press', subtitle: 'Latest press releases' },
  { slug: 'events', title: 'Events', subtitle: 'Event calendar' },
  { slug: 'contact', title: 'Contact', subtitle: 'Have a question? Send us a message using the form below.' },
];

/** Desired Form edit layout: core fields, success options (message/redirect conditional), email group */
const FORM_EDIT_LAYOUT = [
  [{ name: 'name', size: 6 }, { name: 'slug', size: 6 }],
  [{ name: 'description', size: 12 }],
  [{ name: 'fields', size: 12 }],
  [{ name: 'submitButtonLabel', size: 6 }],
  [{ name: 'successType', size: 12 }],
  [{ name: 'successMessage', size: 12 }],
  [{ name: 'successRedirectUrl', size: 12 }],
  [{ name: 'notifyEmail', size: 4 }, { name: 'notifySubmitter', size: 4 }, { name: 'emailSubject', size: 4 }],
  [{ name: 'submissions', size: 12 }],
];

/** Default contact form fields (Name, Email, Message) */
const CONTACT_FORM_FIELDS = [
  { type: 'text' as const, name: 'name', label: 'Name', required: true },
  { type: 'email' as const, name: 'email', label: 'Email', required: true },
  { type: 'textarea' as const, name: 'message', label: 'Message', required: true },
];

/** Desired Theme Options edit layout order: Site Name, Logo, Breadcrumbs, Social, Mailgun, GTM, Marker */
const THEME_OPTIONS_EDIT_LAYOUT = [
  [{ name: 'siteName', size: 12 }],
  [{ name: 'logo', size: 12 }],
  [{ name: 'showBreadcrumbs', size: 12 }],
  [{ name: 'social', size: 12 }],
  [{ name: 'mailgun', size: 12 }],
  [{ name: 'gtm', size: 12 }],
  [{ name: 'marker', size: 12 }],
];

/** Desired Navigation edit layout: Name, Utility Nav, Primary Nav, Footer Nav modules */
const NAVIGATION_EDIT_LAYOUT = [
  [{ name: 'name', size: 12 }],
  [{ name: 'utilityNav', size: 12 }],
  [{ name: 'primaryNav', size: 12 }],
  [{ name: 'footerNav', size: 12 }],
];

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Ensure section pages exist (create if missing)
    try {
      const docService = strapi.documents(PAGE_UID);
      for (const { slug, title, subtitle } of SECTION_PAGES) {
        const existing = await docService.findFirst({ filters: { slug } });
        if (!existing) {
          await docService.create({
            data: { title, slug, subtitle },
            status: 'published',
          });
        }
      }
    } catch {
      // Ignore if DB not ready or pages already exist
    }

    // Ensure contact form exists for Contact page (defer until Strapi is fully ready)
    setTimeout(async () => {
      try {
        const formService = strapi.documents(FORM_UID);
        const existing = await formService.findFirst({
          filters: { slug: 'contact' },
        });
        if (!existing) {
          await formService.create({
            data: {
              name: 'Contact',
              slug: 'contact',
              description: 'Get in touch',
              fields: CONTACT_FORM_FIELDS,
              submitButtonLabel: 'Send message',
              successType: 'message',
              successMessage: 'Thank you! Your message has been sent.',
            },
            status: 'published',
          });
          strapi.log.info('Created Contact form in Form Builder');
        }
      } catch (err) {
        strapi.log.warn('Could not create Contact form:', err);
      }
    }, 2000);

    // Ensure default Navigation exists (Utility Nav, Primary Nav, Footer Nav modules)
    setTimeout(async () => {
      try {
        const navService = strapi.documents(NAVIGATION_UID);
        const existing = await navService.findFirst({});
        if (existing?.documentId && (existing.name == null || existing.name === '')) {
          try {
            await navService.update({ documentId: existing.documentId, data: { name: 'Navigation' } });
          } catch {
            // Ignore update errors
          }
        }
        if (!existing) {
          const defaultPrimary = [
            { label: 'Home', url: '/', order: 0 },
            { label: 'Blog', url: '/blog', order: 1 },
            { label: 'Press', url: '/press', order: 2 },
            { label: 'Events', url: '/events', order: 3 },
            { label: 'Contact', url: '/contact', order: 4 },
          ];
          const defaultFooter = defaultPrimary.map((item, i) => ({ ...item, label: item.label, order: i }));
          await navService.create({
            data: {
              name: 'Navigation',
              utilityNav: [],
              primaryNav: defaultPrimary,
              footerNav: defaultFooter,
            },
            status: 'published',
          });
          strapi.log.info('Created default Navigation with Primary Nav and Footer Nav');
        }
      } catch (err) {
        strapi.log.warn('Could not create default Navigation:', err);
      }
    }, 2500);

    try {
      const contentType = strapi.contentTypes[THEME_OPTIONS_UID];
      if (contentType) {
        const cmService = strapi.plugin('content-manager').service('content-types');
        const config = await cmService.findConfiguration(contentType);

        await cmService.updateConfiguration(contentType, {
        ...config,
        settings: {
          ...config?.settings,
          mainField: 'siteName',
        },
        layouts: {
          ...config?.layouts,
          edit: THEME_OPTIONS_EDIT_LAYOUT,
        },
      });
      }
    } catch {
      // Ignore if content-manager not ready or config not found
    }

    try {
      const navContentType = strapi.contentTypes[NAVIGATION_UID];
      if (navContentType) {
        const cmService = strapi.plugin('content-manager').service('content-types');
        const navConfig = await cmService.findConfiguration(navContentType);

        await cmService.updateConfiguration(navContentType, {
          ...navConfig,
          settings: {
            ...navConfig?.settings,
            mainField: 'name',
          },
          layouts: {
            ...navConfig?.layouts,
            edit: NAVIGATION_EDIT_LAYOUT,
          },
        });
      }
    } catch {
      // Ignore if content-manager not ready or config not found
    }

    try {
      const formContentType = strapi.contentTypes[FORM_UID];
      if (formContentType) {
        const cmService = strapi.plugin('content-manager').service('content-types');
        const formConfig = await cmService.findConfiguration(formContentType);

        await cmService.updateConfiguration(formContentType, {
        ...formConfig,
        settings: {
          ...formConfig?.settings,
          mainField: 'name',
        },
        layouts: {
          ...formConfig?.layouts,
          edit: FORM_EDIT_LAYOUT,
        },
      });
      }
    } catch {
      // Ignore if content-manager not ready or config not found
    }
  },
};
