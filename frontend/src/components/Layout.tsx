/**
 * Main layout with customizable navigation
 * WCAG 2.2: Skip link (2.4.1), consistent nav (3.2.3), focus visible (2.4.7)
 */

import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { SiteAlerts } from './SiteAlerts';
import { NavLink } from './NavLink';
import { ThemeScripts } from './ThemeScripts';
import { SocialLinks } from './SocialLinks';
import { ThemeProvider } from '../contexts/ThemeContext';
import { getNavigation, getThemeOptions, getStrapiImageUrl } from '../lib/strapi';
import type { StrapiNavItem, StrapiThemeOptions } from '../types/strapi';

import defaultGlyphUrl from '../assets/glyph.svg?url';

/** Fallback logo when none is set in Theme Options. */
const DEFAULT_LOGO = defaultGlyphUrl;

/** Fallback when Strapi returns no items. */
const DEFAULT_PRIMARY_NAV: Pick<StrapiNavItem, 'documentId' | 'label' | 'url' | 'menu' | 'order' | 'openInNewTab'>[] = [
  { documentId: 'home', label: 'Home', url: '/', menu: 'primary', order: 0 },
  { documentId: 'blog', label: 'Blog', url: '/blog', menu: 'primary', order: 1 },
  { documentId: 'press', label: 'Press', url: '/press', menu: 'primary', order: 2 },
  { documentId: 'events', label: 'Events', url: '/events', menu: 'primary', order: 3 },
  { documentId: 'contact', label: 'Contact', url: '/contact', menu: 'primary', order: 4 },
];

const DEFAULT_FOOTER_NAV: Pick<StrapiNavItem, 'documentId' | 'label' | 'url' | 'menu' | 'order' | 'openInNewTab'>[] = [
  { documentId: 'footer-home', label: 'Home', url: '/', menu: 'footer', order: 0 },
  { documentId: 'footer-blog', label: 'Blog', url: '/blog', menu: 'footer', order: 1 },
  { documentId: 'footer-press', label: 'Press', url: '/press', menu: 'footer', order: 2 },
  { documentId: 'footer-events', label: 'Events', url: '/events', menu: 'footer', order: 3 },
  { documentId: 'footer-contact', label: 'Contact', url: '/contact', menu: 'footer', order: 4 },
];

export function Layout() {
  const location = useLocation();
  const [themeOptions, setThemeOptions] = useState<StrapiThemeOptions | null>(null);
  const [nav, setNav] = useState<{
    utilityNav: StrapiNavItem[];
    primaryNav: StrapiNavItem[];
    footerNav: StrapiNavItem[];
  } | null>(null);

  useEffect(() => {
    getNavigation()
      .then(setNav)
      .catch((err) => {
        if (import.meta.env.DEV) {
          console.warn('[Layout] Navigation fetch failed — using defaults. Is Strapi running?', err);
        }
        setNav(null);
      });
  }, []);

  useEffect(() => {
    getThemeOptions()
      .then(setThemeOptions)
      .catch(() => setThemeOptions(null));
  }, []);

  const primaryNav: StrapiNavItem[] = nav?.primaryNav?.length
    ? nav.primaryNav
    : (DEFAULT_PRIMARY_NAV as StrapiNavItem[]);
  const utilityNav: StrapiNavItem[] = nav?.utilityNav ?? [];
  const footerNav: StrapiNavItem[] = nav?.footerNav?.length
    ? nav.footerNav
    : (DEFAULT_FOOTER_NAV as StrapiNavItem[]);

  const logoUrl =
    getStrapiImageUrl(themeOptions?.logo) ?? DEFAULT_LOGO;

  return (
    <ThemeProvider value={themeOptions}>
      <ThemeScripts options={themeOptions} />
      <div className="min-h-screen flex flex-col">
        <SiteAlerts />

        <header className="border-b border-border bg-bg" role="banner">
          <div className="max-w-4xl mx-auto px-4">
            {utilityNav.length > 0 && (
              <nav aria-label="Utility navigation" className="flex justify-end py-2 -mx-4 px-4 bg-[var(--color-utility-nav-bg)]">
                <ul className="flex gap-4 list-none m-0 p-0 flex-wrap">
                  {utilityNav.map((item) => (
                    <li key={item.documentId}>
                      <NavLink item={item} currentPath={location.pathname} variant="header" />
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4">
              <Link
                to="/"
                className="flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
                aria-label="Go to home"
              >
                <img
                  src={logoUrl}
                  alt=""
                  className={`h-8 w-auto max-w-[200px] object-contain object-left ${
                    logoUrl === DEFAULT_LOGO ? 'site-logo' : ''
                  }`}
                />
              </Link>
              <nav aria-label="Main navigation">
                <ul className="flex gap-6 list-none m-0 p-0 flex-wrap">
                  {primaryNav.map((item) => (
                    <li key={item.documentId}>
                      <NavLink item={item} currentPath={location.pathname} variant="header" />
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1 max-w-4xl w-full mx-auto px-4 py-8" role="main" tabIndex={-1}>
          <Outlet />
        </main>

        <footer className="border-t border-border mt-auto" role="contentinfo">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <nav aria-label="Footer navigation" className="mb-4">
              <ul className="flex flex-wrap gap-4 list-none m-0 p-0">
                {footerNav.map((item) => (
                  <li key={item.documentId}>
                    <NavLink item={item} currentPath={location.pathname} variant="footer" />
                  </li>
                ))}
              </ul>
            </nav>
            <SocialLinks social={themeOptions?.social} className="mb-4" />
            <p className="text-sm text-muted">
              © {new Date().getFullYear()} RCK2. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
