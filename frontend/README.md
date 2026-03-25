# Glyph CMS — Frontend

React 19 + TypeScript + Vite + Tailwind CSS 4 frontend for the Strapi-powered CMS.

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 19.2 | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 7.3 | Build tool + dev server |
| Tailwind CSS | 4.1 | Utility-first styling |
| Framer Motion | 12.x | Animations and transitions |
| Zod | 4.x | Runtime API response validation |
| React Router DOM | 7.x | Client-side routing |
| React Markdown | 10.x | Rich text rendering |

## Commands

```bash
npm run dev          # Start dev server on :5173 (proxies /api → localhost:1337)
npm run build        # Standard SPA build → dist/
npm run build:static # Build + prerender static HTML (Strapi must be running)
npm run preview      # Preview production build locally
```

## Environment Variables

Create `.env.local` (copy from `.env.example`):

```env
VITE_STRAPI_URL=http://localhost:1337   # Strapi base URL (omit in dev — proxy handles it)
```

In production, set `VITE_STRAPI_URL` to your deployed Strapi URL.

## Routes

| Path | Template | Description |
|------|----------|-------------|
| `/` | `HomePage` | Home page with dynamic block layout |
| `/blog` | `BlogList` | Blog listing with pagination and categories |
| `/blog/:slug` | `BlogPost` | Single blog post |
| `/press` | `PressList` | Press release listing |
| `/press/:slug` | `PressPost` | Single press release |
| `/events` | `EventCalendar` | Monthly calendar view |
| `/contact` | `ContactPage` | Contact form (Netlify Forms) |
| `/pages/:slug` | `PageTemplate` | Generic CMS-managed pages |
| `/embed/form/:slug` | `FormEmbedPage` | Embeddable form iframe (no layout) |

## Static Prerendering

`npm run build:static` prerenders these routes to static HTML:

- `/`, `/blog`, `/press`, `/events`, `/contact`

Strapi must be reachable during the build. Data is fetched by `scripts/prerender-fetch.mjs`, injected via `window.__PRELOADED__`, and consumed by `PreloadContext` — so prerendered pages make zero runtime API calls.

Dynamic routes (`/blog/:slug`, `/press/:slug`, `/pages/:slug`) are not prerendered and are served as SPA.

## Project Structure

```
src/
├── components/         # Shared UI components
│   ├── blocks/         # Page block renderers (BlockRenderer, DynamicBlock, etc.)
│   ├── Layout.tsx      # Main layout wrapper (nav, footer, alerts)
│   ├── FormEmbed.tsx   # Embeddable form component
│   └── ...
├── contexts/
│   ├── PreloadContext.tsx   # Build-time data injection
│   └── ThemeContext.tsx     # Site-wide theme options
├── lib/
│   ├── strapi.ts           # All Strapi API calls
│   └── strapi-schemas.ts   # Zod validation schemas
├── theme/
│   ├── tokens.css          # Design tokens (--color-fg, --color-accent, etc.)
│   ├── dark.css            # Dark mode overrides
│   └── templates/          # Page-level templates
├── types/
│   └── strapi.ts           # TypeScript interfaces for all Strapi types
└── utils/
    ├── classes.ts          # CSS class utilities
    └── format.ts           # Date/string formatters
```

## Design Tokens

Defined in `src/theme/tokens.css`, use via Tailwind utilities:

| Token | Tailwind Class | Light | Dark |
|-------|---------------|-------|------|
| `--color-fg` | `text-fg` | `#1a1a1a` | `#f3f4f6` |
| `--color-bg` | `bg-bg` | `#ffffff` | `#111827` |
| `--color-accent` | `text-accent` / `bg-accent` | `#2563eb` | `#60a5fa` |
| `--color-muted` | `text-muted` | `#4b5563` | `#9ca3af` |
| `--color-border` | `border-border` | `#e5e7eb` | `#374151` |

## Adding a New Page Block

1. Add the block schema in `strapi-backend/src/components/blocks/`
2. Add the TypeScript interface in `src/types/strapi.ts`
3. Add a Zod schema in `src/lib/strapi-schemas.ts` if needed
4. Create the React component in `src/components/blocks/`
5. Register it in `src/components/blocks/BlockRenderer.tsx`

## Google Calendar Sync

Events can be automatically pulled from a public Google Calendar. Set these in `strapi-backend/.env`:

```env
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
GOOGLE_CALENDAR_API_KEY=your-api-key
GOOGLE_CALENDAR_SYNC_CRON=0 * * * *   # default: every hour
```

Synced events appear in the Strapi Event collection alongside manually-created ones. To get a Google API key:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the **Google Calendar API**
3. Create an API key (restrict it to the Calendar API)

To get a calendar ID: open the calendar in Google Calendar → Settings → "Calendar ID" (looks like `xxx@group.calendar.google.com`). The calendar must be set to **public**.

Each synced event has a **Image** field in Strapi — upload one to permanently attach it to that event. The sync never overwrites a manually-set image.

## Strapi Permissions

In Strapi admin (Settings → Users & Permissions → Public), enable `find` and `findOne` for:

- Page, Blog Post, Blog Category, Event, Site Alert, Navigation, Theme Option, Press Release, Press Release Category, Form
