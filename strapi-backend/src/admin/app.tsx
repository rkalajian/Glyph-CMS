import type { StrapiApp } from '@strapi/strapi/admin';

// @ts-expect-error – SVG import
import Logo from './extensions/glyph.svg';
import { FormAttachPanel } from './extensions/FormAttachPanel';
import { initPageTreeList } from './extensions/PageTreeList';
import { initPageSlugPrefix } from './extensions/PageSlugPrefix';
import { initWysiwygSubSup } from './extensions/WysiwygSubSup';
import './extensions/custom-button-styles.css';

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

    initPageTreeList();
    initPageSlugPrefix();
    initWysiwygSubSup();

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
