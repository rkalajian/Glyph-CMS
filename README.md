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

# Optional: Google Calendar sync
GOOGLE_CALENDAR_ID=...
GOOGLE_CALENDAR_API_KEY=...
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

### Content type URLs

| Content Type | URL |
|---|---|
| Page | `/pages/:slug` |
| Blog Post | `/blog` (list), `/blog/:slug` (post) |
| Press Release | `/press` (list), `/press/:slug` (post) |
| Event | `/events` (calendar month view) |
| Contact (Page slug = "contact") | `/contact` |

### Site Alert

Displays a banner at the top of every page when the current date is between `startDate` and `endDate`. Severity: `info`, `warning`, or `critical`.

### Navigation (single type)

Manages **Utility Nav** (top bar), **Primary Nav** (header), and **Footer Nav**. Edit in Content Manager → Navigation.

### Theme Option (single type)

Controls site name, logo, colors, and third-party script integrations (GTM, Marker.io).

## Google Calendar Sync

Events can be auto-imported from a public Google Calendar. Configure in `strapi-backend/.env`. The sync runs on Strapi startup and on the cron schedule.

- Events are matched by `googleCalendarEventId` — title, dates, description, location are always overwritten from Google
- The `image` field is **never overwritten** — upload one in Strapi to permanently attach it to a synced event
- Cancelled Google Calendar events are skipped; deleted events are not auto-removed from Strapi

## Accessibility (WCAG 2.2)

- Skip link to main content on every page
- Semantic HTML (`<main>`, `<nav>`, `<article>`, `<section>`)
- Touch targets ≥ 44×44px
- Text contrast ≥ 4.5:1
- All form fields have associated `<label>` elements
- Visible focus indicators throughout
