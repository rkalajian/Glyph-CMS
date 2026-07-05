import path from 'path';
import fs from 'fs';
import type { Core } from '@strapi/strapi';
import { syncGoogleCalendar } from './google-calendar-sync';

// Formats that either can't be usefully converted to WebP (SVG, GIF animation)
// or are already modern/compressed (WebP, AVIF).
const SKIP_WEBP = new Set(['image/webp', 'image/avif', 'image/svg+xml', 'image/gif']);
const WEBP_QUALITY = 82;
const MAX_DIMENSION = 3840; // cap originals at 4K; responsive breakpoints are already smaller

async function toWebP(
  uploadsDir: string,
  hash: string,
  ext: string,
): Promise<{ size: number; sizeInBytes: number } | null> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const sharp = require('sharp') as typeof import('sharp');
  const oldPath = path.join(uploadsDir, `${hash}${ext}`);
  const newPath = path.join(uploadsDir, `${hash}.webp`);
  if (!fs.existsSync(oldPath)) return null;
  try {
    const info = await (sharp as any)(oldPath)
      .rotate()
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toFile(newPath);
    await fs.promises.unlink(oldPath);
    return { size: info.size / 1024, sizeInBytes: info.size };
  } catch {
    await fs.promises.unlink(newPath).catch(() => {});
    return null;
  }
}

async function optimizeUpload(strapi: Core.Strapi, file: any): Promise<void> {
  // Only local-provider files (Cloudinary handles its own optimisation)
  if (!file.url?.startsWith('/uploads/')) return;
  if (!file.mime?.startsWith('image/') || SKIP_WEBP.has(file.mime)) return;

  const uploadsDir = path.resolve((strapi as any).dirs.static.public, 'uploads');

  const mainResult = await toWebP(uploadsDir, file.hash, file.ext);
  if (!mainResult) return;

  // Convert each responsive format (thumbnail, small, medium, large, xlarge)
  const newFormats: Record<string, unknown> = {};
  for (const [key, fmt] of Object.entries(file.formats ?? {})) {
    if (!fmt) { newFormats[key] = fmt; continue; }
    const f = fmt as any;
    const fResult = await toWebP(uploadsDir, f.hash, f.ext);
    newFormats[key] = fResult
      ? { ...f, ext: '.webp', mime: 'image/webp', url: `/uploads/${f.hash}.webp`,
          name: f.name?.replace(/\.[^.]+$/, '.webp') ?? f.name, ...fResult }
      : f;
  }

  await strapi.db.query('plugin::upload.file').update({
    where: { id: file.id },
    data: {
      name: file.name?.replace(/\.[^.]+$/, '.webp') ?? file.name,
      ext: '.webp',
      mime: 'image/webp',
      url: `/uploads/${file.hash}.webp`,
      size: mainResult.size,
      sizeInBytes: mainResult.sizeInBytes,
      formats: newFormats,
    },
  });

  strapi.log.info(
    `[image-opt] ${file.name} → WebP ${Math.round(mainResult.sizeInBytes / 1024)}KB`
  );
}

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

/** Desired Theme Options edit layout order: Site Name, Logo, Frontend Mode, Breadcrumbs, Pagination, Social, Calendar, reCAPTCHA, Search, Mailgun, GTM, Marker */
const THEME_OPTIONS_EDIT_LAYOUT = [
  [{ name: 'siteName', size: 12 }],
  [{ name: 'logo', size: 6 }, { name: 'favicon', size: 6 }],
  [{ name: 'frontendMode', size: 12 }],
  [{ name: 'showBreadcrumbs', size: 12 }],
  [{ name: 'blogPostsPerPage', size: 6 }, { name: 'pressReleasesPerPage', size: 6 }],
  [{ name: 'social', size: 12 }],
  [{ name: 'googleCalendarId', size: 6 }, { name: 'googleCalendarApiKey', size: 6 }],
  [{ name: 'googleCalendarSyncEnabled', size: 6 }],
  [{ name: 'recaptchaSiteKey', size: 6 }, { name: 'recaptchaSecretKey', size: 6 }],
  [{ name: 'searchConfig', size: 12 }],
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

/** Page edit layout: blocks above content */
const PAGE_EDIT_LAYOUT = [
  [{ name: 'title', size: 8 }, { name: 'slug', size: 4 }],
  [{ name: 'subtitle', size: 12 }],
  [{ name: 'blocks', size: 12 }],
  [{ name: 'content', size: 12 }],
  [{ name: 'quickLinks', size: 12 }],
  [{ name: 'seoTitle', size: 6 }, { name: 'seoDescription', size: 6 }],
  [{ name: 'parent', size: 6 }],
];

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    // Auto-prefix page slugs with parent slug (e.g. "careers" → "about-us/careers").
    // Runs on create and update; always strips any existing prefix first so re-saves
    // don't double-prefix.
    (strapi.documents as any).use(async (context: any, next: any) => {
      if (context.uid !== PAGE_UID) return next();
      if (context.action !== 'create' && context.action !== 'update') return next();

      const data = context.params?.data;
      if (!data?.slug) return next();

      // Strip any existing parent prefix → work with leaf segment only
      const leafSlug: string = (data.slug as string).includes('/')
        ? (data.slug as string).split('/').pop()!
        : (data.slug as string);

      const connectIds: string[] = ((data.parent?.connect ?? []) as any[])
        .map((c: any) => c.documentId as string)
        .filter(Boolean);
      const hasDisconnect = (data.parent?.disconnect?.length ?? 0) > 0 && connectIds.length === 0;

      if (hasDisconnect) {
        data.slug = leafSlug;
        return next();
      }

      let parentDocId: string | null = connectIds[0] ?? null;

      if (!parentDocId && context.action === 'update') {
        try {
          const existing = await (strapi.documents(PAGE_UID) as any).findOne({
            documentId: context.params.documentId,
            populate: { parent: true },
          });
          parentDocId = (existing?.parent as any)?.documentId ?? null;
        } catch { /* ignore */ }
      }

      if (!parentDocId) {
        data.slug = leafSlug;
        return next();
      }

      try {
        const parent = await (strapi.documents(PAGE_UID) as any).findOne({
          documentId: parentDocId,
          fields: ['slug'],
        });
        const parentSlug: string | null = (parent?.slug as string | undefined) ?? null;
        if (parentSlug) {
          data.slug = `${parentSlug}/${leafSlug}`;
        } else {
          data.slug = leafSlug;
        }
      } catch {
        data.slug = leafSlug;
      }

      return next();
    });

    // Register Google Calendar sync cron job.
    // Default: every hour. Override with GOOGLE_CALENDAR_SYNC_CRON env var.
    const cronExpression = process.env.GOOGLE_CALENDAR_SYNC_CRON ?? '0 * * * *';
    strapi.cron.add({
      googleCalendarSync: {
        task: async () => { await syncGoogleCalendar(strapi); },
        options: { rule: cronExpression },
      },
      // Publish scheduled blog posts and press releases whose scheduledPublishAt <= now.
      // Runs every minute. Publishes draft entries and triggers a frontend rebuild if any fire.
      scheduledPublish: {
        task: async () => {
          const now = new Date().toISOString();
          const uids: Array<'api::blog-post.blog-post' | 'api::press-release.press-release'> = [
            'api::blog-post.blog-post',
            'api::press-release.press-release',
          ];
          let published = 0;
          for (const uid of uids) {
            const due = await strapi.documents(uid).findMany({
              status: 'draft',
              filters: {
                scheduledPublishAt: { $lte: now },
              } as any,
              fields: ['documentId', 'title'],
            });
            for (const entry of due) {
              try {
                await strapi.documents(uid).publish({ documentId: entry.documentId });
                strapi.log.info(`[scheduledPublish] Published ${uid} "${entry.title}" (${entry.documentId})`);
                published++;
              } catch (err) {
                strapi.log.warn(`[scheduledPublish] Failed to publish ${uid} "${entry.title}":`, err);
              }
            }
          }
          if (published > 0) {
            const rebuildUrl = process.env.FRONTEND_REBUILD_URL;
            if (rebuildUrl) {
              const authHeaders: Record<string, string> = process.env.WEBHOOK_SECRET
                ? { Authorization: `Bearer ${process.env.WEBHOOK_SECRET}` }
                : {};
              fetch(rebuildUrl, { method: 'POST', headers: authHeaders }).catch((err: Error) => {
                strapi.log.warn('[scheduledPublish] Could not trigger rebuild:', err.message);
              });
            }
          }
        },
        options: { rule: '* * * * *' },
      },
    });

    // Site search — queries enabled content types configured in Theme Options.
    (strapi.server.router as any).get('/api/search', async (ctx: any) => {
      const q = (ctx.query.q as string | undefined)?.trim() ?? '';
      const typeFilter = ctx.query.types as string | undefined;

      if (q.length < 2) {
        ctx.set('Content-Type', 'application/json');
        ctx.body = JSON.stringify({ data: [], meta: { total: 0, query: q } });
        return;
      }

      type SearchCfg = { label: string; fields: string[] };

      const TYPE_DEFAULTS: Record<string, SearchCfg> = {
        'pages':          { label: 'Pages',          fields: ['title', 'subtitle'] },
        'blog-posts':     { label: 'Blog Posts',     fields: ['title', 'excerpt'] },
        'press-releases': { label: 'Press Releases', fields: ['title', 'excerpt'] },
        'events':         { label: 'Events',         fields: ['title', 'location'] },
      };

      const TYPE_UID: Record<string, string> = {
        'pages':          'api::page.page',
        'blog-posts':     'api::blog-post.blog-post',
        'press-releases': 'api::press-release.press-release',
        'events':         'api::event.event',
      };

      const TYPE_EXCERPT: Record<string, string> = {
        'pages': 'subtitle', 'blog-posts': 'excerpt',
        'press-releases': 'excerpt', 'events': 'location',
      };

      const TYPE_URL = (type: string, slug: string) => {
        const map: Record<string, string> = {
          'pages': `/pages/${slug}`, 'blog-posts': `/blog/${slug}`,
          'press-releases': `/press/${slug}`, 'events': `/events/${slug}`,
        };
        return map[type] ?? `/${slug}`;
      };

      const TYPE_IMAGE: Record<string, string> = {
        'blog-posts': 'coverImage', 'press-releases': 'coverImage', 'events': 'image',
      };

      try {
        // Load searchConfig from theme options
        const themeOpts = await strapi.documents(THEME_OPTIONS_UID as any).findFirst({
          populate: { searchConfig: true },
          status: 'published',
        }) as any;

        const rawConfig: any[] = themeOpts?.searchConfig ?? [];
        const configMap: Record<string, SearchCfg> = {};

        if (rawConfig.length === 0) {
          Object.assign(configMap, TYPE_DEFAULTS);
        } else {
          for (const cfg of rawConfig) {
            if (!cfg.enabled) continue;
            const fields = cfg.fields?.trim()
              ? cfg.fields.split(',').map((f: string) => f.trim()).filter(Boolean)
              : TYPE_DEFAULTS[cfg.contentType]?.fields ?? ['title'];
            configMap[cfg.contentType] = {
              label: cfg.label?.trim() || (TYPE_DEFAULTS[cfg.contentType]?.label ?? cfg.contentType),
              fields,
            };
          }
        }

        const requestedTypes = typeFilter?.split(',').map((t: string) => t.trim()).filter(Boolean);
        const activeTypes = Object.entries(configMap).filter(
          ([type]) => !requestedTypes?.length || requestedTypes.includes(type)
        );

        const results: any[] = [];

        await Promise.all(activeTypes.map(async ([type, cfg]) => {
          const uid = TYPE_UID[type];
          if (!uid) return;

          const orConditions = cfg.fields.map((field: string) => ({ [field]: { $containsi: q } }));
          const filters = orConditions.length === 1 ? orConditions[0] : { $or: orConditions };
          const imageField = TYPE_IMAGE[type];
          const titleField = 'title';
          const excerptField = TYPE_EXCERPT[type] ?? '';
          const extraFields = [titleField, excerptField, 'slug'].filter(Boolean);
          const allFields = [...new Set([...cfg.fields, ...extraFields])];

          const items = await strapi.documents(uid as any).findMany({
            filters: filters as any,
            status: 'published',
            pagination: { pageSize: 20 },
            populate: imageField ? { [imageField]: { fields: ['url', 'alternativeText', 'width', 'height'] } } : {},
            fields: allFields,
          }) as any[];

          for (const item of items ?? []) {
            results.push({
              type,
              label: cfg.label,
              documentId: item.documentId,
              title: item[titleField] ?? '',
              slug: item.slug ?? '',
              url: TYPE_URL(type, item.slug),
              excerpt: excerptField ? (item[excerptField] ?? '') : '',
              image: imageField ? (item[imageField] ?? null) : null,
            });
          }
        }));

        ctx.set('Content-Type', 'application/json');
        ctx.body = JSON.stringify({ data: results, meta: { total: results.length, query: q } });
      } catch (err) {
        strapi.log.error('[search] error:', err);
        ctx.status = 500;
        ctx.body = JSON.stringify({ data: [], error: 'Search failed' });
      }
    });
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Convert uploaded images to WebP and compress on creation (local provider only).
    strapi.db.lifecycles.subscribe({
      models: ['plugin::upload.file'],
      async afterCreate(event) {
        await optimizeUpload(strapi, event.result).catch((err: unknown) =>
          strapi.log.warn('[image-opt] conversion failed:', err)
        );
      },
    });

    // One-time migration: prefix child page slugs that were created before the
    // auto-prefix lifecycle was added.  Idempotent — skips any slug that already
    // contains "/" or has no parent set.
    setTimeout(async () => {
      try {
        const docService = strapi.documents(PAGE_UID) as any;
        const pages = await docService.findMany({
          populate: { parent: true },
          fields: ['slug'],
          pagination: { pageSize: 200 },
        });
        for (const page of pages ?? []) {
          if (!page.parent) continue;
          const parentSlug = String((page.parent as any)?.slug ?? '');
          if (!parentSlug) continue;
          const currentSlug = String(page.slug ?? '');
          const leafSlug = currentSlug.split('/').pop()!;
          const expectedSlug = `${parentSlug}/${leafSlug}`;
          if (currentSlug === expectedSlug) continue;
          await docService.update({
            documentId: page.documentId,
            data: { slug: leafSlug },
          });
          strapi.log.info(`[slug-migration] fixed "${currentSlug}" → "${expectedSlug}" for ${page.documentId}`);
        }
      } catch (e) {
        strapi.log.warn('[slug-migration] could not fix child slugs:', e);
      }
    }, 5000);

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
      const pageContentType = strapi.contentTypes[PAGE_UID];
      if (pageContentType) {
        const cmService = strapi.plugin('content-manager').service('content-types');
        const pageConfig = await cmService.findConfiguration(pageContentType);
        await cmService.updateConfiguration(pageContentType, {
          ...pageConfig,
          settings: { ...pageConfig?.settings, mainField: 'title' },
          layouts: { ...pageConfig?.layouts, edit: PAGE_EDIT_LAYOUT },
        });
      }
    } catch {
      // Ignore if content-manager not ready
    }

    // Run Google Calendar sync on startup (after Strapi is fully ready)
    setTimeout(() => syncGoogleCalendar(strapi), 5000);

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
