# Glyph CMS — Claude Code Guidelines

## Project Overview

Headless CMS with a **Strapi 5 backend** and **React 19 + TypeScript + Next.js 15 (App Router) + Tailwind CSS 4** frontend. Generates static HTML for all routes via `next build` (no Puppeteer), deploys to Netlify (static) + Render (Strapi) + Neon (PostgreSQL), supports Netlify Forms, WCAG 2.2 accessibility, and Lighthouse 90+ scores.

## Repository Structure

```
cms/
├── frontend/          # Next.js 15 App Router (React 19, Tailwind, Framer Motion, Zod)
│   ├── app/               # App Router routes (generates static HTML)
│   │   ├── page.tsx           # Home page (/))
│   │   ├── layout.tsx         # Root layout (server component, fetches nav/theme)
│   │   ├── globals.css        # Global styles + Tailwind
│   │   ├── blog/
│   │   │   ├── page.tsx       # Blog listing (page 1, category filter via search params)
│   │   │   └── [slug]/
│   │   │       └── page.tsx   # Blog post (generateStaticParams for all posts)
│   │   ├── press/, events/, events/[slug]/, contact/  # Similar pattern
│   │   ├── pages/[...slug]/   # Catch-all — nested page slugs contain "/" (parent prefix)
│   │   ├── search/            # Site search (client component + /api/search endpoint)
│   │   ├── robots.ts, sitemap.ts  # SEO (NEXT_PUBLIC_SITE_DOMAIN, NEXT_PUBLIC_NOINDEX)
│   │   └── embed/form/[slug]/page.tsx  # Form embed (no layout wrapper)
│   ├── src/
│   │   ├── components/    # Shared UI (many marked "use client" for state/hooks)
│   │   ├── lib/           # strapi.ts (API client, env vars updated)
│   │   │   ├── strapi.ts           # API functions, getPages(), getForms() added
│   │   │   ├── strapi-schemas.ts   # Zod schemas
│   │   │   └── metadata.ts         # buildPageMetadata() helper
│   │   ├── theme/         # tokens.css, dark.css, templates/
│   │   ├── types/         # strapi.ts (TypeScript interfaces)
│   │   └── utils/         # classes.ts, format.ts
│   ├── scripts/           # generate-registry.mjs (replaces Puppeteer prerender)
│   ├── public/            # Static assets (glyph.svg)
│   ├── next.config.ts     # Next.js config (output: 'export', trailingSlash: true)
│   └── postcss.config.mjs # Tailwind CSS 4 PostCSS plugin
└── strapi-backend/    # Strapi 5 CMS
    ├── config/            # database.ts, plugins.ts, server.ts, middlewares.ts
    ├── src/
    │   ├── api/           # Content types (page, blog-post, event, form, etc.)
    │   └── components/blocks/  # 398 Tailgrids components
    └── .env.example       # All required env vars documented
```

## Dev Commands

```bash
# Root (concurrent dev)
npm run dev:backend      # Strapi on :1337
npm run dev:frontend     # Next.js dev on :3000

# Frontend
npm run prebuild         # Generate component registry (required before build)
npm run build            # Build and prerender all static routes to out/

# Backend
npm run build:strapi
```

Environment variables:
- **Frontend** (`frontend/.env.local` or Netlify dashboard): `NEXT_PUBLIC_STRAPI_URL=https://your-strapi.onrender.com`
- **Backend** (`strapi-backend/.env` locally, Render dashboard in production): see `strapi-backend/.env.example`
- In dev, omit `NEXT_PUBLIC_STRAPI_URL` — Next.js proxies `/api` → `localhost:1337` automatically

## Code Standards

### TypeScript
- Prefer `interface` over `type` for object shapes
- Use Zod for **all** external API data (Strapi responses go through `parseStrapiResponse()`)
- All Strapi types live in `frontend/src/types/strapi.ts` — extend there, don't create parallel type files
- API calls go through `frontend/src/lib/strapi.ts` — add new endpoints there

### React / Components — App Router Conventions
- **Server components** (default): Fetch data with `await`, no hooks, no `"use client"`
  - Example: page files (`app/blog/[slug]/page.tsx`) are server components by default
  - Call Strapi API directly: `const post = await getBlogPost(slug)`
- **Client components** (marked with `"use client"`): State, effects, event handlers, browser APIs
  - Leaf components: `NavLink`, `Pagination`, `Breadcrumb`, `SiteAlerts` (interactive)
  - Server passes props to client: `<ClientComponent data={preloadedData} />`
- `generateStaticParams` required for all `[slug]` routes (called at build time)
  - Example: blog post page fetches all slugs from Strapi, Next.js generates `/blog/post-1/index.html`, `/blog/post-2/index.html`, etc.
- `generateMetadata` replaces `DocumentTitle` component
  - Each page exports metadata: `export async function generateMetadata() { return buildPageMetadata(...) }`
- Kebab-case directories (`components/blocks/`), PascalCase component files (`BlockRenderer.tsx`)
- Use `framer-motion` for transitions and hover states, not CSS transitions

### Tailwind CSS
- Utility-first: avoid `@apply` except for base resets
- Mobile-first ordering: `w-full md:w-1/2 lg:w-1/3`
- **No string interpolation** for class names: use lookup objects instead of `` `text-${color}` ``
- Design tokens are in `frontend/src/theme/tokens.css` — use `text-fg`, `bg-bg`, `text-accent`, `border-border`, `text-muted`

### Netlify Forms
- Every form needs `<input type="hidden" name="form-name" value="[name]" />`
- Include a honeypot field for bot protection
- Submit via `fetch` POST with `Content-Type: application/x-www-form-urlencoded`
- Keep a static HTML fallback in `public/` for Netlify's build-time crawler

### Performance (Lighthouse v10 targets)
- TBT < 50ms: use `requestIdleCallback` for non-critical logic
- Every `<img>` and `<video>` **must** have explicit `width` and `height`
- LCP image: `fetchpriority="high"` + `loading="eager"` — never lazy-load it
- Non-essential images: `loading="lazy"`
- Third-party scripts (GTM, Marker.io): use `defer` — see `ThemeScripts.tsx`
- Prefer native `Intl` or `date-fns` over heavy libs like Moment.js

### Accessibility (WCAG 2.2)
- Semantic tags: `<main>`, `<section>`, `<nav>`, `<article>`
- Skip link to main content on every page
- Touch targets ≥ 24×24px (aim for 44×44px)
- Text contrast ≥ 4.5:1 (WCAG AA)
- All form fields must have associated `<label>` elements

## Strapi API

The frontend proxies `/api` → `localhost:1337` in dev. Set `NEXT_PUBLIC_STRAPI_URL` for production.

After any Strapi schema change, run `npm run build:strapi` and regenerate types if needed.

**Public permissions** must be enabled in Strapi admin (Settings → Users & Permissions → Public) for: Page, Blog Post, Blog Category, Event, Site Alert, Navigation, Theme Option, Press Release, Press Release Category, Form, Header Options, Footer Options, Redirect.

## Static Generation

`npm run build` generates static HTML for all routes:

- **Page routes** (server components in `app/*.tsx`) call Strapi API functions (`getPage`, `getBlogPosts`, etc.)
- **Dynamic routes** (e.g., `/blog/[slug]`) export `generateStaticParams()` which fetches all slugs from Strapi
- Next.js calls `generateStaticParams` once per build, creates `/blog/post-1/index.html`, `/blog/post-2/index.html`, etc.
- Strapi must be reachable during `npm run build`
- Output is fully static HTML in `frontend/out/` — no server needed (perfect for Netlify static hosting)
- To add new static routes: create `app/new-route/page.tsx` with `generateMetadata` and `generateStaticParams` (if dynamic)

## Google Calendar Sync

Events can be automatically imported from a public Google Calendar. Configure in **Theme Options** (Calendar ID, API key, sync toggle) or in `strapi-backend/.env` (fallback):

```env
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
GOOGLE_CALENDAR_API_KEY=your-api-key
GOOGLE_CALENDAR_SYNC_CRON=0 * * * *   # default: every hour
```

The sync service is in `strapi-backend/src/google-calendar-sync.ts`. It runs on Strapi startup and on the cron schedule. Key behaviour:
- Matches events by `googleCalendarEventId` — title, dates, description, location are always overwritten from Google
- The `image` field is **never overwritten** — upload one in Strapi to permanently attach it to a synced event
- Cancelled Google Calendar events are skipped; deleted-from-Google events are not auto-removed from Strapi

## Component Registry

Tailgrids components (398 dirs in `cms/components/`) are registered at build time:
- `scripts/generate-registry.mjs` runs before every build (via `prebuild` hook)
- Scans `cms/components/` and generates `frontend/src/components/component-registry.generated.ts`
- This replaces Vite's `import.meta.glob` which doesn't work in Next.js
- Auto-run: `npm run dev` and `npm run build` both trigger registry generation

## New Endpoints

These functions were added to `lib/strapi.ts` for Next.js static generation:
- `getPages()` — fetches all pages for `/pages/[...slug]` static param generation
- `getForms()` — fetches all forms for `/embed/form/[slug]` static param generation
- `getEvent(slug)` — single event for `/events/[slug]` detail pages
- `search(q, types?)` — hits the custom `GET /api/search` Strapi endpoint (registered in `strapi-backend/src/index.ts`); configurable in Theme Options → Search Configuration

Custom Strapi endpoints (registered in `src/index.ts` / api routes):
- `GET /api/search` — cross-content-type search (pages, blog-posts, press-releases, events)
- `POST /api/events/sync-calendar` — manual Google Calendar sync; requires `x-webhook-secret` header when `WEBHOOK_SECRET` is set

## Features Ported from Production (Beardsley-derived, genericized)

- **Nested pages** — a documents middleware auto-prefixes child page slugs with the parent slug (`about-us/careers`); `/pages/[...slug]` catch-all serves them; `ChildPagesList` renders crawlable child links on parent pages
- **Scheduled publishing** — `scheduledPublishAt` (draft blog posts/press releases) + per-minute cron; POSTs `FRONTEND_REBUILD_URL` after publishing
- **reCAPTCHA v2** — keys in Theme Options; `FormEmbed` renders the widget (auto-fetches site key when not passed as prop), form-submission controller verifies server-side; opt-in
- **Cookie consent** — `CookieConsentProvider/Banner/SettingsButton` in layout; GTM injection gated on acceptance in `ThemeScripts`
- **WebP upload optimization** — local-provider uploads converted to WebP via sharp (`optimizeUpload` in `src/index.ts`); Cloudinary path uses `quality auto` + `fetch_format auto`
- **SEO** — `app/robots.ts`, `app/sitemap.ts`, `JsonLd` + `src/lib/structured-data.ts` (article/event/breadcrumb schemas), canonical/OG support in `buildPageMetadata`
- **Admin UX** — `PageTreeList` (hierarchical Pages list), `PageSlugPrefix` (locked parent-prefix segment on slug input), `WysiwygSubSup` (sub/sup buttons in the markdown editor)
- **gcal-sync hardening** — per-event failure isolation, full-id slug hashing (recurring-event collisions), all-day dates anchored noon UTC, config via Theme Options with env fallback

**Second-wave port (block system, header/footer options, CKEditor, redirects):**

- **Section blocks** — ~30 production block components live alongside the Tailgrids registry. Strapi schemas in `strapi-backend/src/components/blocks/`, frontend in `frontend/src/components/blocks/*Block.tsx` (each block imports its own CSS file using Tailwind `@apply`). `BlockRenderer` dispatches: `renderPortedBlock()` handles section blocks (full-width, self-styled), everything else falls through to the Tailgrids `DynamicBlock` registry. Zoo-specific blocks (animal-*, conservation-*, google-reviews, event-type-grid, field-programs, rental-pricing-table, third-party-embed) were **not** ported.
- **Block palette** — brand colors renamed to generic tokens: forest→`primary`, earth→`ink`, sand→`surface`, tiger→`accent`, otter→`secondary`, frog→`highlight`, pumpkin→`accent-alt`. Values live in `frontend/src/theme/tokens.css`; schema enums and CSS classes use the generic names. When porting future block updates from the production repo, apply the same rename.
- **CKEditor 5** — `@_sh/strapi-plugin-ckeditor` (self-registers as `ckeditor5`, no plugin config needed). `content` fields on Page/Blog Post/Press Release and rich-text block fields use `plugin::ckeditor5.CKEditor` with the `defaultHtml` preset. `RichText` (frontend) renders the HTML via `rehype-raw`.
- **Header/Footer Options** — single types. Header: logo override + CTA button (`ctaUrl`/`ctaLabel`). Footer: contact info, link columns, newsletter (Mailchimp JSONP / Constant Contact iframe post), partner logos, legal text, copyright; rendered by `SiteFooter`, falls back to the simple footer when the single type is empty.
- **Redirect manager** — `Redirect` collection type + `frontend/scripts/generate-redirects.mjs` (postbuild) writes `out/_redirects` for Netlify. Redirect lines are forced (`!`). Uses `permanent`/`temporary` enum values (Strapi enums can't start with a digit, so not `301`/`302`).
- **`featured` flag** — added to Blog Post and Event for the featured-blog-posts / featured-events blocks.
- Local build gotcha: Next's fetch cache persists in `.next/cache` across builds — if content changes don't show up in a local rebuild, `rm -rf .next` first. (Netlify builds run in fresh containers, so production is unaffected.)

Intentionally **not** ported: Animal/Plant content types, zoo-specific blocks (see above), google-reviews sync, the VPS webhook build service.

## Deployment Architecture

- **Netlify** — serves `frontend/out/` (fully static HTML, no server)
  - Build command: `cd frontend && npm install && npm run build`
  - Strapi must be reachable during build for `generateStaticParams` to fetch slugs
  - Add a Netlify build hook to Strapi Webhooks for automatic content-triggered rebuilds
- **Render** — runs Strapi (Node.js web service, `strapi-backend/`)
  - Free tier spins down after 15 min inactivity; fine since Netlify only hits it at build time
  - All env vars set in Render dashboard (`.env` is not read in production)
- **Neon** — PostgreSQL database (free tier)
  - Use the **pooler** host (not direct host) for connection pooling
  - `DATABASE_SSL=true` required
- **Cloudinary** — file uploads (optional, free tier 25GB)
  - Without Cloudinary, uploads use local disk — lost on every Render redeploy
  - Configure via `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET` in Render env vars

### Empty content type builds

If a content type (e.g. press releases) has 0 published items, `generateStaticParams` returns `[{ slug: '__placeholder' }]` to satisfy Next.js `output: 'export'` requirements. The `__placeholder` slug renders `notFound()`. This is intentional — do not remove it.

## Documentation Updates

**After any major change** (new content type, new route, new block, changed API, changed build process, changed env vars), update:
1. `README.md` — build commands, env vars, new route, new content type URLs
2. `strapi-backend/.env.example` — any new env vars
3. Relevant inline comments in `strapi-backend/src/index.ts` bootstrap defaults
4. This `CLAUDE.md` if architectural conventions change


# AI Context (auto-generated by codesight)

This is a typescript project using next-app.
It is a monorepo with workspaces: frontend (frontend), strapi-backend (strapi-backend).

The UI has 567 components. See .codesight/components.md for the full list with props.
Middleware includes: validation, custom, auth.

High-impact files (most imported, changes here affect many other files):
- frontend/src/types/strapi.ts (imported by 15 files)
- frontend/src/components/RichText.tsx (imported by 9 files)
- frontend/src/lib/strapi.ts (imported by 8 files)
- frontend/src/components/Breadcrumb.tsx (imported by 7 files)
- frontend/src/utils/format.ts (imported by 4 files)
- components/SettingsPage/StateContext.jsx (imported by 3 files)
- components/SettingsPage2/StateContext.jsx (imported by 3 files)
- components/VerticalNavbar2/index.jsx (imported by 2 files)

Required environment variables (no defaults):
- CORS_ORIGINS (strapi-backend/config/middlewares.ts)
- DEV (frontend/src/lib/strapi-schemas.ts)
- FRONTEND_URL (strapi-backend/src/api/form/controllers/form.ts)
- GOOGLE_CALENDAR_API_KEY (strapi-backend/src/google-calendar-sync.ts)
- GOOGLE_CALENDAR_ID (strapi-backend/src/google-calendar-sync.ts)
- GOOGLE_CALENDAR_SYNC_CRON (strapi-backend/src/index.ts)
- MAILGUN_API_KEY (strapi-backend/src/api/theme-options/services/email.ts)
- MAILGUN_DEFAULT_FROM (strapi-backend/src/api/theme-options/services/email.ts)
- MAILGUN_DEFAULT_REPLY_TO (strapi-backend/src/api/theme-options/services/email.ts)
- MAILGUN_DOMAIN (strapi-backend/src/api/theme-options/services/email.ts)
- MAILGUN_URL (strapi-backend/src/api/theme-options/services/email.ts)
- NEXT_PUBLIC_STRAPI_URL (frontend/src/components/RichText.tsx)
- NODE_ENV (frontend/src/components/RichText.tsx)

Read .codesight/wiki/index.md for orientation (WHERE things live). Then read actual source files before implementing. Wiki articles are navigation aids, not implementation guides.
Read .codesight/CODESIGHT.md for the complete AI context map including all routes, schema, components, libraries, config, middleware, and dependency graph.
