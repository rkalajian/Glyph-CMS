import type { StrapiApp } from '@strapi/strapi/admin';

// @ts-expect-error – SVG import
import Logo from './extensions/glyph.svg';
import { FormAttachPanel } from './extensions/FormAttachPanel';
import './extensions/custom-button-styles.css';

// -----------------------------------------------------------------------------
// Theme colors
// -----------------------------------------------------------------------------
// Dark: black backgrounds, white text. Light: white backgrounds, black text.
const darkTheme = {
  colors: {
    neutral0: '#0a0a0a',
    neutral100: '#111111',
    neutral150: '#1a1a1a',
    neutral200: '#262626',
    neutral300: '#404040',
    neutral400: '#525252',
    neutral500: '#737373',
    neutral600: '#a3a3a3',
    neutral700: '#d4d4d4',
    neutral800: '#e5e5e5',
    neutral900: '#f5f5f5',
    neutral1000: '#ffffff',
    primary100: '#404040',
    primary200: '#737373',
    primary500: '#e5e5e5',
    primary600: '#ffffff',
    primary700: '#ffffff',
    buttonPrimary500: '#0a0a0a',
    buttonPrimary600: '#0a0a0a',
    buttonNeutral0: '#ffffff',
  },
};

const lightTheme = {
  colors: {
    neutral0: '#ffffff',
    neutral100: '#fafafa',
    neutral150: '#f5f5f5',
    neutral200: '#e5e5e5',
    neutral300: '#d4d4d4',
    neutral400: '#a3a3a3',
    neutral500: '#737373',
    neutral600: '#525252',
    neutral700: '#404040',
    neutral800: '#262626',
    neutral900: '#171717',
    neutral1000: '#0a0a0a',
    primary100: '#f5f5f5',
    primary200: '#e5e5e5',
    primary500: '#404040',
    primary600: '#171717',
    primary700: '#0a0a0a',
    buttonPrimary500: '#0a0a0a',
    buttonPrimary600: '#0a0a0a',
    buttonNeutral0: '#ffffff',
  },
};

// -----------------------------------------------------------------------------
// Admin config
// -----------------------------------------------------------------------------

export default {
  config: {
    auth: {
      logo: Logo,
    },
    menu: {
      logo: Logo,
    },
    theme: {
      light: lightTheme,
      dark: darkTheme,
    },
    locales: [],
    translations: {
      en: {
        'Auth.form.welcome.title': 'Welcome to Glyph!',
        'Auth.form.welcome.subtitle': 'Log in to your account',
      },
    },
  },
  bootstrap(app: StrapiApp) {
    const cmPlugin = app.getPlugin('content-manager');
    if (cmPlugin?.apis) {
      const apis = cmPlugin.apis as { addEditViewSidePanel: (panels: unknown[]) => void };
      apis.addEditViewSidePanel([FormAttachPanel]);
    }

    if (typeof document !== 'undefined') {
      document.body.classList.add('custom-admin-buttons');
      document.title = 'Glyph Admin';
      const isThemeOptionsPage = () =>
        window.location.pathname.includes('api::theme-options.theme-option');

      const formatThemeOptionsTitle = () => {
        if (!isThemeOptionsPage()) return;
        const [pagePart, ...rest] = document.title.split(/\s*\|\s*/);
        const adminPart = rest.join(' | ').trim();
        if (pagePart === 'Theme Options' || pagePart.endsWith(' Theme Options')) return;
        const suffix = adminPart ? ` | ${adminPart}` : '';
        document.title = `${pagePart.trim()} Theme Options${suffix}`;
      };

      const observer = new MutationObserver(() => {
        if (document.title.includes('Strapi')) {
          document.title = document.title.replace('Strapi Admin', 'Glyph Admin').replace(/\bStrapi\b/g, 'Glyph Admin');
        }
        formatThemeOptionsTitle();
      });

      observer.observe(document.querySelector('title')!, { childList: true, characterData: true, subtree: true });

      // Run after CM sets title (async, catches late updates)
      [500, 1500, 3000].forEach((ms) => setTimeout(formatThemeOptionsTitle, ms));
    }
  },
};
