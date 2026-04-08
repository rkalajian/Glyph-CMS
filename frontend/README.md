# Glyph CMS — Frontend

React 19 + TypeScript + Next.js 15 (App Router) + Tailwind CSS 4 frontend for the Strapi-powered CMS. Generates fully static HTML at build time with `next build`.

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 19.2 | UI framework |
| Next.js | 15.x | App Router, static generation |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.1 | Utility-first styling |
| Framer Motion | 12.x | Animations and transitions |
| Zod | 4.x | Runtime API response validation |
| React Markdown | 10.x | Rich text rendering |

## Commands

```bash
npm run dev          # Start dev server on :3000 (proxies /api → localhost:1337)
npm run build        # Build and prerender all static routes to out/
npm run prebuild     # Generate component registry (runs automatically before build)
```

## Environment Variables

Create `.env.local` (copy from `.env.example`):

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337   # Strapi base URL (omit in dev — proxy handles it)
```

In production, set `NEXT_PUBLIC_STRAPI_URL` to your deployed Strapi URL.

## Routes

All routes are **fully static** and prerendered at build time via `generateStaticParams`:

| Path | Data Fetched | Description |
|------|--------------|-------------|
| `/` | Home page | Dynamic block layout |
| `/blog` | Category filter (client-side) | Blog listing with pagination |
| `/blog/:slug` | Blog post by slug | Single blog post (all slugs prerendered) |
| `/press` | Category filter (client-side) | Press release listing |
| `/press/:slug` | Press release by slug | Single press release (all slugs prerendered) |
| `/events` | Events + calendar page | Monthly calendar view |
| `/contact` | Contact page | Contact form (Netlify Forms) |
| `/pages/:slug` | CMS page by slug | Generic CMS-managed pages (all slugs prerendered) |
| `/embed/form/:slug` | Form by slug | Embeddable form iframe (all slugs prerendered) |

## Static Generation

`npm run build` performs these steps:

1. **Generate component registry**: `scripts/generate-registry.mjs` creates import paths for 398 Tailgrids components
2. **Fetch data**: Each page calls Strapi API functions at build time (`getPage()`, `getBlogPosts()`, etc.)
3. **Render & export**: Next.js generates `/index.html`, `/blog/index.html`, `/blog/post-slug/index.html`, etc. to `out/`
4. **Result**: Fully static site — zero server runtime needed

Strapi **must be reachable** at build time. In dev, the Next.js proxy (`:3000`) forwards `/api/*` to Strapi.

## Project Structure

```
app/                           # Next.js App Router
├── layout.tsx                 # Root layout (server component, fetches nav/theme)
├── page.tsx                   # Home page
├── blog/[slug]/page.tsx       # Blog post (generateStaticParams for all posts)
├── blog/page.tsx              # Blog listing (client filter for categories)
├── press/, events/, contact/  # Similar routes
├── pages/[slug]/page.tsx      # CMS pages (all slugs prerendered)
├── embed/form/[slug]/page.tsx # Form embed (all forms prerendered)
└── globals.css                # Global styles + Tailwind imports

src/
├── components/                # Shared UI components
│   ├── blocks/                # Page block renderers (BlockRenderer, DynamicBlock, etc.)
│   ├── NavLink.tsx            # Navigation links with active state ("use client")
│   ├── Breadcrumb.tsx         # Breadcrumb navigation ("use client")
│   ├── Pagination.tsx         # Pagination controls ("use client")
│   ├── MobileMenu.tsx         # Mobile hamburger menu ("use client")
│   └── FormEmbed.tsx          # Embeddable form component ("use client")
├── lib/
│   ├── strapi.ts              # All Strapi API calls (env vars: NEXT_PUBLIC_STRAPI_URL)
│   ├── strapi-schemas.ts      # Zod validation schemas
│   └── metadata.ts            # buildPageMetadata() helper for generateMetadata
├── theme/
│   ├── tokens.css             # Design tokens (--color-fg, --color-accent, etc.)
│   ├── dark.css               # Dark mode overrides
│   ├── index.css              # Base styles (imported in globals.css)
│   └── templates/             # Page-level template components (Server + Client)
├── types/
│   └── strapi.ts              # TypeScript interfaces for all Strapi types
└── utils/
    ├── classes.ts             # CSS class utilities
    └── format.ts              # Date/string formatters

public/                        # Static assets
└── glyph.svg                  # Logo

scripts/
└── generate-registry.mjs      # Build-time script to generate component imports
```

## Server vs. Client Components

- **Server components** (default in `app/`): Fetch data with `await`, export `generateMetadata()` and `generateStaticParams()`, pass props to client components
- **Client components** (marked `"use client"`): State, effects, browser APIs, interact with Strapi data

Example:
```tsx
// app/blog/[slug]/page.tsx — server component
export async function generateStaticParams() {
  const posts = await getBlogPosts({ pageSize: 100 });
  return posts.map(p => ({ slug: p.slug }));
}

export default async function Page({ params }) {
  const post = await getBlogPost(params.slug); // Fetch at build time
  return <BlogPost post={post} />; // Pass data to client component
}

// src/theme/templates/BlogPost.tsx — client component
"use client";
export function BlogPost({ post }) {
  const [viewDate, setViewDate] = useState(new Date());
  // Interactive state here
}
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

## Component Registry

Tailgrids components (398 dirs in `../components/`) are registered at build time:

- `scripts/generate-registry.mjs` scans `../components/` and generates `src/components/component-registry.generated.ts`
- `src/components/ComponentRegistry.tsx` exports lazy loaders for each component
- `DynamicBlock.tsx` uses the registry to render blocks dynamically

## Adding a New Page Block

1. Add the block schema in `strapi-backend/src/components/blocks/`
2. Add the TypeScript interface in `src/types/strapi.ts`
3. Create the React component in `../components/` (Tailgrids format)
4. Component is automatically registered at build time

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

## Deployment

The build generates a fully static site in the `out/` directory:

```bash
npm run build
# out/ contains all HTML, CSS, JS — ready to deploy to Netlify, GitHub Pages, S3, etc.
```

**Netlify**: `netlify.toml` is already configured to deploy `frontend/out/`.
