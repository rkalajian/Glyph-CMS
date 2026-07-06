/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from 'next';
import { getNavigation, getThemeOptions, getSiteAlerts, getHeaderOptions, getFooterOptions, getStrapiImageUrl } from '@/lib/strapi';
import '../src/theme/index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './globals.css';
import { NavLink } from '@/components/NavLink';
import { MobileMenu } from '@/components/MobileMenu';
import { ThemeScripts } from '@/components/ThemeScripts';
import { SiteAlerts } from '@/components/SiteAlerts';
import { SocialLinks } from '@/components/SocialLinks';
import { SiteFooter } from '@/components/SiteFooter';
import { CookieConsentProvider } from '@/components/CookieConsentProvider';
import { CookieConsentBanner } from '@/components/CookieConsentBanner';
import Link from 'next/link';
import type { StrapiNavItem } from '@/types/strapi';

export const metadata: Metadata = {
  title: 'Site',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [nav, themeOptions, alerts, headerOptions, footerOptions] = await Promise.all([
    getNavigation(),
    getThemeOptions(),
    getSiteAlerts(),
    getHeaderOptions(),
    getFooterOptions(),
  ]);

  const headerLogo = headerOptions?.logo ? getStrapiImageUrl(headerOptions.logo) : null;
  const logo = headerLogo ?? (themeOptions?.logo ? getStrapiImageUrl(themeOptions.logo) : '/glyph.svg');
  const ctaUrl = headerOptions?.ctaUrl?.trim() || null;
  const ctaLabel = headerOptions?.ctaLabel?.trim() || 'Get Started';
  const favicon = themeOptions?.favicon ? getStrapiImageUrl(themeOptions.favicon) : null;
  const siteName = themeOptions?.siteName || 'Glyph';

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {favicon && <link rel="icon" href={favicon} />}
      </head>
      <body>
        <CookieConsentProvider>
        <ThemeScripts options={themeOptions} />
        <SiteAlerts initialAlerts={alerts} />

        {/* Skip link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-0 focus:left-0 focus:p-4 focus:bg-accent focus:text-white"
        >
          Skip to main content
        </a>

        {/* Header & Navigation */}
        <header className="bg-bg border-b border-border sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Utility Nav (desktop) */}
            {nav.utilityNav && nav.utilityNav.length > 0 && (
              <nav
                aria-label="Utility navigation"
                className="hidden sm:flex items-center justify-end gap-4 py-2 text-sm border-b border-border"
              >
                {nav.utilityNav.map((item: StrapiNavItem) => (
                  <NavLink key={item.documentId} item={item} />
                ))}
              </nav>
            )}

            {/* Main Header */}
            <div className="flex items-center justify-between py-4">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
                {logo && (
                  <img
                    src={logo}
                    alt={siteName}
                    width={40}
                    height={40}
                    className="h-10 w-auto"
                  />
                )}
                {!logo && <span className="font-semibold text-lg">{siteName}</span>}
              </Link>

              {/* Desktop Nav */}
              <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
                {nav.primaryNav && nav.primaryNav.map((item: StrapiNavItem) => (
                  <NavLink key={item.documentId} item={item} />
                ))}
              </nav>

              {/* Mobile Menu Toggle & Desktop Right */}
              <div className="flex items-center gap-4">
                <div className="hidden md:block">
                  {themeOptions?.social && (
                    <SocialLinks social={themeOptions.social} />
                  )}
                </div>
                {ctaUrl && (
                  <Link
                    href={ctaUrl}
                    className="hidden md:inline-flex items-center bg-accent text-white font-medium text-sm px-4 min-h-[44px] rounded hover:bg-accent-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  >
                    {ctaLabel}
                  </Link>
                )}
                <MobileMenu
                  primaryNav={nav.primaryNav || []}
                  utilityNav={nav.utilityNav || []}
                  logo={logo || '/glyph.svg'}
                  siteName={siteName}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main id="main-content" className="flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <SiteFooter
          footerOptions={footerOptions}
          themeOptions={themeOptions}
          footerNav={nav.footerNav || []}
          logo={logo}
          siteName={siteName}
        />
        <CookieConsentBanner />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
