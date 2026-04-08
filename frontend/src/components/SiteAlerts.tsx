'use client';

/**
 * Site alerts banner – scheduled start/end, displayed at top of layout
 * WCAG 2.2: role="alert", aria-live for screen reader announcements
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const MotionLink = motion(Link);
import type { StrapiSiteAlert } from '../types/strapi';

const severityStyles: Record<string, string> = {
  info: 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800',
  warning: 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100 border-amber-200 dark:border-amber-800',
  critical: 'bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-100 border-red-200 dark:border-red-800',
};

interface SiteAlertsProps {
  initialAlerts?: StrapiSiteAlert[];
}

export function SiteAlerts({ initialAlerts = [] }: SiteAlertsProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set());

  const dismiss = (documentId: string) => {
    setDismissed((prev) => new Set(prev).add(documentId));
  };

  const visibleAlerts = initialAlerts.filter((a) => !dismissed.has(a.documentId));

  if (visibleAlerts.length === 0) return null;

  return (
    <div
      className="border-b"
      role="region"
      aria-label="Site alerts"
    >
      <ul className="list-none m-0 p-0" aria-live="polite">
        {visibleAlerts.map((alert) => {
          const severity = alert.severity ?? 'info';
          const style = severityStyles[severity] ?? severityStyles.info;

          return (
            <li key={alert.documentId}>
              <div
                role="alert"
                className={`px-4 py-3 border-b last:border-b-0 ${style}`}
              >
                <div className="max-w-4xl mx-auto flex flex-wrap items-center gap-2">
                  <span className="flex-1 min-w-0">{alert.message}</span>
                  {alert.linkUrl && (
                    alert.linkUrl.startsWith('http') ? (
                      <motion.a
                        href={alert.linkUrl}
                        className="shrink-0 font-semibold underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded min-h-[44px] min-w-[44px] inline-flex items-center"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={alert.linkLabel ? `${alert.linkLabel} (opens in new window)` : 'Learn more (opens in new window)'}
                        whileHover={{ textDecoration: 'none' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {alert.linkLabel ?? 'Learn more'}
                      </motion.a>
                    ) : (
                      <MotionLink
                        href={alert.linkUrl.startsWith('/') ? alert.linkUrl : `/${alert.linkUrl}`}
                        className="shrink-0 font-semibold underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded min-h-[44px] min-w-[44px] inline-flex items-center"
                        aria-label={alert.linkLabel ?? 'Learn more'}
                        whileHover={{ textDecoration: 'none' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {alert.linkLabel ?? 'Learn more'}
                      </MotionLink>
                    )
                  )}
                  <motion.button
                    type="button"
                    onClick={() => dismiss(alert.documentId)}
                    className="shrink-0 p-2 -m-2 rounded text-xl leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
                    aria-label="Dismiss alert"
                    whileHover={{ opacity: 0.8 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span aria-hidden>×</span>
                  </motion.button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
