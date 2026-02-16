import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksQuickLink extends Struct.ComponentSchema {
  collectionName: 'components_blocks_quick_links';
  info: {
    description: 'A labeled link for homepage quick links';
    displayName: 'Quick Link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface NavigationNavLink extends Struct.ComponentSchema {
  collectionName: 'components_navigation_nav_links';
  info: {
    description: 'A nav link with optional dropdown sub-items';
    displayName: 'Nav Link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    subnav: Schema.Attribute.Component<'navigation.nav-sub-link', true>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface NavigationNavSubLink extends Struct.ComponentSchema {
  collectionName: 'components_navigation_nav_sub_links';
  info: {
    description: 'A dropdown item under a main nav link';
    displayName: 'Subnav Link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ThemeOptionGtm extends Struct.ComponentSchema {
  collectionName: 'components_theme_option_gtms';
  info: {
    description: 'Google Tag Manager settings';
    displayName: 'GTM';
  };
  attributes: {
    gtmBodySnippet: Schema.Attribute.Text;
    gtmHeaderSnippet: Schema.Attribute.Text;
  };
}

export interface ThemeOptionMailgun extends Struct.ComponentSchema {
  collectionName: 'components_theme_option_mailguns';
  info: {
    description: 'Mailgun email delivery. API key can also be set via MAILGUN_API_KEY env var.';
    displayName: 'Mailgun';
  };
  attributes: {
    apiKey: Schema.Attribute.Password;
    defaultFrom: Schema.Attribute.String;
    defaultReplyTo: Schema.Attribute.String;
    domain: Schema.Attribute.String;
    host: Schema.Attribute.String;
  };
}

export interface ThemeOptionMarker extends Struct.ComponentSchema {
  collectionName: 'components_theme_option_markers';
  info: {
    description: 'Marker.io feedback widget settings';
    displayName: 'Marker';
  };
  attributes: {
    markerSnippet: Schema.Attribute.Text;
  };
}

export interface ThemeOptionSocial extends Struct.ComponentSchema {
  collectionName: 'components_theme_option_socials';
  info: {
    description: 'Social media links and icons';
    displayName: 'Social';
  };
  attributes: {
    facebookIcon: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'fa-brands fa-facebook'>;
    facebookUrl: Schema.Attribute.String;
    instagramIcon: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'fa-brands fa-instagram'>;
    instagramUrl: Schema.Attribute.String;
    linkedinIcon: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'fa-brands fa-linkedin'>;
    linkedinUrl: Schema.Attribute.String;
    tiktokIcon: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'fa-brands fa-tiktok'>;
    tiktokUrl: Schema.Attribute.String;
    xIcon: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'fa-brands fa-x-twitter'>;
    xUrl: Schema.Attribute.String;
    youtubeIcon: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'fa-brands fa-youtube'>;
    youtubeUrl: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.quick-link': BlocksQuickLink;
      'navigation.nav-link': NavigationNavLink;
      'navigation.nav-sub-link': NavigationNavSubLink;
      'theme-option.gtm': ThemeOptionGtm;
      'theme-option.mailgun': ThemeOptionMailgun;
      'theme-option.marker': ThemeOptionMarker;
      'theme-option.social': ThemeOptionSocial;
    }
  }
}
