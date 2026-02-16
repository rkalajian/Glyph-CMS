/**
 * Provides theme options (site name, logo, etc.) from Strapi to the component tree.
 */

import { createContext, useContext } from 'react';
import type { StrapiThemeOptions } from '../types/strapi';

const ThemeContext = createContext<StrapiThemeOptions | null>(null);

export const ThemeProvider = ThemeContext.Provider;

export function useThemeOptions(): StrapiThemeOptions | null {
  return useContext(ThemeContext);
}
