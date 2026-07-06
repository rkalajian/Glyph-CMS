# Glyph CMS

Headless CMS — Strapi 5 backend + Next.js 15 frontend, deployed as static HTML to Netlify.

## Stack

| Layer | Tech |
|---|---|
| CMS | Strapi 5 (Node 20+) |
| Frontend | Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4 |
| Animation | Framer Motion |
| Validation | Zod |
| Database | PostgreSQL (Neon) |
| File uploads | Cloudinary (optional) |
| Hosting | Netlify (static) + Render (Strapi) |

## Local Development

### Prerequisites

- Node 20+

### Start backend

```bash
cd strapi-backend
npm install
npm run develop   # http://localhost:1337
```

### Start frontend

```bash
cd frontend
npm install
npm run dev       # http://localhost:3000
```

Frontend proxies `/api` → `http://localhost:1337` in dev automatically.

## Environment Variables

### Frontend (`frontend/.env.local`)

```env
# Omit in dev — proxies to localhost:1337 automatically
NEXT_PUBLIC_STRAPI_URL=https://your-strapi.onrender.com

# Public domain (no protocol) — used for sitemap.xml, canonical URLs, JSON-LD
NEXT_PUBLIC_SITE_DOMAIN=www.example.com

# Optional: staging noindex (disallow-all robots.txt + empty sitemap)
# NEXT_PUBLIC_NOINDEX=true

# Optional: IANA timezone for event date rendering (default America/New_York)
# NEXT_PUBLIC_TIMEZONE=America/New_York
```

### Backend (`strapi-backend/.env`)

See `strapi-backend/.env.example` for all variables. Key ones for production:

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=ep-xxx-pooler.region.aws.neon.tech
DATABASE_PORT=5432
DATABASE_NAME=neondb
DATABASE_USERNAME=neondb_owner
DATABASE_PASSWORD=your-password
DATABASE_SSL=true

APP_KEYS=key1,key2
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
TRANSFER_TOKEN_SALT=...
JWT_SECRET=...
ENCRYPTION_KEY=...

NODE_ENV=production
CORS_ORIGINS=https://your-site.netlify.app

# Optional: Cloudinary for persistent file uploads
CLOUDINARY_NAME=...
CLOUDINARY_KEY=...
CLOUDINARY_SECRET=...

# Optional: Google Calendar sync (or configure in Theme Options)
GOOGLE_CALENDAR_ID=...
GOOGLE_CALENDAR_API_KEY=...

# Optional: shared secret for POST /api/events/sync-calendar
WEBHOOK_SECRET=...

# Optional: POSTed when scheduled posts auto-publish (e.g. Netlify build hook)
FRONTEND_REBUILD_URL=...
```

## Production Build

Strapi must be reachable at `NEXT_PUBLIC_STRAPI_URL` during the build.

```bash
cd frontend
npm install
npm run build   # outputs static HTML to frontend/out/
```

`npm run prebuild` runs automatically — it scans `cms/components/` and generates the component registry.

## Deployment

### Netlify (frontend)

- **Build command:** `cd frontend && npm install && npm run build`
- **Publish directory:** `frontend/out`
- **Environment variable:** `NEXT_PUBLIC_STRAPI_URL`

To rebuild on content changes: add a Netlify build hook URL in Strapi admin → Settings → Webhooks (events: Entry publish/unpublish/delete, Media upload).

### Render (Strapi)

- **Root directory:** `strapi-backend`
- **Build command:** `npm install && npm run build`
- **Start command:** `npm run start`
- Set all backend env vars in Render dashboard (Render does not read `.env` files)

### After first deploy

1. Visit `https://your-strapi.onrender.com/admin` and create an admin user
2. Go to **Settings → Users & Permissions → Roles → Public**
3. Enable `find` and `findOne` for all content types (see below)

## Strapi Content Types

### Required public permissions

Enable `find` and `findOne` in Strapi admin → Settings → Users & Permissions → Roles → Public:

- Page
- Blog Post + Blog Category
- Press Release + Press Release Category
- Event
- Site Alert
- Navigation
- Theme Option
- Form
- Header Options + Footer Options (`find`)
- Redirect (`find`)

### Content type URLs

| Content Type | URL |
|---|---|
| Page | `/pages/:slug` (nested: `/pages/parent/child`) |
| Blog Post | `/blog` (list), `/blog/:slug` (post) |
| Press Release | `/press` (list), `/press/:slug` (post) |
| Event | `/events` (calendar month view), `/events/:slug` (detail) |
| Contact (Page slug = "contact") | `/contact` |
| Site search | `/search` |

### Nested pages

Pages support a parent relation. Saving a page with a parent auto-prefixes its slug (`careers` → `about-us/careers`); the `/pages/[...slug]` catch-all serves the nested URL, breadcrumbs include the parent, and the parent page renders an "In this section" list of children (crawlable links).

### Site search

`/search` queries the custom `GET /api/search` Strapi endpoint (title + configurable fields across Pages, Blog Posts, Press Releases, Events). Configure which types/fields are searchable in Theme Options → Search Configuration.

### Scheduled publishing

Set `scheduledPublishAt` on a **draft** blog post or press release; a cron publishes it when the time passes and POSTs `FRONTEND_REBUILD_URL` (if set) to trigger a rebuild.

### Site Alert

Displays a banner at the top of every page when the current date is between `startDate` and `endDate`. Severity: `info`, `warning`, or `critical`.

### Navigation (single type)

Manages **Utility Nav** (top bar), **Primary Nav** (header), and **Footer Nav**. Edit in Content Manager → Navigation.

### Theme Option (single type)

Controls site name, logo, favicon, colors, third-party script integrations (GTM, Marker.io), Google Calendar sync settings, reCAPTCHA keys, and search configuration.

### Header Options (single type)

Optional header overrides: a header-specific logo (falls back to Theme Options logo) and a call-to-action button (`ctaUrl` + `ctaLabel`) rendered on the right side of the desktop header.

### Footer Options (single type)

Rich footer content: footer logo, contact info (hours, phone, email, address), social links, link columns (each column links to a page or URL and holds child links), newsletter signup (Mailchimp or Constant Contact via the form action URL), legal text, partner logos, and a copyright override. When empty, the footer falls back to the simple branding + footer-nav layout.

### Redirects

The **Redirect** collection type manages URL redirects (`fromPath` → `toPath`, permanent/temporary, enable toggle). After `next build`, `scripts/generate-redirects.mjs` (postbuild hook) fetches enabled redirects from Strapi and writes a Netlify `_redirects` file into `frontend/out/`. Netlify placeholders (`/blog/:slug`) and splats (`/news/*` → `:splat`) are supported. Redirects are forced (`!`), so they win over existing static files.

### Page Builder Blocks

Pages compose content from a dynamic zone with two block families:

- **Tailgrids blocks** (`hero`, `features`, `pricing`, `team`, …) — rendered through the generated component registry (`DynamicBlock`)
- **Section blocks** (`homepage-hero`, `cta-banner`, `split-panel`, `photo-gallery`, `content-card-grid`, `featured-events`, `upcoming-events`, `featured-blog-posts`, `recent-blog-posts`, `contact-form`, `event-calendar`, `membership-pricing`, `leadership-grid`, and ~15 more) — full-width sections with their own styles, ported from a production site

Section blocks use the **block palette** tokens in `src/theme/tokens.css` (`primary`, `secondary`, `accent`, `ink`, `surface`, `highlight`, `accent-alt`) — change the values there to re-theme every block at once.

## Rich Text Editor (CKEditor 5)

Page, Blog Post, and Press Release `content` fields (and rich-text fields inside blocks) use **CKEditor 5** (`@_sh/strapi-plugin-ckeditor`) with the `defaultHtml` preset, producing HTML. The frontend `RichText` component renders HTML, Markdown, or Strapi Blocks content, and still supports the `[form:slug]` shortcode for embedding forms.

## Forms & reCAPTCHA

Set **reCAPTCHA v2 site key + secret key** in Theme Options to require verification on all form submissions. The site key renders a checkbox widget in `FormEmbed`; Strapi verifies the token server-side before accepting the submission. Leave both blank to disable (default).

## Cookie Consent

A consent banner renders on first visit. GTM only injects after the visitor accepts (Marker.io is not gated — it's a feedback tool, not analytics). A "Cookie Settings" footer button reopens the banner.

## Image Optimization

- **Local uploads:** converted to WebP (quality 82, max 4K) on upload, including responsive formats
- **Cloudinary:** `quality auto` + WebP/AVIF via `fetch_format auto` and eager transformations
- Upload size limit raised to 300 MB (body + provider config)

## Google Calendar Sync

Events can be auto-imported from a public Google Calendar. Configure in Theme Options (Calendar ID, API key, enable toggle) or via `strapi-backend/.env` (fallback). The sync runs on Strapi startup and on the cron schedule; `POST /api/events/sync-calendar` (with `x-webhook-secret` header when `WEBHOOK_SECRET` is set) triggers it manually.

- Events are matched by `googleCalendarEventId` — title, dates, description, location are always overwritten from Google
- The `image` field is **never overwritten** — upload one in Strapi to permanently attach it to a synced event
- Cancelled Google Calendar events are skipped; deleted events are not auto-removed from Strapi
- All-day dates are anchored at noon UTC so they don't roll back a day in US timezones
- Each event syncs independently — one bad event can't abort the batch

## Accessibility (WCAG 2.2)

- Skip link to main content on every page
- Semantic HTML (`<main>`, `<nav>`, `<article>`, `<section>`)
- Touch targets ≥ 44×44px
- Text contrast ≥ 4.5:1
- All form fields have associated `<label>` elements
- Visible focus indicators throughout
