# Glyph CMS — Claude Code Guidelines

## Project Overview

Headless CMS with a **Strapi 5 backend** and **React 19 + TypeScript + Vite + Tailwind CSS 4** frontend. Supports static prerendering via Puppeteer for SEO, Netlify Forms, WCAG 2.2 accessibility, and Lighthouse 90+ scores.

## Repository Structure

```
cms/
├── frontend/          # React app (Vite, Tailwind, Framer Motion, Zod)
│   ├── src/
│   │   ├── components/    # Shared UI (Layout, blocks, forms)
│   │   ├── contexts/      # PreloadContext (static), ThemeContext
│   │   ├── lib/           # strapi.ts (API client), strapi-schemas.ts (Zod)
│   │   ├── theme/         # tokens.css, dark.css, templates/
│   │   ├── types/         # strapi.ts (628-line TypeScript interfaces)
│   │   └── utils/         # classes.ts, format.ts
│   └── scripts/           # prerender.mjs, prerender-fetch.mjs
└── strapi-backend/    # Strapi 5 CMS
    └── src/
        ├── api/           # Content types (page, blog-post, event, form, etc.)
        └── components/blocks/  # 25+ reusable page block schemas
```

## Dev Commands

```bash
# Root (concurrent dev)
npm run dev:backend      # Strapi on :1337
npm run dev:frontend     # Vite on :5173

# Frontend
npm run build            # Standard SPA build
npm run build:static     # Build + prerender static HTML (requires Strapi running)

# Backend
npm run build:strapi
```

## Code Standards

### TypeScript
- Prefer `interface` over `type` for object shapes
- Use Zod for **all** external API data (Strapi responses go through `parseStrapiResponse()`)
- All Strapi types live in `frontend/src/types/strapi.ts` — extend there, don't create parallel type files
- API calls go through `frontend/src/lib/strapi.ts` — add new endpoints there

### React / Components
- Kebab-case directories (`components/blocks/`), PascalCase component files (`BlockRenderer.tsx`)
- Code-split with `React.lazy` for non-critical routes (already done in `App.tsx`)
- No `useEffect` for data that controls initial layout — use `PreloadContext` or suspense
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

The frontend proxies `/api` → `localhost:1337` in dev. Set `VITE_STRAPI_URL` for production.

After any Strapi schema change, run `npm run build:strapi` and regenerate types if needed.

**Public permissions** must be enabled in Strapi admin (Settings → Users & Permissions → Public) for: Page, Blog Post, Blog Category, Event, Site Alert, Navigation, Theme Option, Press Release, Press Release Category, Form.

## Static Prerendering

`npm run build:static` prerenders: `/`, `/blog`, `/press`, `/events`, `/contact`

- `prerender-fetch.mjs` fetches data from Strapi at build time
- Data is injected via `window.__PRELOADED__` and consumed by `PreloadContext`
- `prerender.mjs` uses Puppeteer to render HTML — Strapi must be reachable during build

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

## Documentation Updates

**After any major change** (new content type, new route, new block, changed API, changed build process, changed env vars), update:
1. `frontend/README.md` — build commands, env vars, prerender routes
2. Relevant inline comments in `strapi-backend/src/index.ts` bootstrap defaults
3. This `CLAUDE.md` if architectural conventions change
