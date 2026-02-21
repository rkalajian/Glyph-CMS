# Build scripts

## prerender.mjs

Generates static HTML for key routes at build time. Each route is loaded in a headless browser, and the rendered HTML is written to `dist/`.

**Usage:** `npm run build:static` (runs `npm run build` then the prerender script)

**Prerequisites:**
- Strapi must be running (or `VITE_STRAPI_URL` must point to a reachable API) so the app can fetch content during prerender

**Prerendered routes:** `/`, `/blog`, `/press`, `/events`, `/contact`

**Output:**
- `dist/index.html` – home
- `dist/blog/index.html` – blog listing
- `dist/press/index.html` – press listing
- `dist/events/index.html` – events
- `dist/contact/index.html` – contact page

Serving these static files (e.g. Netlify, Vercel) will return full HTML on first load instead of an empty shell, improving SEO and perceived performance.
