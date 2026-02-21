/**
 * Main layout with customizable navigation
 * WCAG 2.2: Skip link (2.4.1), consistent nav (3.2.3), focus visible (2.4.7)
 * Mobile: utility + primary nav combined in hamburger menu
 */

import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hasMobileNav = primaryNav.length > 0 || utilityNav.length > 0;

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [mobileMenuOpen]);

  return (
    <ThemeProvider value={themeOptions}>
      <ThemeScripts options={themeOptions} />
      <div className="min-h-screen flex flex-col">
        <SiteAlerts />

        <header className="border-b border-border bg-bg" role="banner">
          <div className="max-w-4xl mx-auto px-4">
            {/* Utility nav – desktop only */}
            {utilityNav.length > 0 && (
              <nav aria-label="Utility navigation" className="hidden md:flex justify-end py-2 -mx-4 px-4 bg-[var(--color-utility-nav-bg)]">
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
                  width={200}
                  height={32}
                  loading="eager"
                  className={`h-8 w-auto max-w-[200px] object-contain object-left ${
                    logoUrl === DEFAULT_LOGO ? 'site-logo' : ''
                  }`}
                />
              </Link>
              {/* Primary nav – desktop only */}
              <nav aria-label="Main navigation" className="hidden md:block">
                <ul className="flex gap-6 list-none m-0 p-0 flex-wrap">
                  {primaryNav.map((item) => (
                    <li key={item.documentId}>
                      <NavLink item={item} currentPath={location.pathname} variant="header" />
                    </li>
                  ))}
                </ul>
              </nav>
              {/* Hamburger button – mobile only */}
              {hasMobileNav && (
                <motion.button
                  type="button"
                  onClick={() => setMobileMenuOpen((o) => !o)}
                  className="md:hidden flex items-center justify-center w-12 h-12 -mr-2 rounded text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  whileHover={{ backgroundColor: 'var(--color-border)' }}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-nav"
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </motion.button>
              )}
            </div>
          </div>
        </header>

        {/* Mobile menu overlay + panel */}
        {hasMobileNav && (
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                id="mobile-nav"
                className="md:hidden fixed inset-0 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                aria-hidden={!mobileMenuOpen}
              >
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute inset-0 bg-black/50"
                  aria-label="Close menu"
                />
                <motion.aside
                  className="absolute top-0 right-0 w-full max-w-sm h-full bg-bg border-l border-border shadow-xl flex flex-col"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
                  aria-label="Mobile navigation"
                >
              <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                <span className="font-semibold text-fg">Menu</span>
                <motion.button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 -m-2 rounded text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  whileHover={{ backgroundColor: 'var(--color-border)' }}
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Site navigation">
                <ul className="flex flex-col gap-1 list-none m-0 p-0">
                  {utilityNav.map((item) => (
                    <li key={item.documentId}>
                      <NavLink item={item} currentPath={location.pathname} variant="footer" />
                    </li>
                  ))}
                  {utilityNav.length > 0 && primaryNav.length > 0 && (
                    <li className="border-t border-border my-3" aria-hidden />
                  )}
                  {primaryNav.map((item) => (
                    <li key={item.documentId}>
                      <NavLink item={item} currentPath={location.pathname} variant="footer" />
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.aside>
          </motion.div>
            )}
          </AnimatePresence>
        )}

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
