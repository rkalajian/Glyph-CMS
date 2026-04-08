'use client';

/**
 * Breadcrumb navigation. Renders only when showBreadcrumbs is enabled.
 */

import { motion } from 'framer-motion';
import Link from 'next/link';

const MotionLink = motion(Link);

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showBreadcrumbs?: boolean;
  className?: string;
}

export function Breadcrumb({ items, showBreadcrumbs = true, className = '' }: BreadcrumbProps) {
  if (showBreadcrumbs === false) return null;
  if (!items.length) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-sm text-muted mb-4 flex flex-wrap items-center gap-1 ${className}`}
    >
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden="true">/</span>}
          {item.url ? (
            <MotionLink
              href={item.url}
              className="text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
              whileHover={{ textDecoration: 'underline' }}
              whileTap={{ scale: 0.98 }}
            >
              {item.label}
            </MotionLink>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
