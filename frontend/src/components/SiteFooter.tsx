/**
 * Site footer. When Footer Options (single type) has content, renders the rich
 * footer: contact info, nav columns, newsletter signup, partner logos, legal
 * text, copyright. Falls back to the simple branding + footer-nav layout.
 * WCAG 2.2: semantic nav landmarks, labeled form fields, 44px touch targets.
 */

import Link from 'next/link';
import { getStrapiImageUrl } from '../lib/strapi';
import type {
  StrapiFooterOptions,
  StrapiFooterColumn,
  StrapiFooterLink,
  StrapiNavItem,
  StrapiThemeOptions,
} from '../types/strapi';
import { NavLink } from './NavLink';
import { SocialLinks } from './SocialLinks';
import { NewsletterForm } from './NewsletterForm';
import { CookieSettingsButton } from './CookieSettingsButton';

function footerHref(item: StrapiFooterLink | StrapiFooterColumn): string | null {
  if (item.url?.trim()) return item.url;
  if (item.page?.slug) return `/pages/${item.page.slug}`;
  return null;
}

function FooterAnchor({
  href,
  openInNewTab,
  children,
  className,
}: {
  href: string;
  openInNewTab?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const external = href.startsWith('http://') || href.startsWith('https://');
  if (external || openInNewTab) {
    return (
      <a
        href={href}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

interface SiteFooterProps {
  footerOptions: StrapiFooterOptions | null;
  themeOptions: StrapiThemeOptions | null;
  footerNav: StrapiNavItem[];
  logo: string | null;
  siteName: string;
}

export function SiteFooter({ footerOptions, themeOptions, footerNav, logo, siteName }: SiteFooterProps) {
  const fo = footerOptions;
  const footerLogo = fo?.footerLogo ? getStrapiImageUrl(fo.footerLogo) : logo;
  const social = fo?.social ?? themeOptions?.social ?? null;
  const copyright =
    fo?.copyrightText?.trim() || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;
  const linkClasses =
    'text-sm text-muted hover:text-fg underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded inline-flex min-h-[24px] items-center';
  const showNewsletter = fo?.newsletterProvider && fo.newsletterProvider !== 'none' && fo.newsletterActionUrl;
  const hasContact = fo?.siteHours || fo?.phone || fo?.email || fo?.address;

  return (
    <footer className="bg-bg border-t border-border mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Branding + contact */}
          <div>
            {footerLogo && (
              <img src={footerLogo} alt={siteName} width={40} height={40} className="h-10 w-auto mb-2" />
            )}
            <p className="text-sm text-muted">{siteName}</p>
            {hasContact && (
              <address className="not-italic mt-4 space-y-1 text-sm text-muted">
                {fo?.siteHours && <p>{fo.siteHours}</p>}
                {fo?.phone && (
                  <p>
                    <a href={`tel:${fo.phone.replace(/[^+\d]/g, '')}`} className={linkClasses}>
                      {fo.phone}
                    </a>
                  </p>
                )}
                {fo?.email && (
                  <p>
                    <a href={`mailto:${fo.email}`} className={linkClasses}>
                      {fo.email}
                    </a>
                  </p>
                )}
                {fo?.address && <p className="whitespace-pre-line">{fo.address}</p>}
              </address>
            )}
            {social && (
              <div className="mt-4">
                <SocialLinks social={social} />
              </div>
            )}
          </div>

          {/* Footer Options columns */}
          {(fo?.footerColumns ?? []).map((col, i) => {
            const colHref = footerHref(col);
            return (
              <nav key={col.id ?? i} aria-label={col.title}>
                <h3 className="font-semibold mb-3 text-sm">
                  {colHref ? (
                    <FooterAnchor href={colHref} openInNewTab={col.openInNewTab} className="hover:underline">
                      {col.title}
                    </FooterAnchor>
                  ) : (
                    col.title
                  )}
                </h3>
                {col.links && col.links.length > 0 && (
                  <ul className="space-y-2 list-none m-0 p-0">
                    {col.links.map((link, j) => {
                      const href = footerHref(link);
                      if (!href) return null;
                      return (
                        <li key={j}>
                          <FooterAnchor href={href} openInNewTab={link.openInNewTab} className={linkClasses}>
                            {link.label}
                          </FooterAnchor>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </nav>
            );
          })}

          {/* Legacy footer nav (Navigation single type) */}
          {(!fo?.footerColumns || fo.footerColumns.length === 0) && footerNav.length > 0 && (
            <nav aria-label="Footer navigation">
              <h3 className="font-semibold mb-3 text-sm">Links</h3>
              <ul className="space-y-2 list-none m-0 p-0">
                {footerNav.map((item) => (
                  <li key={item.documentId}>
                    <NavLink item={item} variant="footer" />
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Newsletter */}
          {showNewsletter && (
            <div>
              <h3 className="font-semibold mb-3 text-sm">{fo?.newsletterHeading || 'Newsletter'}</h3>
              {fo?.newsletterDescription && (
                <p className="text-sm text-muted mb-3">{fo.newsletterDescription}</p>
              )}
              <NewsletterForm provider={fo?.newsletterProvider} actionUrl={fo?.newsletterActionUrl} />
              {fo?.footerLegalText && (
                <div className="mt-3 space-y-2 text-xs text-muted">
                  {fo.footerLegalText.split(/\n\s*\n/).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Partner logos */}
        {fo?.partnerLogos && fo.partnerLogos.length > 0 && (
          <ul className="flex flex-wrap items-center gap-6 mb-8 list-none m-0 p-0" aria-label="Partners">
            {fo.partnerLogos.map((p, i) => {
              const src = getStrapiImageUrl(p.image);
              if (!src) return null;
              const img = (
                <img
                  src={src}
                  alt={p.altText || p.image?.alternativeText || ''}
                  width={p.image?.width ?? 120}
                  height={p.image?.height ?? 48}
                  className="h-12 w-auto"
                  loading="lazy"
                />
              );
              return (
                <li key={p.id ?? i}>
                  {p.linkUrl ? (
                    <a href={p.linkUrl} target="_blank" rel="noopener noreferrer" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
                      {img}
                    </a>
                  ) : (
                    img
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Copyright */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <p>{copyright}</p>
          <CookieSettingsButton />
        </div>
      </div>
    </footer>
  );
}
