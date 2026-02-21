# Theme

Central place for frontend theming. This directory holds design tokens (colors, typography) and page templates (layouts for CMS content).

## Structure

```
theme/
├── tokens.css      # Light/default design tokens
├── dark.css        # Dark mode overrides
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
| `tokens.css` | Light/default theme tokens (colors, etc.) |
| `dark.css` | Dark mode overrides (when user prefers dark) |
| `index.css` | Aggregates theme CSS imports |

## Design Tokens

Tokens are CSS variables used by Tailwind utilities and components:

| Token | Usage | Light | Dark |
|-------|--------|------|------|
| `--color-fg` | Text, foreground | `#1a1a1a` | `#f3f4f6` |
| `--color-bg` | Background | `#ffffff` | `#111827` |
| `--color-accent` | Primary actions, links | `#2563eb` | `#60a5fa` |
| `--color-accent-hover` | Hover state for accent | `#1d4ed8` | `#93c5fd` |
| `--color-muted` | Secondary text | `#4b5563` | `#9ca3af` |
| `--color-border` | Borders, dividers | `#e5e7eb` | `#374151` |
| `--color-utility-nav-bg` | Utility nav background | `#f9fafb` | `#1f2937` |

Tailwind utilities: `text-fg`, `bg-bg`, `bg-accent`, `text-accent`, `border-border`, `text-muted`, etc.

## Adding Tokens

1. Add the token to `tokens.css` (in the `@theme` block) for light mode.
2. Add the override to `dark.css` (inside the `:root` block) for dark mode.
3. Use the token in components via `var(--color-name)` or Tailwind utilities if mapped.

## Templates

The `templates/` folder contains React components for CMS-driven pages. App.tsx imports these from `./theme/templates`. To customize layouts:

1. Edit the template files directly (e.g. change structure, add sections, restyle).
2. Replace a template with your own – keep the same export name and props/data-fetching pattern.

Each template fetches its own data from Strapi and renders the layout. They use shared components (Breadcrumb, RichText, DocumentTitle, etc.) and theme tokens.

## Strapi Theme Options

Content-driven theming (e.g. logo, site name, breadcrumbs) comes from Strapi Theme Options, not this directory. See `ThemeContext` and `useThemeOptions()`.
