'use client';

/**
 * Renders a nav link - internal (Link) or external (a).
 * When item has subnav, renders a dropdown; otherwise a simple link.
 */

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

import type { StrapiNavItem } from '../types/strapi';

const MotionLink = motion(Link);

const linkClass = (isActive: boolean) =>
  `py-2 text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded min-h-[44px] min-w-[44px] inline-flex items-center justify-center ${
    isActive ? 'font-semibold underline underline-offset-4' : ''
  }`;

function getHref(url: string): string {
  if (url.startsWith('http') || url.startsWith('//')) return url;
  return url.startsWith('/') ? url : `/${url}`;
}

function isInternal(url: string): boolean {
  return !url.startsWith('http') && !url.startsWith('//');
}

interface NavLinkProps {
  item: Pick<StrapiNavItem, 'documentId' | 'label' | 'url' | 'openInNewTab' | 'subnav'>;
  variant?: 'header' | 'footer';
}

/** Renders a single link (no dropdown) */
function NavLinkSimple({
  item,
  currentPath,
}: {
  item: Pick<StrapiNavItem, 'label' | 'url' | 'openInNewTab'>;
  currentPath?: string;
}) {
  const pathname = usePathname();
  const activePath = currentPath ?? pathname;
  const href = getHref(item.url);
  const active = isInternal(item.url)
    ? activePath === href || (href !== '/' && activePath.startsWith(href))
    : false;

  if (item.openInNewTab || !isInternal(item.url)) {
    return (
      <motion.a
        href={href}
        className={linkClass(false)}
        target={item.openInNewTab ? '_blank' : undefined}
        rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
        aria-label={item.openInNewTab ? `${item.label} (opens in new window)` : item.label}
        whileHover={{ color: 'var(--color-accent)' }}
        whileTap={{ scale: 0.98 }}
      >
        {item.label}
      </motion.a>
    );
  }

  return (
    <MotionLink href={href} className={linkClass(active)} whileHover={{ color: 'var(--color-accent)' }} whileTap={{ scale: 0.98 }}>
      {item.label}
    </MotionLink>
  );
}

export function NavLink({ item, variant = 'header' }: NavLinkProps) {
  const hasSubnav = item.subnav && item.subnav.length > 0;
  const [open, setOpen] = useState(false);
  const currentPath = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [open]);

  useEffect(() => () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
  }, []);

  if (!hasSubnav) {
    return <NavLinkSimple item={item} currentPath={currentPath} />;
  }

  // Dropdown (header) or nested list (footer)
  if (variant === 'footer') {
    return (
      <span className="inline-flex flex-col gap-1">
        <NavLinkSimple item={item} currentPath={currentPath} />
        <ul className="list-none m-0 p-0 ml-4 flex flex-col gap-1">
          {item.subnav!.map((sub) => (
            <li key={sub.documentId}>
              <NavLinkSimple item={sub} currentPath={currentPath} />
            </li>
          ))}
        </ul>
      </span>
    );
  }

  // Header dropdown: hover + click for mobile
  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        className={`${linkClass(false)} bg-transparent border-0 cursor-pointer font-inherit`}
        whileHover={{ color: 'var(--color-accent)' }}
        whileTap={{ scale: 0.98 }}
      >
        {item.label}
        <span
          className="ml-1 inline-block w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-current align-middle"
          aria-hidden
        />
      </motion.button>
      {open && (
        <ul
          className="absolute left-0 top-full -mt-1 min-w-[180px] py-2 bg-bg border border-border rounded shadow-lg list-none m-0 z-10"
          role="menu"
        >
          <li role="none">
            <MotionLink
              href={getHref(item.url)}
              className="block px-4 py-2 text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset rounded mx-2"
              role="menuitem"
              onClick={() => setOpen(false)}
              whileHover={{ backgroundColor: 'var(--color-border)' }}
              whileTap={{ scale: 0.98 }}
            >
              {item.label}
            </MotionLink>
          </li>
          {item.subnav!.map((sub) => (
            <li key={sub.documentId} role="none">
              {sub.openInNewTab || !isInternal(sub.url) ? (
                <motion.a
                  href={getHref(sub.url)}
                  className="block px-4 py-2 text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset rounded mx-2"
                  role="menuitem"
                  target={sub.openInNewTab ? '_blank' : undefined}
                  rel={sub.openInNewTab ? 'noopener noreferrer' : undefined}
                  onClick={() => setOpen(false)}
                  whileHover={{ backgroundColor: 'var(--color-border)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {sub.label}
                </motion.a>
              ) : (
                <MotionLink
                  href={getHref(sub.url)}
                  className="block px-4 py-2 text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset rounded mx-2"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  whileHover={{ backgroundColor: 'var(--color-border)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {sub.label}
                </MotionLink>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
