/**
 * Breadcrumb navigation. Renders only when showBreadcrumbs is enabled in Theme Options.
 */

import { Link } from 'react-router-dom';
import { useThemeOptions } from '../contexts/ThemeContext';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const themeOptions = useThemeOptions();
  if (themeOptions?.showBreadcrumbs === false) return null;
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
            <Link
              to={item.url}
              className="text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
            >
              {item.label}
            </Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
