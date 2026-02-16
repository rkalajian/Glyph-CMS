/**
 * Sets document title for WCAG 2.4.2 Page Titled
 * Format: "Page Title | siteName" when siteName is set in Theme Options
 */

import { useEffect } from 'react';
import { useThemeOptions } from '../contexts/ThemeContext';

export function DocumentTitle({ title }: { title?: string }) {
  const themeOptions = useThemeOptions();
  const siteName = (themeOptions?.siteName ?? '')?.trim() || '';

  useEffect(() => {
    const fullTitle = siteName
      ? (title ? `${title} | ${siteName}` : siteName)
      : (title || '');
    document.title = fullTitle;
    return () => {
      document.title = siteName || '';
    };
  }, [title, siteName]);
  return null;
}
