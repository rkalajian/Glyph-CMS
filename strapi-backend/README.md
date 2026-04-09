# Glyph CMS — Strapi Backend

Strapi 5 headless CMS. See the [root README](../README.md) for full project setup.

## Dev

```bash
npm install
npm run develop   # http://localhost:1337/admin
```

## Build & Start (production)

```bash
npm run build
npm run start
```

## Environment Variables

Copy `.env.example` to `.env` and fill in values. See `.env.example` for all variables.

For production (Render), set env vars in the Render dashboard — `.env` files are not read in production.

## Database

Defaults to SQLite in dev. For production, set `DATABASE_CLIENT=postgres` and provide Neon (or any PostgreSQL) connection details.

## File Uploads

Defaults to local disk storage. For persistent uploads on Render (filesystem resets on redeploy), configure Cloudinary via `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`.

## After First Deploy

1. Visit `/admin` and create your admin user
2. Go to **Settings → Users & Permissions → Roles → Public**
3. Enable `find` and `findOne` for all content types the frontend needs
4. Create initial content in Content Manager
