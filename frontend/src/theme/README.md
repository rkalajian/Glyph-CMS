# Theme

Central place for frontend theming. This directory holds design tokens (colors, typography) and page templates (layouts for CMS content).

## Structure

```
theme/
├── tokens.css      # Design tokens
├── index.css       # Aggregates CSS imports
├── README.md       # This file
└── templates/      # Page, post, and event templates
    ├── index.ts
    ├── HomePage.tsx      # Home page (/)
    ├── PageTemplate.tsx  # Generic CMS pages (/pages/:slug)
    ├── BlogList.tsx      # Blog listing (/blog)
    ├── BlogPost.tsx      # Single blog post (/blog/:slug)
    ├── PressList.tsx     # Press listing (/press)
    ├── PressPost.tsx     # Single press release (/press/:slug)
    ├── EventCalendar.tsx # Event calendar (/events)
    ├── ContactPage.tsx   # Contact page (/contact)
    ├── FormEmbedPage.tsx # Form embed iframe (/embed/form/:slug)
    └── NotFound.tsx      # 404 page (*)
```

## Design Tokens (CSS)

| File | Purpose |
|------|---------|
| `tokens.css` | Theme tokens (colors, etc.) |
| `index.css` | Aggregates theme CSS imports |

## Design Tokens

Tokens are CSS variables used by Tailwind utilities and components:

| Token | Usage | Value |
|-------|--------|-------|
| `--color-fg` | Text, foreground | `#1a1a1a` |
| `--color-bg` | Background | `#ffffff` |
| `--color-accent` | Primary actions, links | `#2563eb` |
| `--color-accent-hover` | Hover state for accent | `#1d4ed8` |
| `--color-muted` | Secondary text | `#4b5563` |
| `--color-border` | Borders, dividers | `#e5e7eb` |
| `--color-utility-nav-bg` | Utility nav background | `#f9fafb` |

Tailwind utilities: `text-fg`, `bg-bg`, `bg-accent`, `text-accent`, `border-border`, `text-muted`, etc.

## Adding Tokens

1. Add the token to `tokens.css` (in the `@theme` block).
2. Use the token in components via `var(--color-name)` or Tailwind utilities if mapped.

## Templates

The `templates/` folder contains React components for CMS-driven pages. App.tsx imports these from `./theme/templates`. To customize layouts:

1. Edit the template files directly (e.g. change structure, add sections, restyle).
2. Replace a template with your own – keep the same export name and props/data-fetching pattern.

Each template fetches its own data from Strapi and renders the layout. They use shared components (Breadcrumb, RichText, DocumentTitle, etc.) and theme tokens.

## Strapi Theme Options

Content-driven theming (e.g. logo, site name, breadcrumbs) comes from Strapi Theme Options, not this directory. See `ThemeContext` and `useThemeOptions()`.
