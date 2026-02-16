# Glyph-CMS

A simple, templatable CMS with Strapi 5 backend and React/TypeScript/Tailwind frontend. Built with accessibility (WCAG 2.2) and Netlify Forms support.

## Structure

```
cms/
├── strapi-backend/   # Strapi 5 headless CMS
└── frontend/        # React + Vite + Tailwind frontend
```

## Quick Start

### 1. Strapi Backend

```bash
cd strapi-backend
npm run develop
```

- Open http://localhost:1337/admin
- Create your first admin user
- In **Settings → Users & Permissions → Roles → Public**:
  - Enable `find` and `findOne` for **Page**, **Blog Post**, **Blog Category**, **Event**, **Site Alert**, **Navigation**, and **Theme Option**
- Create content in **Content Manager**

### 2. Frontend

```bash
cd frontend
cp .env.example .env   # optional, defaults to localhost:1337
npm run dev
```

- Open http://localhost:5173

### 3. Netlify Forms (optional)

1. Deploy frontend to Netlify
2. Enable **Form detection** in Netlify dashboard: Forms → Enable form detection
3. Redeploy; the contact form will submit to Netlify Forms

## Content Types

### Page

- `title` (required)
- `slug` (required, UID from title)
- `content` (richtext)
- `seoTitle`, `seoDescription`

**URL:** `/pages/:slug`

### Blog Post

- `title` (required)
- `slug` (required, UID from title)
- `excerpt`
- `content` (richtext, required)
- `coverImage` (media)
- `publishedAt`
- `seoTitle`, `seoDescription`

**URLs:** `/blog` (list), `/blog/:slug` (single)

### Blog Category

- `name` (required)
- `slug` (required, UID from name)
- Relation: many-to-many with Blog Post

Create categories, then assign them to posts in the Blog Post editor. Filter posts by category at `/blog?category=:slug`.

### Event

- `title` (required)
- `slug` (required, UID from title)
- `startDate` (datetime, required)
- `endDate` (datetime)
- `allDay` (boolean)
- `description` (richtext)
- `location`

**URL:** `/events` (calendar month view)

### Site Alert

- `message` (required)
- `startDate` (datetime, required)
- `endDate` (datetime)
- `severity` (info | warning | critical)
- `linkUrl`, `linkLabel` (optional CTA)

Alerts display in a banner when the current date is between start and end. Shown at the top of every page.

### Navigation (single type)

- **Utility Nav** – links above the main header (right-aligned)
- **Primary Nav** – main header links
- **Footer Nav** – footer links

Edit in **Content Manager → Navigation**. Add nav links to each section. With no items, default primary/footer nav is used. Ensure **Strapi is running** when developing (`cd strapi-backend && npm run develop`) so the frontend can fetch navigation.

## Accessibility (WCAG 2.2)

- **2.4.1** Skip link to main content
- **2.4.2** Page titles
- **2.4.3** Logical focus order
- **2.4.7** Visible focus indicators
- **3.2.3** Consistent navigation
- **3.3.1** Error identification on forms
- **3.3.2** Labels and instructions
- **2.5.8** Minimum 24×24px touch targets
- **4.1.2** Name, role, value for UI components

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_STRAPI_URL` | Strapi API base URL (frontend) |

## Routing

- **404:** Unmatched paths render a Not Found page
- **SPA fallback:** Netlify and Vercel configs serve `index.html` for all routes so client-side routing works

## Deployment

- **Strapi:** Deploy to a Node.js host (Railway, Render, Strapi Cloud)
- **Frontend:** Deploy to Netlify or Vercel (see `netlify.toml` / `vercel.json`)
- Set `VITE_STRAPI_URL` to your Strapi URL in the frontend build
