/**
 * Strapi 5 API response types.
 * Mirrors the REST API structure: data, meta, error.
 * @see https://docs.strapi.io/dev-docs/api/rest
 */

// -----------------------------------------------------------------------------
// Response & metadata
// -----------------------------------------------------------------------------

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiMeta {
  pagination?: StrapiPagination;
}

// -----------------------------------------------------------------------------
// Media
// -----------------------------------------------------------------------------

export interface StrapiImage {
  id: number;
  documentId: string;
  url: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  /** MIME type (e.g. image/webp, video/mp4) — StrapiMedia renders <video> for video/* */
  mime?: string | null;
  /** Optional focal point (percentages) for object-position cropping */
  focalPoint?: { x: number; y: number } | null;
}

// -----------------------------------------------------------------------------
// Content types
// -----------------------------------------------------------------------------

export interface StrapiQuickLink {
  label: string;
  url: string;
}

/** Page block: Hero */
export interface StrapiBlockHero {
  __component: 'blocks.hero';
  variation?: number | null;
  title: string;
  subtitle?: string | null;
  primaryButtonText?: string | null;
  primaryButtonUrl?: string | null;
  secondaryButtonText?: string | null;
  secondaryButtonUrl?: string | null;
  image?: StrapiImage | null;
}

/** Page block: Feature item */
export interface StrapiBlockFeatureItem {
  icon?: StrapiImage | null;
  title: string;
  description?: string | null;
}

/** Page block: About item */
export interface StrapiBlockAboutItem {
  title: string;
  description?: string | null;
  icon?: StrapiImage | null;
}

/** Page block: About list item */
export interface StrapiBlockAboutListItem {
  text: string;
}

/** Page block: About */
export interface StrapiBlockAbout {
  __component: 'blocks.about';
  variation?: number | null;
  title?: string | null;
  badge?: string | null;
  subtitle?: string | null;
  description?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  image?: StrapiImage | null;
  images?: StrapiImage[] | null;
  items?: StrapiBlockAboutItem[] | null;
  listItems?: StrapiBlockAboutListItem[] | null;
  statsNumber?: string | null;
  statsLabel?: string | null;
  statsSublabel?: string | null;
}

/** Page block: Features */
export interface StrapiBlockFeatures {
  __component: 'blocks.features';
  variation?: number | null;
  title: string;
  subtitle?: string | null;
  items?: StrapiBlockFeatureItem[] | null;
}

/** Page block: CTA */
export interface StrapiBlockCta {
  __component: 'blocks.cta';
  variation?: number | null;
  title: string;
  description?: string | null;
  buttonText: string;
  buttonUrl: string;
  variant?: 'primary' | 'secondary' | 'outline' | null;
}

/** Page block: Testimonial item */
export interface StrapiBlockTestimonialItem {
  quote: string;
  author: string;
  role?: string | null;
}

/** Page block: Testimonials */
export interface StrapiBlockTestimonials {
  __component: 'blocks.testimonials';
  variation?: number | null;
  title?: string | null;
  items?: StrapiBlockTestimonialItem[] | null;
}

/** Page block: Rich Text */
export interface StrapiBlockRichText {
  __component: 'blocks.rich-text-block';
  content?: string | StrapiBlock[] | null;
}

/** Page block: Tailgrids Component (generic) */
export interface StrapiBlockTailgridsComponent {
  __component: 'blocks.tailgrids-component';
  componentType: string;
  variation?: number | null;
  title?: string | null;
  subtitle?: string | null;
  props?: Record<string, unknown> | null;
}

/** Page block: Accordion item */
export interface StrapiBlockAccordionItem {
  header: string;
  text?: string | null;
  text2?: string | null;
  listItems?: StrapiBlockAboutListItem[] | null;
}

/** Page block: Accordion */
export interface StrapiBlockAccordion {
  __component: 'blocks.accordion';
  variation?: number | null;
  badge?: string | null;
  title?: string | null;
  subtitle?: string | null;
  items?: StrapiBlockAccordionItem[] | null;
}

/** Page block: Row (columns layout) */
export interface StrapiBlockRow {
  __component: 'blocks.row';
  columns?: '2' | '3' | '4';
  gap?: '4' | '6' | '8';
  blocks?: StrapiPageBlock[] | null;
}

/** Page block: Brand item */
export interface StrapiBlockBrandItem {
  image?: StrapiImage | null;
  href?: string | null;
  alt?: string | null;
}

/** Page block: Brand */
export interface StrapiBlockBrand {
  __component: 'blocks.brand';
  variation?: number | null;
  title?: string | null;
  items?: StrapiBlockBrandItem[] | null;
}

/** Page block: Card item */
export interface StrapiBlockCardItem {
  image?: StrapiImage | null;
  title: string;
  description?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  titleUrl?: string | null;
}

/** Page block: Card */
export interface StrapiBlockCard {
  __component: 'blocks.card';
  variation?: number | null;
  title?: string | null;
  subtitle?: string | null;
  items?: StrapiBlockCardItem[] | null;
}

/** Page block: Chart */
export interface StrapiBlockChart {
  __component: 'blocks.chart';
  variation?: number | null;
  title?: string | null;
  subtitle?: string | null;
  chartType?: 'line' | 'bar' | 'area' | 'pie' | null;
  props?: Record<string, unknown> | null;
}

/** Page block: Map */
export interface StrapiBlockMap {
  __component: 'blocks.map';
  variation?: number | null;
  title?: string | null;
  subtitle?: string | null;
  embedUrl?: string | null;
  address?: string | null;
}

/** Page block: Modal */
export interface StrapiBlockModal {
  __component: 'blocks.modal';
  variation?: number | null;
  title?: string | null;
  content?: string | null;
  triggerText?: string | null;
  triggerButtonStyle?: 'primary' | 'secondary' | 'outline' | null;
}

/** Page block: Newsletter */
export interface StrapiBlockNewsletter {
  __component: 'blocks.newsletter';
  variation?: number | null;
  title?: string | null;
  subtitle?: string | null;
  placeholder?: string | null;
  buttonText?: string | null;
  actionUrl?: string | null;
}

/** Page block: Popover */
export interface StrapiBlockPopover {
  __component: 'blocks.popover';
  variation?: number | null;
  title?: string | null;
  content?: string | null;
  triggerText?: string | null;
}

/** Page block: Pricing plan */
export interface StrapiBlockPricingPlan {
  name: string;
  price?: string | null;
  period?: string | null;
  description?: string | null;
  features?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  highlighted?: boolean | null;
}

/** Page block: Pricing */
export interface StrapiBlockPricing {
  __component: 'blocks.pricing';
  variation?: number | null;
  title?: string | null;
  subtitle?: string | null;
  plans?: StrapiBlockPricingPlan[] | null;
}

/** Page block: Product item */
export interface StrapiBlockProductItem {
  image?: StrapiImage | null;
  title: string;
  price?: string | null;
  originalPrice?: string | null;
  description?: string | null;
  url?: string | null;
}

/** Page block: Product Carousel */
export interface StrapiBlockProductCarousel {
  __component: 'blocks.product-carousel';
  variation?: number | null;
  title?: string | null;
  subtitle?: string | null;
  products?: StrapiBlockProductItem[] | null;
}

/** Page block: Product Grid */
export interface StrapiBlockProductGrid {
  __component: 'blocks.product-grid';
  variation?: number | null;
  title?: string | null;
  subtitle?: string | null;
  products?: StrapiBlockProductItem[] | null;
}

/** Page block: Promo Banner */
export interface StrapiBlockPromoBanner {
  __component: 'blocks.promo-banner';
  variation?: number | null;
  title?: string | null;
  subtitle?: string | null;
  linkUrl?: string | null;
  linkText?: string | null;
  image?: StrapiImage | null;
}

/** Page block: Stat item */
export interface StrapiBlockStatItem {
  number: string;
  label?: string | null;
  sublabel?: string | null;
}

/** Page block: Stats */
export interface StrapiBlockStats {
  __component: 'blocks.stats';
  variation?: number | null;
  title?: string | null;
  subtitle?: string | null;
  items?: StrapiBlockStatItem[] | null;
}

/** Page block: Step item */
export interface StrapiBlockStepItem {
  number?: string | null;
  title: string;
  description?: string | null;
}

/** Page block: Step */
export interface StrapiBlockStep {
  __component: 'blocks.step';
  variation?: number | null;
  title?: string | null;
  subtitle?: string | null;
  steps?: StrapiBlockStepItem[] | null;
}

/** Page block: Tab item */
export interface StrapiBlockTabItem {
  label: string;
  content?: string | null;
}

/** Page block: Tab */
export interface StrapiBlockTab {
  __component: 'blocks.tab';
  variation?: number | null;
  title?: string | null;
  subtitle?: string | null;
  tabs?: StrapiBlockTabItem[] | null;
}

/** Page block: Table */
export interface StrapiBlockTable {
  __component: 'blocks.table';
  variation?: number | null;
  title?: string | null;
  subtitle?: string | null;
  headers?: unknown;
  rows?: unknown;
}

/** Page block: Team member */
export interface StrapiBlockTeamMember {
  name: string;
  role?: string | null;
  image?: StrapiImage | null;
  bio?: string | null;
  socialLinks?: unknown;
}

/** Page block: Team */
export interface StrapiBlockTeam {
  __component: 'blocks.team';
  variation?: number | null;
  title?: string | null;
  subtitle?: string | null;
  members?: StrapiBlockTeamMember[] | null;
}

/** Page block: Video */
export interface StrapiBlockVideo {
  __component: 'blocks.video';
  variation?: number | null;
  title?: string | null;
  subtitle?: string | null;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  embedCode?: string | null;
}

export type StrapiPageBlock =
  | StrapiBlockHero
  | StrapiBlockAbout
  | StrapiBlockAccordion
  | StrapiBlockBrand
  | StrapiBlockCard
  | StrapiBlockChart
  | StrapiBlockFeatures
  | StrapiBlockCta
  | StrapiBlockMap
  | StrapiBlockModal
  | StrapiBlockNewsletter
  | StrapiBlockPopover
  | StrapiBlockPricing
  | StrapiBlockProductCarousel
  | StrapiBlockProductGrid
  | StrapiBlockPromoBanner
  | StrapiBlockStats
  | StrapiBlockStep
  | StrapiBlockTab
  | StrapiBlockTable
  | StrapiBlockTeam
  | StrapiBlockTestimonials
  | StrapiBlockRichText
  | StrapiBlockTailgridsComponent
  | StrapiBlockVideo
  | StrapiBlockRow
  | StrapiBlockSubpageHero
  | StrapiBlockTertiaryHero
  | StrapiBlockSplitCta
  | StrapiBlockPhotoGallery
  | StrapiBlockContentImage
  | StrapiBlockQuickLinksGrid
  | StrapiBlockInfoBar
  | StrapiBlockHomepageHero
  | StrapiBlockProfileCarousel
  | StrapiBlockNameList
  | StrapiBlockFeaturePriority
  | StrapiBlockTwoColumnContent
  | StrapiBlockMediaCards
  | StrapiBlockFeaturedEvents
  | StrapiBlockFeaturedBlogPosts
  | StrapiBlockRecentBlogPosts
  | StrapiBlockUpcomingEvents
  | StrapiBlockSplitPanel
  | StrapiBlockFeaturedCarousel
  | StrapiBlockContentCardGrid
  | StrapiBlockCarouselSection
  | StrapiBlockContactPanels
  | StrapiBlockContactInfo
  | StrapiBlockMembershipPricing
  | StrapiBlockEventCalendar
  | StrapiBlockContactForm
  | StrapiBlockCtaBanner
  | StrapiBlockStatement
  | StrapiBlockEmbedSection
  | StrapiBlockOverlayPair;

export interface StrapiPage {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  content?: string | StrapiBlock[] | null;
  quickLinks?: StrapiQuickLink[] | null;
  blocks?: StrapiPageBlock[] | null;
  parent?: StrapiPage | null;
  children?: StrapiPage[] | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiBlogCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiBlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  featured?: boolean;
  excerpt?: string | null;
  content: string | StrapiBlock[];
  publishedAt?: string | null;
  coverImage?: StrapiImage | null;
  categories?: StrapiBlogCategory[] | null;
  parent?: StrapiBlogPost | null;
  children?: StrapiBlogPost[] | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiPressReleaseCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiPressRelease {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string | StrapiBlock[];
  publishedAt?: string | null;
  coverImage?: StrapiImage | null;
  categories?: StrapiPressReleaseCategory[] | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiEvent {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  featured?: boolean;
  startDate: string;
  endDate?: string | null;
  allDay?: boolean;
  description?: string | StrapiBlock[] | null;
  location?: string | null;
  url?: string | null;
  image?: StrapiImage | null;
  googleCalendarEventId?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Navigation
// -----------------------------------------------------------------------------

export interface StrapiNavItem {
  id: number;
  documentId: string;
  label: string;
  url: string;
  menu: 'primary' | 'utility' | 'footer';
  order?: number;
  openInNewTab?: boolean;
  subnav?: StrapiNavItem[];
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Theme options (Marker, GTM, social)
// -----------------------------------------------------------------------------

export interface StrapiThemeOptionMarker {
  markerSnippet?: string | null;
}

export interface StrapiThemeOptionGtm {
  gtmHeaderSnippet?: string | null;
  gtmBodySnippet?: string | null;
}

export interface StrapiThemeOptionSocial {
  facebookUrl?: string | null;
  facebookIcon?: string | null;
  linkedinUrl?: string | null;
  linkedinIcon?: string | null;
  xUrl?: string | null;
  xIcon?: string | null;
  tiktokUrl?: string | null;
  tiktokIcon?: string | null;
  youtubeUrl?: string | null;
  youtubeIcon?: string | null;
  instagramUrl?: string | null;
  instagramIcon?: string | null;
}

export interface StrapiThemeOptions {
  /** Single document; use populate=* for nested data. */
  documentId?: string;
  siteName?: string | null;
  logo?: StrapiImage | null;
  favicon?: StrapiImage | null;
  /** react = SPA (client-side). static = pre-rendered HTML at build time. */
  frontendMode?: 'react' | 'static' | null;
  showBreadcrumbs?: boolean;
  blogPostsPerPage?: number;
  pressReleasesPerPage?: number;
  marker?: StrapiThemeOptionMarker | null;
  gtm?: StrapiThemeOptionGtm | null;
  social?: StrapiThemeOptionSocial | null;
  /** reCAPTCHA v2 site key (public). Secret key stays server-side in Strapi. */
  recaptchaSiteKey?: string | null;
  searchConfig?: StrapiSearchContentTypeConfig[] | null;
  publishedAt?: string | null;
  updatedAt?: string;
}

export interface StrapiSearchContentTypeConfig {
  contentType: string;
  label?: string | null;
  enabled?: boolean;
  /** Comma-separated field names to search; blank = defaults */
  fields?: string | null;
}

export interface StrapiSearchResult {
  type: string;
  label: string;
  documentId: string;
  title: string;
  slug: string;
  url: string;
  excerpt?: string;
  image?: StrapiImage | null;
}

export interface StrapiSearchResponse {
  data: StrapiSearchResult[];
  meta: { total: number; query: string };
}

export interface StrapiSiteAlert {
  id: number;
  documentId: string;
  message: string;
  startDate: string;
  endDate?: string | null;
  severity?: 'info' | 'warning' | 'critical';
  linkUrl?: string | null;
  linkLabel?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiFormField {
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox';
  name: string;
  label: string;
  required?: boolean;
  options?: string[];
}

export interface StrapiForm {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string | null;
  fields: StrapiFormField[];
  submitButtonLabel?: string | null;
  successType?: 'message' | 'redirect' | null;
  successMessage?: string | null;
  successRedirectUrl?: string | null;
  embedCode?: string;
}

export interface StrapiBlock {
  type: string;
  children?: Array<{ type: string; text?: string }>;
  [key: string]: unknown;
}

export interface StrapiResponse<T> {
  data: T | T[] | null;
  meta?: StrapiMeta;
  error?: { message: string };
}

// ---------------------------------------------------------------------------
// Block types ported from the production block system
// ---------------------------------------------------------------------------

export interface StrapiBlockSubpageHero {
  __component: 'blocks.subpage-hero';
  anchorId?: string | null;
  title: string;
  subtitle?: string | null;
  image?: StrapiImage | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
}

/** Adoption card (used inside AnimalAdoptionGrid) */

export interface StrapiBlockTertiaryHero {
  __component: 'blocks.tertiary-hero';
  anchorId?: string | null;
  title: string;
  subtitle?: string | null;
  image?: StrapiImage | null;
}

/** Page block: Event type card (used inside EventTypeGrid) */

export interface StrapiBlockCtaPanel {
  id?: number;
  title: string;
  body?: StrapiBlock[] | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
}

/** Page block: Split CTA */
export interface StrapiBlockSplitCta {
  __component: 'blocks.split-cta';
  anchorId?: string | null;
  backgroundColor?: 'primary' | 'surface' | 'ink' | 'highlight' | null;
  heading?: string | null;
  description?: StrapiBlock[] | null;
  panels?: StrapiBlockCtaPanel[] | null;
}

/** Page block: Icon Grid */

export interface StrapiGalleryImage {
  id?: number;
  image?: StrapiImage | null;
  linkUrl?: string | null;
  linkLabel?: string | null;
}

/** Page block: Photo Gallery */
export interface StrapiBlockPhotoGallery {
  __component: 'blocks.photo-gallery';
  anchorId?: string | null;
  variant?: 'default' | 'grid' | null;
  heading?: string | null;
  description?: StrapiBlock[] | null;
  galleryImages?: StrapiGalleryImage[] | null;
}

/** Page block: Content + Image */
export interface StrapiBlockContentImage {
  __component: 'blocks.content-image';
  anchorId?: string | null;
  heading?: string | null;
  body?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  secondaryButtonText?: string | null;
  secondaryButtonUrl?: string | null;
  image?: StrapiImage | null;
  imagePosition?: 'left' | 'right' | null;
  imageObjectFit?: 'cover' | 'contain' | null;
}

export interface StrapiQuickLinkCard {
  id?: number;
  title: string;
  url: string;
  image?: StrapiImage | null;
}

export interface StrapiBlockImageLinkGrid {
  __component: 'blocks.quick-links-grid';
  anchorId?: string | null;
  id?: number;
  cards?: StrapiQuickLinkCard[] | null;
}


export interface StrapiBlockInfoBar {
  __component: 'blocks.info-bar';
  anchorId?: string | null;
  id?: number;
  text: string;
  floatingText?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
}


export interface StrapiHeroSlide {
  id?: number;
  image: StrapiImage;
  heading: string;
  ctaText?: string | null;
  ctaUrl?: string | null;
}

export interface StrapiBlockHeroCarousel {
  __component: 'blocks.homepage-hero';
  anchorId?: string | null;
  id?: number;
  slides?: StrapiHeroSlide[] | null;
}


export interface StrapiPriorityCard {
  id?: number;
  title: string;
  body: StrapiBlock[] | null;
}

export interface StrapiLeadershipMember {
  id?: number;
  name: string;
  role: string;
  bio?: string | null;
  image?: StrapiImage | null;
  linkedinUrl?: string | null;
}

export interface StrapiBlockProfileCarousel {
  __component: 'blocks.leadership-grid';
  anchorId?: string | null;
  id?: number;
  heading?: string | null;
  description?: string | null;
  members?: StrapiLeadershipMember[] | null;
}

export interface StrapiBoardMember {
  id?: number;
  name: string;
  organization?: string | null;
}

export interface StrapiBoardSection {
  id?: number;
  title: string;
  members?: StrapiBoardMember[] | null;
}

export interface StrapiBlockNameList {
  __component: 'blocks.board-of-directors';
  anchorId?: string | null;
  id?: number;
  heading?: string | null;
  description?: string | null;
  sections?: StrapiBoardSection[] | null;
}


export interface StrapiBlockFeaturePriority {
  __component: 'blocks.mission-priorities';
  anchorId?: string | null;
  id?: number;
  image?: StrapiImage | null;
  missionHeading?: string | null;
  missionBody?: string | null;
  sectionHeading?: string | null;
  priorities?: StrapiPriorityCard[] | null;
}


export interface StrapiBlockTwoColumnContent {
  __component: 'blocks.two-column-content';
  anchorId?: string | null;
  id?: number;
  variant?: 'default' | 'text-links' | null;
  leftHeading?: string | null;
  leftBody?: StrapiBlock[] | null;
  leftButtonPrimaryText?: string | null;
  leftButtonPrimaryUrl?: string | null;
  leftButtonSecondaryText?: string | null;
  leftButtonSecondaryUrl?: string | null;
  rightHeading?: string | null;
  rightBody?: StrapiBlock[] | null;
  rightButtonPrimaryText?: string | null;
  rightButtonPrimaryUrl?: string | null;
  rightButtonSecondaryText?: string | null;
  rightButtonSecondaryUrl?: string | null;
  image?: StrapiImage | null;
}


export interface StrapiMediaCard {
  id?: number;
  title: string;
  body?: string | null;
  image?: StrapiImage | null;
  linkUrl?: string | null;
}

export interface StrapiBlockMediaCards {
  __component: 'blocks.media-cards';
  anchorId?: string | null;
  id?: number;
  cards?: StrapiMediaCard[] | null;
}


export interface StrapiBlockFeaturedEvents {
  __component: 'blocks.featured-events';
  anchorId?: string | null;
  id?: number;
  heading?: string | null;
  limit?: number | null;
}

export interface StrapiBlockFeaturedBlogPosts {
  __component: 'blocks.featured-blog-posts';
  anchorId?: string | null;
  id?: number;
  heading?: string | null;
  description?: string | null;
  limit?: number | null;
  contentType?: 'blog' | 'press-release' | null;
}

export interface StrapiBlockRecentBlogPosts {
  __component: 'blocks.recent-blog-posts';
  anchorId?: string | null;
  id?: number;
  heading?: string | null;
  description?: string | null;
  postsPerPage?: number | null;
  contentType?: 'blog' | 'press-release' | null;
}


export interface StrapiBlockEvents {
  __component: 'blocks.upcoming-events';
  anchorId?: string | null;
  id?: number;
  variant?: 'homepage' | 'events' | null;
  heading?: string | null;
  description?: StrapiBlock[] | string | null;
  limit?: number | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
}

export interface StrapiBlockSplitPanel {
  __component: 'blocks.split-panel';
  anchorId?: string | null;
  id?: number;
  heading: string;
  body?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  image?: StrapiImage | null;
  videoAutoplay?: boolean | null;
  bgColor?: 'primary' | 'secondary' | 'accent' | 'ink' | null;
  imagePosition?: 'left' | 'right' | null;
}


export interface StrapiBlockFeaturedCarouselSlide {
  id?: number;
  image: StrapiImage;
  heading: string;
  body?: string | null;
  linkUrl?: string | null;
}

export interface StrapiBlockFeaturedCarousel {
  __component: 'blocks.featured-carousel';
  anchorId?: string | null;
  id?: number;
  slides?: StrapiBlockFeaturedCarouselSlide[] | null;
}


export interface StrapiStatItem {
  id?: number;
  value: string;
  label: string;
}

export interface StrapiProgramCard {
  id?: number;
  title: string;
  description?: string | null;
  linkText?: string | null;
  linkUrl?: string | null;
  image?: StrapiImage | null;
}

export interface StrapiBlockContentCardGrid {
  __component: 'blocks.content-card-grid';
  anchorId?: string | null;
  id?: number;
  backgroundColor?: 'primary' | 'surface' | 'ink' | 'highlight' | null;
  cardBackgroundColor?: 'highlight' | 'surface' | 'primary' | 'ink' | null;
  heading?: string | null;
  description?: string | null;
  programs?: StrapiProgramCard[] | null;
}

export interface StrapiBlockCarouselSection {
  __component: 'blocks.carousel-section';
  anchorId?: string | null;
  id?: number;
  heading?: string | null;
  description?: string | null;
  programs?: StrapiProgramCard[] | null;
}


export interface StrapiContactPanel {
  id?: number;
  title: string;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
}

/** Page block: Contact Panels */
export interface StrapiBlockContactPanels {
  __component: 'blocks.contact-panels';
  anchorId?: string | null;
  id?: number;
  heading?: string | null;
  panels?: StrapiContactPanel[] | null;
}

/** Contact entry within an accordion item */

export interface StrapiContactInfoItem {
  id?: number;
  title: string;
  body?: string | StrapiBlock[] | null;
}

/** Page block: Contact Info */
export interface StrapiBlockContactInfo {
  __component: 'blocks.contact-info';
  anchorId?: string | null;
  id?: number;
  heading?: string | null;
  items?: StrapiContactInfoItem[] | null;
}

/** Pricing tier card (used inside MembershipPricing) */
export interface StrapiPricingTier {
  id?: number;
  tierName: string;
  subtitle?: string | null;
  description?: string | null;
  price: string;
  period?: string | null;
  linkUrl?: string | null;
}

/** Page block: Membership Pricing */
export interface StrapiBlockMembershipPricing {
  __component: 'blocks.membership-pricing';
  anchorId?: string | null;
  id?: number;
  heading?: string | null;
  description?: string | null;
  tiers?: StrapiPricingTier[] | null;
  footerContent?: string | null;
}

export interface StrapiBlockEventCalendar {
  __component: 'blocks.event-calendar';
  anchorId?: string | null;
  id?: number;
}

export interface StrapiBlockContactForm {
  __component: 'blocks.contact-form';
  anchorId?: string | null;
  id?: number;
  heading?: string | null;
  description?: string | null;
  form?: StrapiForm | null;
  mapEmbedUrl?: string | null;
}


export interface StrapiBlockCtaBanner {
  __component: 'blocks.cta-banner';
  anchorId?: string | null;
  id?: number;
  heading?: string | null;
  body?: StrapiBlock[] | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  backgroundColor?: 'primary' | 'accent' | 'secondary' | 'ink' | 'highlight' | null;
}

export interface StrapiBlockStatement {
  __component: 'blocks.statement';
  anchorId?: string | null;
  id?: number;
  heading?: string | null;
  body?: string | null;
}

export interface StrapiBlockEmbedSection {
  __component: 'blocks.embed-section';
  anchorId?: string | null;
  id?: number;
  heading?: string | null;
  embedCode?: string | null;
  description?: string | null;
}

export interface StrapiBlockOverlayPair {
  __component: 'blocks.promo-cards';
  anchorId?: string | null;
  id?: number;
  leftHeading?: string | null;
  leftBody?: string | null;
  leftLinkUrl?: string | null;
  leftImage?: StrapiImage | null;
  rightHeading?: string | null;
  rightBody?: string | null;
  rightLinkUrl?: string | null;
  rightImage?: StrapiImage | null;
  headingLevel?: 'h2' | 'h3' | null;
}


export type StrapiBlockHomepageHero = StrapiBlockHeroCarousel;
export type StrapiBlockQuickLinksGrid = StrapiBlockImageLinkGrid;
export type StrapiBlockUpcomingEvents = StrapiBlockEvents;

// -----------------------------------------------------------------------------
// Header / Footer Options (single types)
// -----------------------------------------------------------------------------

export interface StrapiFooterLink {
  label: string;
  url?: string | null;
  page?: { slug: string } | null;
  openInNewTab?: boolean;
}

export interface StrapiFooterColumn {
  id?: number;
  title: string;
  url?: string | null;
  page?: { slug: string } | null;
  openInNewTab?: boolean;
  links?: StrapiFooterLink[] | null;
}

export interface StrapiPartnerLogo {
  id?: number;
  image: StrapiImage;
  altText?: string | null;
  linkUrl?: string | null;
}

export interface StrapiHeaderOptions {
  documentId?: string;
  logo?: StrapiImage | null;
  ctaUrl?: string | null;
  ctaLabel?: string | null;
  publishedAt?: string | null;
  updatedAt?: string;
}

export interface StrapiFooterOptions {
  documentId?: string;
  footerLogo?: StrapiImage | null;
  siteHours?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  social?: StrapiThemeOptionSocial | null;
  newsletterHeading?: string | null;
  newsletterDescription?: string | null;
  newsletterProvider?: 'none' | 'mailchimp' | 'constantContact' | null;
  newsletterActionUrl?: string | null;
  footerLegalText?: string | null;
  footerColumns?: StrapiFooterColumn[] | null;
  partnerLogos?: StrapiPartnerLogo[] | null;
  copyrightText?: string | null;
  publishedAt?: string | null;
  updatedAt?: string;
}
