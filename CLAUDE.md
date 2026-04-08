# Glyph CMS — Claude Code Guidelines

## Project Overview

Headless CMS with a **Strapi 5 backend** and **React 19 + TypeScript + Next.js 15 (App Router) + Tailwind CSS 4** frontend. Generates static HTML for all routes via `next build` (no Puppeteer), deploys to Netlify, supports Netlify Forms, WCAG 2.2 accessibility, and Lighthouse 90+ scores.

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
│   │   ├── press/, events/, contact/, pages/[slug]/  # Similar pattern
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
└── strapi-backend/    # Strapi 5 CMS (unchanged)
    └── src/
        ├── api/           # Content types (page, blog-post, event, form, etc.)
        └── components/blocks/  # 398 Tailgrids components
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

Environment variables (set in `.env.local` or Netlify):
- `NEXT_PUBLIC_STRAPI_URL=https://your-strapi-instance.com` (production Strapi URL; omit in dev to use Next.js proxy)

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

**Public permissions** must be enabled in Strapi admin (Settings → Users & Permissions → Public) for: Page, Blog Post, Blog Category, Event, Site Alert, Navigation, Theme Option, Press Release, Press Release Category, Form.

## Static Generation

`npm run build` generates static HTML for all routes:

- **Page routes** (server components in `app/*.tsx`) call Strapi API functions (`getPage`, `getBlogPosts`, etc.)
- **Dynamic routes** (e.g., `/blog/[slug]`) export `generateStaticParams()` which fetches all slugs from Strapi
- Next.js calls `generateStaticParams` once per build, creates `/blog/post-1/index.html`, `/blog/post-2/index.html`, etc.
- Strapi must be reachable during `npm run build`
- Output is fully static HTML in `frontend/out/` — no server needed (perfect for Netlify static hosting)
- To add new static routes: create `app/new-route/page.tsx` with `generateMetadata` and `generateStaticParams` (if dynamic)

## Google Calendar Sync

Events can be automatically imported from a public Google Calendar. Configure in `strapi-backend/.env`:

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
- `getPages()` — fetches all pages for `/pages/[slug]` static param generation
- `getForms()` — fetches all forms for `/embed/form/[slug]` static param generation

## Documentation Updates

**After any major change** (new content type, new route, new block, changed API, changed build process, changed env vars), update:
1. `frontend/README.md` — build commands, env vars, new route static param generation
2. Relevant inline comments in `strapi-backend/src/index.ts` bootstrap defaults
3. This `CLAUDE.md` if architectural conventions change
