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

export interface BlocksBoardOfDirectors extends Struct.ComponentSchema {
  collectionName: 'components_blocks_board_of_directors';
  info: {
    description: 'Surface bg: H2 heading + description + Accent divider + 4-col name grid (2-col mobile)';
    displayName: 'Board of Directors';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    heading: Schema.Attribute.String;
    sections: Schema.Attribute.Component<'shared.board-section', true>;
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

export interface BlocksCarouselSection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_carousel_sections';
  info: {
    description: 'Mobile snap-scroll carousel + 3-col desktop grid of program cards with image, title, body, and CTA link';
    displayName: 'Carousel Section';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    heading: Schema.Attribute.String;
    programs: Schema.Attribute.Component<'shared.program-card', true>;
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

export interface BlocksContactForm extends Struct.ComponentSchema {
  collectionName: 'components_blocks_contact_forms';
  info: {
    description: 'Two-column section: form on left, Google Maps embed on right';
    displayName: 'Contact Form';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    form: Schema.Attribute.Relation<'oneToOne', 'api::form.form'>;
    heading: Schema.Attribute.String;
    mapEmbedUrl: Schema.Attribute.Text;
  };
}

export interface BlocksContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_blocks_contact_info';
  info: {
    description: 'Surface bg section with centered H2 heading and 3-col grid of info cards (title + body text)';
    displayName: 'Contact Info';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    items: Schema.Attribute.Component<'shared.contact-info-item', true>;
  };
}

export interface BlocksContactPanels extends Struct.ComponentSchema {
  collectionName: 'components_blocks_contact_panels';
  info: {
    description: 'Primary bg rounded card with a heading and 2+ contact panels separated by dividers';
    displayName: 'Contact Panels';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    panels: Schema.Attribute.Component<'shared.contact-panel', true>;
  };
}

export interface BlocksContentCardGrid extends Struct.ComponentSchema {
  collectionName: 'components_blocks_content_card_grids';
  info: {
    description: '3-col grid of program/content cards with image, title, body, and CTA link';
    displayName: 'Content Card Grid';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    backgroundColor: Schema.Attribute.Enumeration<
      ['primary', 'surface', 'ink', 'highlight']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
    cardBackgroundColor: Schema.Attribute.Enumeration<
      ['highlight', 'surface', 'primary', 'ink']
    > &
      Schema.Attribute.DefaultTo<'highlight'>;
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    heading: Schema.Attribute.String;
    programs: Schema.Attribute.Component<'shared.program-card', true>;
  };
}

export interface BlocksContentImage extends Struct.ComponentSchema {
  collectionName: 'components_blocks_content_images';
  info: {
    description: 'H2 + body + optional CTA button paired with image';
    displayName: 'Content + Image';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    body: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    buttonText: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    imageObjectFit: Schema.Attribute.Enumeration<['cover', 'contain']> &
      Schema.Attribute.DefaultTo<'cover'>;
    imagePosition: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'right'>;
    secondaryButtonText: Schema.Attribute.String;
    secondaryButtonUrl: Schema.Attribute.String;
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

export interface BlocksCtaBanner extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cta_banners';
  info: {
    description: 'Primary card with Highlight heading, body text, and ghost button \u2014 stacks on mobile';
    displayName: 'CTA Banner';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    backgroundColor: Schema.Attribute.Enumeration<
      ['primary', 'accent', 'secondary', 'ink', 'highlight']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
    body: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    buttonText: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    heading: Schema.Attribute.String;
  };
}

export interface BlocksEmbedSection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_embed_sections';
  info: {
    description: 'Raw embed code (iframe, video player) with optional heading and WYSIWYG description';
    displayName: 'Embed Section';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    embedCode: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
  };
}

export interface BlocksEventCalendar extends Struct.ComponentSchema {
  collectionName: 'components_blocks_event_calendars';
  info: {
    description: 'Interactive monthly calendar showing all published events';
    displayName: 'Event Calendar';
    icon: 'calendar';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
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

export interface BlocksFeaturedBlogPosts extends Struct.ComponentSchema {
  collectionName: 'components_blocks_featured_blog_posts';
  info: {
    description: 'Large featured post card + sidebar list of recent posts';
    displayName: 'Featured Blog Posts';
    icon: 'star';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    contentType: Schema.Attribute.Enumeration<['blog', 'press-release']> &
      Schema.Attribute.DefaultTo<'blog'>;
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Featured'>;
    limit: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
          min: 2;
        },
        number
      > &
      Schema.Attribute.DefaultTo<4>;
  };
}

export interface BlocksFeaturedCarousel extends Struct.ComponentSchema {
  collectionName: 'components_blocks_featured_carousels';
  info: {
    description: 'Full-bleed photo carousel with per-slide heading, body, and link \u2014 used for homepage animal showcase';
    displayName: 'Featured Carousel';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    slides: Schema.Attribute.Component<'shared.featured-carousel-slide', true>;
  };
}

export interface BlocksFeaturedEvents extends Struct.ComponentSchema {
  collectionName: 'components_blocks_featured_events';
  info: {
    description: 'Carousel of events marked as featured';
    displayName: 'Featured Events';
    icon: 'star';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    limit: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
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

export interface BlocksHomepageHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_homepage_heroes';
  info: {
    description: 'Full-width carousel hero; each slide has its own image, heading, and optional CTA';
    displayName: 'Homepage Hero';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    slides: Schema.Attribute.Component<'shared.hero-slide', true>;
  };
}

export interface BlocksInfoBar extends Struct.ComponentSchema {
  collectionName: 'components_blocks_info_bars';
  info: {
    description: 'Full-width accent-alt bar with text and CTA; floats as pill when scrolled past';
    displayName: 'Info Bar';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    ctaText: Schema.Attribute.String;
    ctaUrl: Schema.Attribute.String;
    floatingText: Schema.Attribute.String;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksLeadershipGrid extends Struct.ComponentSchema {
  collectionName: 'components_blocks_leadership_grids';
  info: {
    description: 'Section heading + grid of leadership member cards with mobile carousel';
    displayName: 'Leadership Grid';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    heading: Schema.Attribute.String;
    members: Schema.Attribute.Component<'shared.leadership-member', true>;
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

export interface BlocksMediaCards extends Struct.ComponentSchema {
  collectionName: 'components_blocks_media_cards';
  info: {
    description: '3-column grid of image + title + body cards with optional links';
    displayName: 'Media Cards';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    cards: Schema.Attribute.Component<'shared.media-card', true>;
  };
}

export interface BlocksMembershipPricing extends Struct.ComponentSchema {
  collectionName: 'components_blocks_membership_pricings';
  info: {
    description: 'Grid of membership tier pricing cards with heading and description';
    displayName: 'Membership Pricing';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    footerContent: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    heading: Schema.Attribute.String;
    tiers: Schema.Attribute.Component<'shared.pricing-tier', true>;
  };
}

export interface BlocksMissionPriorities extends Struct.ComponentSchema {
  collectionName: 'components_blocks_mission_priorities';
  info: {
    description: 'Secondary bg: left mission card (image + text) + right priority cards';
    displayName: 'Mission & Priorities';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    missionBody: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    missionHeading: Schema.Attribute.String;
    priorities: Schema.Attribute.Component<'shared.priority-card', true>;
    sectionHeading: Schema.Attribute.String;
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

export interface BlocksPhotoGallery extends Struct.ComponentSchema {
  collectionName: 'components_blocks_photo_galleries';
  info: {
    description: 'Highlight bg, 1 tall left + 2 stacked right layout';
    displayName: 'Photo Gallery';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    galleryImages: Schema.Attribute.Component<'shared.gallery-image', true> &
      Schema.Attribute.Required;
    heading: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<['default', 'grid']> &
      Schema.Attribute.DefaultTo<'default'>;
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

export interface BlocksPromoCards extends Struct.ComponentSchema {
  collectionName: 'components_blocks_promo_cards';
  info: {
    description: 'Surface bg: two side-by-side promo cards (image + Accent heading + arrow + body), links to internal sections';
    displayName: 'Promo Cards';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    headingLevel: Schema.Attribute.Enumeration<['h2', 'h3']> &
      Schema.Attribute.DefaultTo<'h3'>;
    leftBody: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    leftHeading: Schema.Attribute.String;
    leftImage: Schema.Attribute.Media<'images'>;
    leftLinkUrl: Schema.Attribute.String;
    rightBody: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    rightHeading: Schema.Attribute.String;
    rightImage: Schema.Attribute.Media<'images'>;
    rightLinkUrl: Schema.Attribute.String;
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

export interface BlocksQuickLinksGrid extends Struct.ComponentSchema {
  collectionName: 'components_blocks_quick_links_grids';
  info: {
    description: 'Row of image cards with title and arrow \u2014 each card links to a page';
    displayName: 'Quick Links Grid';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    cards: Schema.Attribute.Component<'shared.quick-link-card', true>;
  };
}

export interface BlocksRecentBlogPosts extends Struct.ComponentSchema {
  collectionName: 'components_blocks_recent_blog_posts';
  info: {
    description: '3-column grid of non-featured blog posts with client-side pagination';
    displayName: 'Recent Blog Posts';
    icon: 'newspaper';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    contentType: Schema.Attribute.Enumeration<['blog', 'press-release']> &
      Schema.Attribute.DefaultTo<'blog'>;
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Our Recent News'>;
    postsPerPage: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 24;
          min: 3;
        },
        number
      > &
      Schema.Attribute.DefaultTo<9>;
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

export interface BlocksSplitCta extends Struct.ComponentSchema {
  collectionName: 'components_blocks_split_ctas';
  info: {
    description: 'Primary bg rounded block, Highlight heading, paneled contacts with dividers';
    displayName: 'Split CTA';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    backgroundColor: Schema.Attribute.Enumeration<
      ['primary', 'surface', 'ink', 'highlight']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    panels: Schema.Attribute.Component<'shared.cta-panel', true>;
  };
}

export interface BlocksSplitPanel extends Struct.ComponentSchema {
  collectionName: 'components_blocks_split_panels';
  info: {
    description: 'Full-width image + colored text panel, side-by-side on desktop, stacked on mobile';
    displayName: 'Split Panel';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    bgColor: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'accent', 'ink']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
    body: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    ctaText: Schema.Attribute.String;
    ctaUrl: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images' | 'videos'>;
    imagePosition: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'left'>;
    videoAutoplay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
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

export interface BlocksStatement extends Struct.ComponentSchema {
  collectionName: 'components_blocks_statements';
  info: {
    description: 'Centered article column: H2 heading + multi-paragraph body (paragraphs separated by blank lines)';
    displayName: 'Statement';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    body: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    heading: Schema.Attribute.String;
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

export interface BlocksSubpageHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_subpage_heroes';
  info: {
    description: '756px hero image with gradient overlay, decorative H1, and subtitle';
    displayName: 'Subpage Hero';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    ctaText: Schema.Attribute.String;
    ctaUrl: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
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

export interface BlocksTertiaryHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_tertiary_heroes';
  info: {
    description: '400px hero image with gradient overlay, decorative H1, and subtitle';
    displayName: 'Tertiary Hero';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
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

export interface BlocksTwoColumnContent extends Struct.ComponentSchema {
  collectionName: 'components_blocks_two_column_contents';
  info: {
    description: 'Two-column layout: heading/body/buttons per column + optional full-width image below';
    displayName: 'Two Column Content';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    leftBody: Schema.Attribute.Blocks;
    leftButtonPrimaryText: Schema.Attribute.Text;
    leftButtonPrimaryUrl: Schema.Attribute.Text;
    leftButtonSecondaryText: Schema.Attribute.Text;
    leftButtonSecondaryUrl: Schema.Attribute.Text;
    leftHeading: Schema.Attribute.Text;
    rightBody: Schema.Attribute.Blocks;
    rightButtonPrimaryText: Schema.Attribute.Text;
    rightButtonPrimaryUrl: Schema.Attribute.Text;
    rightButtonSecondaryText: Schema.Attribute.Text;
    rightButtonSecondaryUrl: Schema.Attribute.Text;
    rightHeading: Schema.Attribute.Text;
    variant: Schema.Attribute.Enumeration<['default', 'text-links']> &
      Schema.Attribute.DefaultTo<'default'>;
  };
}

export interface BlocksUpcomingEvents extends Struct.ComponentSchema {
  collectionName: 'components_blocks_upcoming_events';
  info: {
    description: 'Fetches upcoming events from the Events content type';
    displayName: 'Upcoming Events';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    ctaText: Schema.Attribute.String;
    ctaUrl: Schema.Attribute.String;
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    heading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Upcoming Events'>;
    limit: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<6>;
    variant: Schema.Attribute.Enumeration<['homepage', 'events']> &
      Schema.Attribute.DefaultTo<'homepage'>;
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

export interface SharedBoardMember extends Struct.ComponentSchema {
  collectionName: 'components_shared_board_members';
  info: {
    description: 'A single board of directors member';
    displayName: 'Board Member';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    organization: Schema.Attribute.String;
  };
}

export interface SharedBoardSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_board_sections';
  info: {
    description: 'A titled grouping of board members';
    displayName: 'Board Section';
  };
  attributes: {
    members: Schema.Attribute.Component<'shared.board-member', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedContactInfoItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_contact_info_items';
  info: {
    description: 'Single contact info card: title + multi-line body text';
    displayName: 'Contact Info Item';
  };
  attributes: {
    body: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedContactPanel extends Struct.ComponentSchema {
  collectionName: 'components_shared_contact_panels';
  info: {
    description: 'Single contact panel: department title, contact name, email, phone';
    displayName: 'Contact Panel';
  };
  attributes: {
    contactName: Schema.Attribute.String;
    email: Schema.Attribute.Email;
    phone: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedCtaPanel extends Struct.ComponentSchema {
  collectionName: 'components_shared_cta_panels';
  info: {
    displayName: 'CTA Panel';
  };
  attributes: {
    body: Schema.Attribute.Blocks;
    buttonText: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFeaturedCarouselSlide extends Struct.ComponentSchema {
  collectionName: 'components_shared_featured_carousel_slides';
  info: {
    description: 'Single slide for the featured carousel block \u2014 image, heading, body, and optional link';
    displayName: 'Featured Carousel Slide';
  };
  attributes: {
    body: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    linkUrl: Schema.Attribute.String;
  };
}

export interface SharedFooterColumn extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_columns';
  info: {
    displayName: 'Footer Column';
  };
  attributes: {
    links: Schema.Attribute.Component<'shared.footer-link', true>;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    page: Schema.Attribute.Relation<'manyToOne', 'api::page.page'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String;
  };
}

export interface SharedFooterLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_links';
  info: {
    displayName: 'Footer Link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    page: Schema.Attribute.Relation<'manyToOne', 'api::page.page'>;
    url: Schema.Attribute.String;
  };
}

export interface SharedGalleryImage extends Struct.ComponentSchema {
  collectionName: 'components_shared_gallery_images';
  info: {
    description: 'Image with optional link';
    displayName: 'Gallery Image';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    linkLabel: Schema.Attribute.String;
    linkUrl: Schema.Attribute.String;
  };
}

export interface SharedHeroSlide extends Struct.ComponentSchema {
  collectionName: 'components_shared_hero_slides';
  info: {
    description: 'Single slide for the homepage hero carousel \u2014 image, heading, and optional CTA';
    displayName: 'Hero Slide';
  };
  attributes: {
    ctaText: Schema.Attribute.String;
    ctaUrl: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface SharedLeadershipMember extends Struct.ComponentSchema {
  collectionName: 'components_shared_leadership_members';
  info: {
    description: 'Name, role, bio, photo and LinkedIn for a leadership card';
    displayName: 'Leadership Member';
  };
  attributes: {
    bio: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    linkedinUrl: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    role: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMediaCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_media_cards';
  info: {
    description: 'Image + title + body + optional link';
    displayName: 'Media Card';
  };
  attributes: {
    body: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    linkUrl: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedPartnerLogo extends Struct.ComponentSchema {
  collectionName: 'components_shared_partner_logos';
  info: {
    displayName: 'Partner Logo';
  };
  attributes: {
    altText: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    linkUrl: Schema.Attribute.String;
  };
}

export interface SharedPricingTier extends Struct.ComponentSchema {
  collectionName: 'components_shared_pricing_tiers';
  info: {
    description: 'A single membership tier card with name, price, description, and optional link';
    displayName: 'Pricing Tier';
  };
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    linkUrl: Schema.Attribute.String;
    period: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Yearly'>;
    price: Schema.Attribute.String & Schema.Attribute.Required;
    subtitle: Schema.Attribute.String;
    tierName: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedPriorityCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_priority_cards';
  info: {
    description: 'Title + body used in Mission & Priorities block';
    displayName: 'Priority Card';
  };
  attributes: {
    body: Schema.Attribute.RichText &
      Schema.Attribute.Required &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedProgramCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_program_cards';
  info: {
    displayName: 'Program Card';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    linkText: Schema.Attribute.String;
    linkUrl: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedQuickLinkCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_quick_link_cards';
  info: {
    description: 'Image card with title and arrow link';
    displayName: 'Quick Link Card';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSearchContentType extends Struct.ComponentSchema {
  collectionName: 'components_shared_search_content_types';
  info: {
    description: 'Controls which content type and fields are included in site search';
    displayName: 'Search Content Type';
  };
  attributes: {
    contentType: Schema.Attribute.Enumeration<
      ['pages', 'blog-posts', 'press-releases', 'events']
    > &
      Schema.Attribute.Required;
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    fields: Schema.Attribute.Text;
    label: Schema.Attribute.String;
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
    apiKey: Schema.Attribute.String & Schema.Attribute.Private;
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
      'blocks.board-of-directors': BlocksBoardOfDirectors;
      'blocks.brand': BlocksBrand;
      'blocks.brand-item': BlocksBrandItem;
      'blocks.card': BlocksCard;
      'blocks.card-item': BlocksCardItem;
      'blocks.carousel-section': BlocksCarouselSection;
      'blocks.chart': BlocksChart;
      'blocks.contact-form': BlocksContactForm;
      'blocks.contact-info': BlocksContactInfo;
      'blocks.contact-panels': BlocksContactPanels;
      'blocks.content-card-grid': BlocksContentCardGrid;
      'blocks.content-image': BlocksContentImage;
      'blocks.cta': BlocksCta;
      'blocks.cta-banner': BlocksCtaBanner;
      'blocks.embed-section': BlocksEmbedSection;
      'blocks.event-calendar': BlocksEventCalendar;
      'blocks.feature-item': BlocksFeatureItem;
      'blocks.featured-blog-posts': BlocksFeaturedBlogPosts;
      'blocks.featured-carousel': BlocksFeaturedCarousel;
      'blocks.featured-events': BlocksFeaturedEvents;
      'blocks.features': BlocksFeatures;
      'blocks.hero': BlocksHero;
      'blocks.homepage-hero': BlocksHomepageHero;
      'blocks.info-bar': BlocksInfoBar;
      'blocks.leadership-grid': BlocksLeadershipGrid;
      'blocks.map': BlocksMap;
      'blocks.media-cards': BlocksMediaCards;
      'blocks.membership-pricing': BlocksMembershipPricing;
      'blocks.mission-priorities': BlocksMissionPriorities;
      'blocks.modal': BlocksModal;
      'blocks.newsletter': BlocksNewsletter;
      'blocks.photo-gallery': BlocksPhotoGallery;
      'blocks.popover': BlocksPopover;
      'blocks.pricing': BlocksPricing;
      'blocks.pricing-plan': BlocksPricingPlan;
      'blocks.product-carousel': BlocksProductCarousel;
      'blocks.product-grid': BlocksProductGrid;
      'blocks.product-item': BlocksProductItem;
      'blocks.promo-banner': BlocksPromoBanner;
      'blocks.promo-cards': BlocksPromoCards;
      'blocks.quick-link': BlocksQuickLink;
      'blocks.quick-links-grid': BlocksQuickLinksGrid;
      'blocks.recent-blog-posts': BlocksRecentBlogPosts;
      'blocks.rich-text-block': BlocksRichTextBlock;
      'blocks.row': BlocksRow;
      'blocks.split-cta': BlocksSplitCta;
      'blocks.split-panel': BlocksSplitPanel;
      'blocks.stat-item': BlocksStatItem;
      'blocks.statement': BlocksStatement;
      'blocks.stats': BlocksStats;
      'blocks.step': BlocksStep;
      'blocks.step-item': BlocksStepItem;
      'blocks.subpage-hero': BlocksSubpageHero;
      'blocks.tab': BlocksTab;
      'blocks.tab-item': BlocksTabItem;
      'blocks.table': BlocksTable;
      'blocks.tailgrids-component': BlocksTailgridsComponent;
      'blocks.team': BlocksTeam;
      'blocks.team-member': BlocksTeamMember;
      'blocks.tertiary-hero': BlocksTertiaryHero;
      'blocks.testimonial-item': BlocksTestimonialItem;
      'blocks.testimonials': BlocksTestimonials;
      'blocks.two-column-content': BlocksTwoColumnContent;
      'blocks.upcoming-events': BlocksUpcomingEvents;
      'blocks.video': BlocksVideo;
      'navigation.nav-link': NavigationNavLink;
      'navigation.nav-sub-link': NavigationNavSubLink;
      'shared.board-member': SharedBoardMember;
      'shared.board-section': SharedBoardSection;
      'shared.contact-info-item': SharedContactInfoItem;
      'shared.contact-panel': SharedContactPanel;
      'shared.cta-panel': SharedCtaPanel;
      'shared.featured-carousel-slide': SharedFeaturedCarouselSlide;
      'shared.footer-column': SharedFooterColumn;
      'shared.footer-link': SharedFooterLink;
      'shared.gallery-image': SharedGalleryImage;
      'shared.hero-slide': SharedHeroSlide;
      'shared.leadership-member': SharedLeadershipMember;
      'shared.media-card': SharedMediaCard;
      'shared.partner-logo': SharedPartnerLogo;
      'shared.pricing-tier': SharedPricingTier;
      'shared.priority-card': SharedPriorityCard;
      'shared.program-card': SharedProgramCard;
      'shared.quick-link-card': SharedQuickLinkCard;
      'shared.search-content-type': SharedSearchContentType;
      'theme-option.gtm': ThemeOptionGtm;
      'theme-option.mailgun': ThemeOptionMailgun;
      'theme-option.marker': ThemeOptionMarker;
      'theme-option.social': ThemeOptionSocial;
    }
  }
}
