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

export interface StrapiPage {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  content?: string | StrapiBlock[] | null;
  quickLinks?: StrapiQuickLink[] | null;
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
