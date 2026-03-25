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
  | StrapiBlockRow;

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
  /** react = SPA (client-side). static = pre-rendered HTML at build time. */
  frontendMode?: 'react' | 'static' | null;
  showBreadcrumbs?: boolean;
  blogPostsPerPage?: number;
  pressReleasesPerPage?: number;
  marker?: StrapiThemeOptionMarker | null;
  gtm?: StrapiThemeOptionGtm | null;
  social?: StrapiThemeOptionSocial | null;
  publishedAt?: string | null;
  updatedAt?: string;
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
