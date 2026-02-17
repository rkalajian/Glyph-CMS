import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksAbout extends Struct.ComponentSchema {
  collectionName: 'components_blocks_abouts';
  info: {
    description: 'About section with 8 layout variations';
    displayName: 'About';
  };
  attributes: {
    badge: Schema.Attribute.String;
    buttonText: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    images: Schema.Attribute.Media<'images', true>;
    items: Schema.Attribute.Component<'blocks.about-item', true>;
    listItems: Schema.Attribute.Component<'blocks.about-list-item', true>;
    statsLabel: Schema.Attribute.String;
    statsNumber: Schema.Attribute.String;
    statsSublabel: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 8;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksAboutItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_about_items';
  info: {
    description: 'Feature item for About block (variation 3)';
    displayName: 'About Item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksAboutListItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_about_list_items';
  info: {
    description: 'Bullet list item for About block';
    displayName: 'About List Item';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksAccordion extends Struct.ComponentSchema {
  collectionName: 'components_blocks_accordions';
  info: {
    description: 'FAQ / accordion block with 5 layout variations';
    displayName: 'Accordion';
  };
  attributes: {
    badge: Schema.Attribute.String;
    items: Schema.Attribute.Component<'blocks.accordion-item', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksAccordionItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_accordion_items';
  info: {
    description: 'Single accordion item (question/answer or tab with content)';
    displayName: 'Accordion Item';
  };
  attributes: {
    header: Schema.Attribute.String & Schema.Attribute.Required;
    listItems: Schema.Attribute.Component<'blocks.about-list-item', true>;
    text: Schema.Attribute.Text;
    text2: Schema.Attribute.Text;
  };
}

export interface BlocksBrand extends Struct.ComponentSchema {
  collectionName: 'components_blocks_brands';
  info: {
    description: 'Brand logos section with variations';
    displayName: 'Brand';
  };
  attributes: {
    items: Schema.Attribute.Component<'blocks.brand-item', true>;
    title: Schema.Attribute.String;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksBrandItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_brand_items';
  info: {
    description: 'Single brand logo/link';
    displayName: 'Brand Item';
  };
  attributes: {
    alt: Schema.Attribute.String;
    href: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface BlocksCard extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cards';
  info: {
    description: 'Card grid with variations';
    displayName: 'Card';
  };
  attributes: {
    items: Schema.Attribute.Component<'blocks.card-item', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksCardItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_card_items';
  info: {
    description: 'Single card content';
    displayName: 'Card Item';
  };
  attributes: {
    buttonText: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    titleUrl: Schema.Attribute.String;
  };
}

export interface BlocksChart extends Struct.ComponentSchema {
  collectionName: 'components_blocks_charts';
  info: {
    description: 'Chart block with variations';
    displayName: 'Chart';
  };
  attributes: {
    chartType: Schema.Attribute.Enumeration<['line', 'bar', 'area', 'pie']>;
    props: Schema.Attribute.JSON;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksCta extends Struct.ComponentSchema {
  collectionName: 'components_blocks_ctas';
  info: {
    description: 'Tailgrids-style CTA block';
    displayName: 'Call to Action';
  };
  attributes: {
    buttonText: Schema.Attribute.String & Schema.Attribute.Required;
    buttonUrl: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<['primary', 'secondary', 'outline']> &
      Schema.Attribute.DefaultTo<'primary'>;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksFeatureItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_feature_items';
  info: {
    description: 'Single feature row';
    displayName: 'Feature Item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksFeatures extends Struct.ComponentSchema {
  collectionName: 'components_blocks_features';
  info: {
    description: 'Tailgrids-style features grid';
    displayName: 'Features';
  };
  attributes: {
    items: Schema.Attribute.Component<'blocks.feature-item', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_heroes';
  info: {
    description: 'Tailgrids-style hero section';
    displayName: 'Hero';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    primaryButtonText: Schema.Attribute.String;
    primaryButtonUrl: Schema.Attribute.String;
    secondaryButtonText: Schema.Attribute.String;
    secondaryButtonUrl: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksMap extends Struct.ComponentSchema {
  collectionName: 'components_blocks_maps';
  info: {
    description: 'Map/embed block with variations';
    displayName: 'Map';
  };
  attributes: {
    address: Schema.Attribute.String;
    embedUrl: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksModal extends Struct.ComponentSchema {
  collectionName: 'components_blocks_modals';
  info: {
    description: 'Modal dialog block with variations';
    displayName: 'Modal';
  };
  attributes: {
    content: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    triggerButtonStyle: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'outline']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
    triggerText: Schema.Attribute.String;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksNewsletter extends Struct.ComponentSchema {
  collectionName: 'components_blocks_newsletters';
  info: {
    description: 'Newsletter signup block with variations';
    displayName: 'Newsletter';
  };
  attributes: {
    actionUrl: Schema.Attribute.String;
    buttonText: Schema.Attribute.String;
    placeholder: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksPopover extends Struct.ComponentSchema {
  collectionName: 'components_blocks_popovers';
  info: {
    description: 'Popover/tooltip block with variations';
    displayName: 'Popover';
  };
  attributes: {
    content: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    triggerText: Schema.Attribute.String;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksPricing extends Struct.ComponentSchema {
  collectionName: 'components_blocks_pricings';
  info: {
    description: 'Pricing plans block with variations';
    displayName: 'Pricing';
  };
  attributes: {
    plans: Schema.Attribute.Component<'blocks.pricing-plan', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksPricingPlan extends Struct.ComponentSchema {
  collectionName: 'components_blocks_pricing_plans';
  info: {
    description: 'Single pricing tier';
    displayName: 'Pricing Plan';
  };
  attributes: {
    buttonText: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    features: Schema.Attribute.Text;
    highlighted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    period: Schema.Attribute.String;
    price: Schema.Attribute.String;
  };
}

export interface BlocksProductCarousel extends Struct.ComponentSchema {
  collectionName: 'components_blocks_product_carousels';
  info: {
    description: 'Product carousel block with variations';
    displayName: 'Product Carousel';
  };
  attributes: {
    products: Schema.Attribute.Component<'blocks.product-item', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksProductGrid extends Struct.ComponentSchema {
  collectionName: 'components_blocks_product_grids';
  info: {
    description: 'Product grid block with variations';
    displayName: 'Product Grid';
  };
  attributes: {
    products: Schema.Attribute.Component<'blocks.product-item', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksProductItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_product_items';
  info: {
    description: 'Product for carousel/grid';
    displayName: 'Product Item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    originalPrice: Schema.Attribute.String;
    price: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String;
  };
}

export interface BlocksPromoBanner extends Struct.ComponentSchema {
  collectionName: 'components_blocks_promo_banners';
  info: {
    description: 'Promotional banner block';
    displayName: 'Promo Banner';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    linkText: Schema.Attribute.String;
    linkUrl: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

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

export interface BlocksRichTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_rich_text_blocks';
  info: {
    description: 'Flexible rich text content block';
    displayName: 'Rich Text';
  };
  attributes: {
    content: Schema.Attribute.RichText;
  };
}

export interface BlocksRow extends Struct.ComponentSchema {
  collectionName: 'components_blocks_rows';
  info: {
    description: 'Multi-column layout - arrange blocks in 2, 3, or 4 Tailwind columns';
    displayName: 'Row (Columns)';
  };
  attributes: {
    blocks: Schema.Attribute.DynamicZone<
      [
        'blocks.hero',
        'blocks.about',
        'blocks.accordion',
        'blocks.features',
        'blocks.cta',
        'blocks.testimonials',
        'blocks.rich-text-block',
        'blocks.tailgrids-component',
        'blocks.brand',
        'blocks.card',
        'blocks.chart',
        'blocks.map',
        'blocks.modal',
        'blocks.newsletter',
        'blocks.popover',
        'blocks.pricing',
        'blocks.product-carousel',
        'blocks.product-grid',
        'blocks.promo-banner',
        'blocks.stats',
        'blocks.step',
        'blocks.tab',
        'blocks.table',
        'blocks.team',
        'blocks.video',
      ]
    >;
    columns: Schema.Attribute.Enumeration<['2', '3', '4']> &
      Schema.Attribute.DefaultTo<'2'>;
    gap: Schema.Attribute.Enumeration<['4', '6', '8']> &
      Schema.Attribute.DefaultTo<'6'>;
  };
}

export interface BlocksStatItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_stat_items';
  info: {
    description: 'Single stat/counter';
    displayName: 'Stat Item';
  };
  attributes: {
    label: Schema.Attribute.String;
    number: Schema.Attribute.String & Schema.Attribute.Required;
    sublabel: Schema.Attribute.String;
  };
}

export interface BlocksStats extends Struct.ComponentSchema {
  collectionName: 'components_blocks_stats';
  info: {
    description: 'Stats/counters block with variations';
    displayName: 'Stats';
  };
  attributes: {
    items: Schema.Attribute.Component<'blocks.stat-item', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksStep extends Struct.ComponentSchema {
  collectionName: 'components_blocks_steps';
  info: {
    description: 'Step-by-step block with variations';
    displayName: 'Step';
  };
  attributes: {
    steps: Schema.Attribute.Component<'blocks.step-item', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksStepItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_step_items';
  info: {
    description: 'Single step';
    displayName: 'Step Item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    number: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksTab extends Struct.ComponentSchema {
  collectionName: 'components_blocks_tabs';
  info: {
    description: 'Tabs block with variations';
    displayName: 'Tab';
  };
  attributes: {
    subtitle: Schema.Attribute.Text;
    tabs: Schema.Attribute.Component<'blocks.tab-item', true>;
    title: Schema.Attribute.String;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksTabItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_tab_items';
  info: {
    description: 'Single tab content';
    displayName: 'Tab Item';
  };
  attributes: {
    content: Schema.Attribute.Text;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksTable extends Struct.ComponentSchema {
  collectionName: 'components_blocks_tables';
  info: {
    description: 'Table block with variations';
    displayName: 'Table';
  };
  attributes: {
    headers: Schema.Attribute.JSON;
    rows: Schema.Attribute.JSON;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksTailgridsComponent extends Struct.ComponentSchema {
  collectionName: 'components_blocks_tailgrids_components';
  info: {
    description: 'Any Tailgrids component \u2013 pick type (e.g. Hero, Stats, Team) and variation number';
    displayName: 'Tailgrids Component';
  };
  attributes: {
    componentType: Schema.Attribute.String & Schema.Attribute.Required;
    props: Schema.Attribute.JSON;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksTeam extends Struct.ComponentSchema {
  collectionName: 'components_blocks_teams';
  info: {
    description: 'Team members block with variations';
    displayName: 'Team';
  };
  attributes: {
    members: Schema.Attribute.Component<'blocks.team-member', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksTeamMember extends Struct.ComponentSchema {
  collectionName: 'components_blocks_team_members';
  info: {
    description: 'Team member';
    displayName: 'Team Member';
  };
  attributes: {
    bio: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    role: Schema.Attribute.String;
    socialLinks: Schema.Attribute.JSON;
  };
}

export interface BlocksTestimonialItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_testimonial_items';
  info: {
    description: 'Single testimonial';
    displayName: 'Testimonial Item';
  };
  attributes: {
    author: Schema.Attribute.String & Schema.Attribute.Required;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
    role: Schema.Attribute.String;
  };
}

export interface BlocksTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_blocks_testimonials';
  info: {
    description: 'Tailgrids-style testimonials section';
    displayName: 'Testimonials';
  };
  attributes: {
    items: Schema.Attribute.Component<'blocks.testimonial-item', true>;
    title: Schema.Attribute.String;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface BlocksVideo extends Struct.ComponentSchema {
  collectionName: 'components_blocks_videos';
  info: {
    description: 'Video embed block with variations';
    displayName: 'Video';
  };
  attributes: {
    embedCode: Schema.Attribute.Text;
    subtitle: Schema.Attribute.Text;
    thumbnailUrl: Schema.Attribute.String;
    title: Schema.Attribute.String;
    variation: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
    videoUrl: Schema.Attribute.String;
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
      'blocks.about': BlocksAbout;
      'blocks.about-item': BlocksAboutItem;
      'blocks.about-list-item': BlocksAboutListItem;
      'blocks.accordion': BlocksAccordion;
      'blocks.accordion-item': BlocksAccordionItem;
      'blocks.brand': BlocksBrand;
      'blocks.brand-item': BlocksBrandItem;
      'blocks.card': BlocksCard;
      'blocks.card-item': BlocksCardItem;
      'blocks.chart': BlocksChart;
      'blocks.cta': BlocksCta;
      'blocks.feature-item': BlocksFeatureItem;
      'blocks.features': BlocksFeatures;
      'blocks.hero': BlocksHero;
      'blocks.map': BlocksMap;
      'blocks.modal': BlocksModal;
      'blocks.newsletter': BlocksNewsletter;
      'blocks.popover': BlocksPopover;
      'blocks.pricing': BlocksPricing;
      'blocks.pricing-plan': BlocksPricingPlan;
      'blocks.product-carousel': BlocksProductCarousel;
      'blocks.product-grid': BlocksProductGrid;
      'blocks.product-item': BlocksProductItem;
      'blocks.promo-banner': BlocksPromoBanner;
      'blocks.quick-link': BlocksQuickLink;
      'blocks.rich-text-block': BlocksRichTextBlock;
      'blocks.row': BlocksRow;
      'blocks.stat-item': BlocksStatItem;
      'blocks.stats': BlocksStats;
      'blocks.step': BlocksStep;
      'blocks.step-item': BlocksStepItem;
      'blocks.tab': BlocksTab;
      'blocks.tab-item': BlocksTabItem;
      'blocks.table': BlocksTable;
      'blocks.tailgrids-component': BlocksTailgridsComponent;
      'blocks.team': BlocksTeam;
      'blocks.team-member': BlocksTeamMember;
      'blocks.testimonial-item': BlocksTestimonialItem;
      'blocks.testimonials': BlocksTestimonials;
      'blocks.video': BlocksVideo;
      'navigation.nav-link': NavigationNavLink;
      'navigation.nav-sub-link': NavigationNavSubLink;
      'theme-option.gtm': ThemeOptionGtm;
      'theme-option.mailgun': ThemeOptionMailgun;
      'theme-option.marker': ThemeOptionMarker;
      'theme-option.social': ThemeOptionSocial;
    }
  }
}
