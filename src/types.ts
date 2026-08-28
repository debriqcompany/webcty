export type Language = 'vi' | 'en';

export interface BilingualText {
  vi: string;
  en: string;
}

export interface SeoMetadata {
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalSlug?: string;
}

export interface ContentBlockImage {
  id?: string;
  url: string;
  caption?: string | BilingualText;
  alt?: string;
  title?: string;
}

export type ContentBlockType = 
  | 'heading' 
  | 'paragraph' 
  | 'quote' 
  | 'image' 
  | 'gallery' 
  | 'two_column_image' 
  | 'bullet_list' 
  | 'numbered_list' 
  | 'divider' 
  | 'callout' 
  | 'tech_box';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  level?: 2 | 3;
  content?: string | BilingualText;
  caption?: string | BilingualText;
  src?: string;
  alt?: string;
  alignment?: 'center' | 'left' | 'right' | 'full';
  images?: ContentBlockImage[];
  items?: Array<string | BilingualText>;
  title?: string | BilingualText;
}

export interface ProjectImage {
  id: string;
  url: string;
  caption?: string | BilingualText;
  type: 'hero' | 'site' | 'drawing' | 'bim' | 'rendering' | 'Shopdrawing' | string;
  alt?: string;
}

export interface Project {
  id: string;
  slug: string;
  name: BilingualText;
  subtitle?: BilingualText;
  category?: string;
  directClient: string;
  clientRelationship?: string; // "Khách hàng trực tiếp" | "Tổng thầu" | "Chủ đầu tư" | "Đối tác thi công" | "Đơn vị liên quan"
  projectOwner?: string; // Developer / Chủ đầu tư
  mainContractor?: string; // Tổng thầu
  period: string; // e.g. "2025–2026"
  startYear?: string;
  endYear?: string;
  location?: string | BilingualText;
  scale: BilingualText;
  scaleMetric?: string; // e.g. "550,000 tấn/năm", "117.4 ha", "40,980 m²"
  status?: 'completed' | 'in_progress' | 'concept' | string;
  services: string[]; // e.g. ["Shopdrawing kết cấu", "Shopdrawing hoàn thiện"]
  scope: BilingualText;
  scopeDetails?: {
    structural?: BilingualText;
    finishing?: BilingualText;
    infrastructure?: BilingualText;
  };
  shortSummary?: BilingualText;
  projectDescription?: BilingualText;
  highlights: BilingualText[];
  technicalOverview?: BilingualText;
  drawingType?: 'vector' | 'custom_image';
  drawingImageUrl?: string;
  drawingCaption?: BilingualText;
  heroImage: string;
  thumbnailImage?: string;
  gallery: ProjectImage[];
  contentBlocks?: ContentBlock[];
  seo?: SeoMetadata;
  featured: boolean;
  published: boolean;
  sortOrder?: number;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: BilingualText;
  subtitle?: BilingualText;
  excerpt: BilingualText;
  category: string;
  tags?: string[];
  coverImage?: string;
  heroImage?: string;
  author?: string;
  readingTimeMinutes?: number;
  publishedAt?: string;
  featured?: boolean;
  published: boolean;
  contentHtml?: BilingualText | string;
  contentBlocks?: ContentBlock[];
  seo?: SeoMetadata;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  category?: 'projects' | 'articles' | 'blueprints' | 'general' | string;
  altText?: string;
  caption?: string;
  sizeBytes?: number;
  mimeType?: string;
  createdAt?: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: BilingualText;
  subtitle?: BilingualText;
  shortDesc?: BilingualText;
  fullDesc?: BilingualText;
  description?: BilingualText;
  deliverables: BilingualText[] | { vi: string[]; en: string[] };
  methodologies?: BilingualText[];
  tools?: string[];
  toolsUsed?: string[];
  icon?: string;
  visualType?: 'structural' | 'finishing' | 'bim' | 'method';
  featured?: boolean;
  published?: boolean;
  sortOrder?: number;
  order?: number;
}

export interface Partner {
  id: string;
  name: string;
  roleType?: 'direct_client' | 'main_contractor' | 'project_owner' | 'ecosystem' | string;
  relationshipType?: string; // "Khách hàng trực tiếp" | "Đối tác" | "Tổng thầu" | "Đơn vị liên quan" | "Chủ đầu tư"
  roleLabel: BilingualText;
  logoText: string;
  logoUrl?: string;
  description?: BilingualText;
  projectRefs?: string[];
  website?: string;
  featured?: boolean;
  published?: boolean;
  active?: boolean;
  sortOrder?: number;
  order?: number;
}

export interface PageSection {
  id: string;
  title: BilingualText;
  subtitle?: BilingualText;
  headline?: BilingualText;
  body?: BilingualText;
  contentBlocks?: ContentBlock[];
  ctaText?: BilingualText;
  ctaLink?: string;
  secondaryCtaText?: BilingualText;
  secondaryCtaLink?: string;
  extraData?: Record<string, any>;
  visible?: boolean;
}

export interface PageContent {
  id?: string;
  key?: string;
  slug?: string;
  title?: BilingualText;
  metaDescription?: BilingualText;
  sections?: Record<string, PageSection>;
  contentBlocks?: ContentBlock[];
  seo?: SeoMetadata;
  updatedAt?: string;
}

export interface CompanySettings {
  brandName?: string;
  legalName?: string;
  companyName?: string;
  displayName?: string;
  tagline?: string;
  logoUrl?: string;          // Header logo (square or rectangle)
  footerLogoUrl?: string;    // Footer logo
  faviconUrl?: string;       // Favicon icon (.svg, .png, .ico)
  ogImageUrl?: string;       // Social Share link preview image (1200x630px)
  ogTitle?: string;          // Social Share Title
  ogDescription?: string;    // Social Share Description

  // Floating Quick Contact / Zalo
  floatingZaloEnabled?: boolean;
  zaloUrl?: string;          // Boss's Zalo link or phone e.g. https://zalo.me/090...
  zaloLabel?: BilingualText | string;

  // Promotional / Notice Popup Modal
  popupEnabled?: boolean;
  popupDelaySeconds?: number;
  popupShowOnce?: boolean;
  popupTitle?: BilingualText;
  popupDescription?: BilingualText;
  popupImageUrl?: string;
  popupCtaText?: BilingualText;
  popupCtaLink?: string;

  foundedYear?: string;
  activeSince?: string;
  activeStatement?: BilingualText;
  hotline: string;
  zalo: string;
  email: string;
  address: string;
  engineersCount?: string;
  teamCount?: string;
  collaboratorCount?: string;
  collaboratorsCount?: string;
  tools?: string[];
  workingPrinciples?: BilingualText[];
  primaryColor?: string; // Brand accent hex color e.g. #F27D26
}

export interface InquirySubmission {
  id: string;
  type: 'quote' | 'engineer_network' | 'candidate' | 'general' | 'contact';
  fullName: string;
  company?: string;
  email?: string;
  phone?: string;
  serviceInterest?: string;
  specialization?: string[];
  discipline?: string;
  experienceYears?: string;
  softwareSkills?: string | string[];
  portfolioUrl?: string;
  experienceSummary?: string;
  projectScale?: string;
  message?: string;
  subject?: string;
  status?: 'new' | 'contacted' | 'reviewed' | 'archived';
  createdAt: string;
}

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  url?: string;
  path: string;
  size?: number;
  mimeType?: string;
  category?: 'projects' | 'services' | 'general' | 'drawings' | 'partners' | 'articles';
  altText?: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

