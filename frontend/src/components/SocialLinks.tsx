/**
 * Social links from Theme Options.
 * Uses Font Awesome 7 icons when provided, falls back to defaults.
 * WCAG 2.2: Accessible link labels (2.4.4), sufficient contrast.
 */

import type { StrapiThemeOptionSocial } from '../types/strapi';

interface SocialLinksProps {
  social: StrapiThemeOptionSocial | null | undefined;
  className?: string;
}

const PLATFORMS = [
  { key: 'facebook' as const, label: 'Facebook', defaultIcon: 'fa-brands fa-facebook' },
  { key: 'linkedin' as const, label: 'LinkedIn', defaultIcon: 'fa-brands fa-linkedin' },
  { key: 'x' as const, label: 'X', defaultIcon: 'fa-brands fa-x-twitter' },
  { key: 'tiktok' as const, label: 'TikTok', defaultIcon: 'fa-brands fa-tiktok' },
  { key: 'youtube' as const, label: 'YouTube', defaultIcon: 'fa-brands fa-youtube' },
  { key: 'instagram' as const, label: 'Instagram', defaultIcon: 'fa-brands fa-instagram' },
] as const;

function isValidUrl(s: string | null | undefined): boolean {
  if (!s?.trim()) return false;
  try {
    new URL(s.trim());
    return true;
  } catch {
    return false;
  }
}

export function SocialLinks({ social, className = '' }: SocialLinksProps) {
  if (!social) return null;

  const links = PLATFORMS.filter(({ key }) => {
    const url = social[`${key}Url` as keyof StrapiThemeOptionSocial] as string | undefined;
    return isValidUrl(url);
  }).map(({ key, label, defaultIcon }) => ({
    url: (social[`${key}Url` as keyof StrapiThemeOptionSocial] as string).trim(),
    label,
    icon: (social[`${key}Icon` as keyof StrapiThemeOptionSocial] as string)?.trim() || defaultIcon,
  }));

  if (links.length === 0) return null;

  return (
    <nav aria-label="Social media links" className={className}>
      <ul className="flex flex-wrap gap-3 list-none m-0 p-0">
        {links.map(({ url, label, icon }) => (
          <li key={label}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded px-1"
              aria-label={`${label} (opens in new tab)`}
            >
              <i className={`${icon} fa-fw text-[1.1rem]`} aria-hidden />
              <span className="sr-only">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
