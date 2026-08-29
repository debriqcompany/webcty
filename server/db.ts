import fs from 'fs';
import path from 'path';
import { Project, ServiceItem, Partner, PageContent, CompanySettings, InquirySubmission, MediaFile, Article } from '../src/types';
import { initialCompanySettings, initialServices, initialProjects, initialPartners, initialPages } from './seedData';
import { hashPassword } from './auth';
import { DATA_DIR, DATABASE_FILENAME, UPLOAD_DIR } from './config';
import { firestore } from './firebase';

export interface DatabaseSchema {
  projects: Project[];
  articles: Article[];
  services: ServiceItem[];
  partners: Partner[];
  pages: Record<string, PageContent>;
  settings: CompanySettings;
  inquiries: InquirySubmission[];
  media: MediaFile[];
  users: Array<{ id: string; email: string; passwordHash: string; name: string }>;
}

// Configurable storage paths via Environment Variables
const DB_FILE = path.join(DATA_DIR, DATABASE_FILENAME);
const UPLOADS_DIR = UPLOAD_DIR;

// Ensure storage directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// In-memory cache synced to JSON filesystem & Firestore
let db: DatabaseSchema = {
  projects: [],
  articles: [],
  services: [],
  partners: [],
  pages: {},
  settings: initialCompanySettings,
  inquiries: [],
  media: [],
  users: []
};

let firestoreConnected = false;

/**
 * Persist database state to disk safely as backup
 */
export function saveDb(): void {
  try {
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    const data = JSON.stringify(db, null, 2);
    fs.writeFileSync(tempFile, data, 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('[Database Error] Failed to write database to disk:', err);
  }
}

/**
 * Async Helper to write to Firestore with error resilience
 */
async function syncToFirestore(collection: string, docId: string, data: any) {
  try {
    if (!firestore) return;
    await firestore.collection(collection).doc(docId).set(data, { merge: true });
  } catch (err: any) {
    console.warn(`[Firestore Sync Warning] Failed to sync doc ${docId} in ${collection}:`, err.message || err);
  }
}

/**
 * Async Helper to delete from Firestore
 */
async function deleteFromFirestore(collection: string, docId: string) {
  try {
    if (!firestore) return;
    await firestore.collection(collection).doc(docId).delete();
  } catch (err: any) {
    console.warn(`[Firestore Delete Warning] Failed to delete doc ${docId} in ${collection}:`, err.message || err);
  }
}

/**
 * Migrate all local data to Firestore if Firestore collections are empty
 */
async function migrateToFirestoreIfEmpty() {
  try {
    const projSnapshot = await firestore.collection('projects').limit(1).get();
    if (projSnapshot.empty) {
      console.log('[Firestore] Firestore collections empty. Migrating local database to Firestore...');
      
      // Batch migrate projects
      for (const p of db.projects || []) {
        await firestore.collection('projects').doc(p.id).set(p);
      }
      // Batch migrate articles
      for (const a of db.articles || []) {
        await firestore.collection('articles').doc(a.id).set(a);
      }
      // Batch migrate services
      for (const s of db.services || []) {
        await firestore.collection('services').doc(s.id).set(s);
      }
      // Batch migrate partners
      for (const pt of db.partners || []) {
        await firestore.collection('partners').doc(pt.id).set(pt);
      }
      // Batch migrate pages
      for (const [k, pg] of Object.entries(db.pages || {})) {
        await firestore.collection('pages').doc(k).set(pg);
      }
      // Settings
      if (db.settings) {
        await firestore.collection('settings').doc('company').set(db.settings);
      }
      // Users
      for (const u of db.users || []) {
        await firestore.collection('users').doc(u.id).set(u);
      }
      // Inquiries
      for (const inq of db.inquiries || []) {
        await firestore.collection('inquiries').doc(inq.id).set(inq);
      }
      console.log('[Firestore] Migration to Cloud Firestore completed successfully!');
    } else {
      console.log('[Firestore] Cloud Firestore already populated. Hydrating cache from Firestore...');
      // Pull latest from Firestore
      const projSnap = await firestore.collection('projects').get();
      if (!projSnap.empty) {
        db.projects = projSnap.docs.map(d => d.data() as Project);
      }
      const artSnap = await firestore.collection('articles').get();
      if (!artSnap.empty) {
        db.articles = artSnap.docs.map(d => d.data() as Article);
      }
      const srvSnap = await firestore.collection('services').get();
      if (!srvSnap.empty) {
        db.services = srvSnap.docs.map(d => d.data() as ServiceItem);
      }
      const ptnSnap = await firestore.collection('partners').get();
      if (!ptnSnap.empty) {
        db.partners = ptnSnap.docs.map(d => d.data() as Partner);
      }
      const inqSnap = await firestore.collection('inquiries').get();
      if (!inqSnap.empty) {
        db.inquiries = inqSnap.docs.map(d => d.data() as InquirySubmission);
      }
      const settSnap = await firestore.collection('settings').doc('company').get();
      if (settSnap.exists) {
        db.settings = settSnap.data() as CompanySettings;
      }
      const usrSnap = await firestore.collection('users').get();
      if (!usrSnap.empty) {
        db.users = usrSnap.docs.map(d => d.data() as any);
      }
      saveDb();
    }
    firestoreConnected = true;
  } catch (err: any) {
    console.warn('[Firestore] Notice: Firestore sync operating in resilient mode:', err.message || err);
  }
}

/**
 * Initialize Database on server startup
 */
export function initDb(): void {
  const adminEmail = (process.env.ADMIN_EMAIL || 'debriqcompany@gmail.com').trim().toLowerCase();
  const envAdminPass = process.env.ADMIN_PASSWORD || '123456789';

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(content);
      if (!db.articles) db.articles = [];
      if (!db.partners) db.partners = [];
      if (!db.media) db.media = [];
      if (!db.projects) db.projects = [];
      if (!db.services) db.services = [];
      if (!db.inquiries) db.inquiries = [];
      if (!db.pages) db.pages = {};
      console.log(`[Database] Loaded local database with ${db.projects?.length || 0} projects, ${db.partners?.length || 0} partners.`);
    } catch (err) {
      console.error('[Database Error] Failed to parse existing database file. Seeding fresh...', err);
      seedFresh(adminEmail, envAdminPass);
    }
  } else {
    console.log('[Database] Database file not found. Seeding initial DEBRIQ database...');
    seedFresh(adminEmail, envAdminPass);
  }

  // Ensure an admin user is present
  if (!db.users || db.users.length === 0) {
    db.users = [
      {
        id: 'admin-1',
        email: adminEmail,
        passwordHash: hashPassword(envAdminPass),
        name: 'DEBRIQ Technical Administrator'
      }
    ];
    saveDb();
  }

  // Attempt Firestore sync & migration asynchronously
  migrateToFirestoreIfEmpty().catch(err => {
    console.warn('[Firestore Init] Working in fallback mode:', err.message);
  });
}

function seedFresh(adminEmail: string, adminPass?: string) {
  const initialPass = adminPass || '123456789';
  db = {
    projects: initialProjects,
    articles: [
      {
        id: 'art-1',
        slug: 'kiem-soat-xung-dot-cot-thep-va-nhip-do-be-tong',
        title: {
          vi: 'Kiểm soát xung đột cốt thép dầm cột và nhịp điệu đổ bê tông tại công trường',
          en: 'Managing Beam-Column Rebar Congestion & Pour Cycles on Site'
        },
        subtitle: {
          vi: 'Kinh nghiệm xử lý hồ sơ Shopdrawing thực tế cho các nút khung mật độ thép cao',
          en: 'Field-tested shopdrawing methodology for high-density structural joints'
        },
        excerpt: {
          vi: 'Phân tích các phương án xử lý nút giao dầm cột, neo nối thép theo TCVN 5574:2018 và kinh nghiệm phối hợp giữa bộ phận Shopdrawing với Ban chỉ huy công trường.',
          en: 'Analysis of beam-column joint rebar detailing under TCVN 5574:2018 and coordination workflows with site engineers.'
        },
        category: 'Kỹ thuật Shopdrawing',
        tags: ['Kết cấu', 'TCVN 5574:2018', 'Cốt thép'],
        coverImage: '/placeholder-blueprint.svg',
        author: 'Ban Kỹ thuật DEBRIQ',
        publishedAt: '2026-02-15T08:00:00Z',
        featured: true,
        published: true,
        contentBlocks: [
          {
            id: 'blk-1',
            type: 'heading',
            level: 2,
            content: '1. Thách thức cốt thép tại các nút khung dầm cột nhà cao tầng'
          },
          {
            id: 'blk-2',
            type: 'paragraph',
            content: 'Tại các công trình cao tầng có tải trọng động đất và gió lớn, mật độ cốt thép tại các nút khung dầm cột thường rất dày đặc. Nếu chỉ triển khai bản vẽ 2D theo sơ đồ thiết kế cơ sở mà không mô phỏng chi tiết va chạm, nhà thầu sẽ gặp khó khăn rất lớn khi lắp dựng thép và đổ bê tông, dẫn đến rỗ tổ ong hoặc sai lệch cao độ lớp bảo vệ.'
          },
          {
            id: 'blk-3',
            type: 'callout',
            title: 'Quy tắc vàng của DEBRIQ',
            content: 'Luôn xác định thứ tự ưu tiên luồn thép dầm chính - dầm phụ - cốt đai cột và kiểm tra khoảng cách thông thủy tối thiểu theo tiêu chuẩn trước khi xuất bản vẽ thi công.'
          }
        ],
        createdAt: '2026-02-15T08:00:00Z',
        updatedAt: '2026-02-15T08:00:00Z'
      }
    ],
    services: initialServices,
    partners: initialPartners,
    pages: initialPages,
    settings: initialCompanySettings,
    inquiries: [],
    media: [],
    users: [
      {
        id: 'admin-1',
        email: adminEmail,
        passwordHash: hashPassword(initialPass),
        name: 'DEBRIQ Technical Administrator'
      }
    ]
  };
  saveDb();
}

/* =========================================================================
   PROJECT OPERATIONS
   ========================================================================= */
export const dbProjects = {
  getAll: (filter?: { publishedOnly?: boolean; service?: string; featuredOnly?: boolean }) => {
    let result = [...(db.projects || [])];
    if (filter?.publishedOnly) {
      result = result.filter(p => p.published);
    }
    if (filter?.featuredOnly) {
      result = result.filter(p => p.featured);
    }
    if (filter?.service) {
      result = result.filter(p => p.services && p.services.includes(filter.service!));
    }
    return result.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  },
  getBySlug: (slug: string) => {
    return db.projects?.find(p => p.slug === slug);
  },
  getById: (id: string) => {
    return db.projects?.find(p => p.id === id);
  },
  create: (data: Partial<Project>) => {
    const newProject: Project = {
      id: `prj-${Date.now()}`,
      slug: data.slug || `project-${Date.now()}`,
      name: data.name || { vi: 'Dự án mới', en: 'New Project' },
      subtitle: data.subtitle,
      directClient: data.directClient || 'Khách hàng',
      clientRelationship: data.clientRelationship || 'Khách hàng trực tiếp',
      projectOwner: data.projectOwner,
      mainContractor: data.mainContractor,
      period: data.period || '2026',
      startYear: data.startYear,
      endYear: data.endYear,
      location: data.location,
      status: data.status || 'in_progress',
      services: data.services || ['Shopdrawing kết cấu'],
      scope: data.scope || { vi: 'Phạm vi triển khai...', en: 'Scope of work...' },
      scopeDetails: data.scopeDetails,
      scale: data.scale || { vi: 'Quy mô công trình...', en: 'Project scale...' },
      scaleMetric: data.scaleMetric,
      shortSummary: data.shortSummary,
      projectDescription: data.projectDescription,
      highlights: data.highlights || [],
      technicalOverview: data.technicalOverview,
      heroImage: data.heroImage || '/placeholder-blueprint.svg',
      thumbnailImage: data.thumbnailImage || data.heroImage || '/placeholder-blueprint.svg',
      gallery: data.gallery || [],
      contentBlocks: data.contentBlocks || [],
      seo: data.seo || {
        metaTitle: typeof data.name === 'object' ? data.name.vi : 'Dự án DEBRIQ',
        metaDescription: typeof data.scope === 'object' ? data.scope.vi : ''
      },
      featured: Boolean(data.featured),
      published: data.published !== undefined ? data.published : true,
      sortOrder: data.sortOrder || (db.projects?.length || 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (!db.projects) db.projects = [];
    db.projects.push(newProject);
    saveDb();
    syncToFirestore('projects', newProject.id, newProject);
    return newProject;
  },
  update: (id: string, data: Partial<Project>) => {
    if (!db.projects) return null;
    const idx = db.projects.findIndex(p => p.id === id);
    if (idx === -1) return null;
    db.projects[idx] = {
      ...db.projects[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };
    saveDb();
    syncToFirestore('projects', id, db.projects[idx]);
    return db.projects[idx];
  },
  delete: (id: string) => {
    if (!db.projects) return false;
    const initialLen = db.projects.length;
    db.projects = db.projects.filter(p => p.id !== id);
    saveDb();
    deleteFromFirestore('projects', id);
    return db.projects.length < initialLen;
  }
};

/* =========================================================================
   ARTICLES / INSIGHTS OPERATIONS
   ========================================================================= */
export const dbArticles = {
  getAll: (filter?: { publishedOnly?: boolean; category?: string; featuredOnly?: boolean }) => {
    let result = [...(db.articles || [])];
    if (filter?.publishedOnly) {
      result = result.filter(a => a.published);
    }
    if (filter?.featuredOnly) {
      result = result.filter(a => a.featured);
    }
    if (filter?.category) {
      result = result.filter(a => a.category === filter.category);
    }
    return result.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
  },
  getBySlug: (slug: string) => {
    return db.articles?.find(a => a.slug === slug);
  },
  getById: (id: string) => {
    return db.articles?.find(a => a.id === id);
  },
  create: (data: Partial<Article>) => {
    const newArticle: Article = {
      id: `art-${Date.now()}`,
      slug: data.slug || `article-${Date.now()}`,
      title: data.title || { vi: 'Bài viết mới', en: 'New Article' },
      subtitle: data.subtitle,
      excerpt: data.excerpt || { vi: 'Tóm tắt bài viết...', en: 'Article summary...' },
      category: data.category || 'Kỹ thuật Shopdrawing',
      tags: data.tags || ['Shopdrawing'],
      coverImage: data.coverImage || '/placeholder-blueprint.svg',
      author: data.author || 'Ban Kỹ thuật DEBRIQ',
      publishedAt: data.publishedAt || new Date().toISOString(),
      featured: Boolean(data.featured),
      published: data.published !== undefined ? data.published : true,
      contentBlocks: data.contentBlocks || [],
      seo: data.seo || {
        metaTitle: typeof data.title === 'object' ? data.title.vi : 'Bài viết DEBRIQ',
        metaDescription: typeof data.excerpt === 'object' ? data.excerpt.vi : ''
      },
      sortOrder: data.sortOrder || (db.articles?.length || 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (!db.articles) db.articles = [];
    db.articles.push(newArticle);
    saveDb();
    syncToFirestore('articles', newArticle.id, newArticle);
    return newArticle;
  },
  update: (id: string, data: Partial<Article>) => {
    if (!db.articles) return null;
    const idx = db.articles.findIndex(a => a.id === id);
    if (idx === -1) return null;
    db.articles[idx] = {
      ...db.articles[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };
    saveDb();
    syncToFirestore('articles', id, db.articles[idx]);
    return db.articles[idx];
  },
  delete: (id: string) => {
    if (!db.articles) return false;
    const initialLen = db.articles.length;
    db.articles = db.articles.filter(a => a.id !== id);
    saveDb();
    deleteFromFirestore('articles', id);
    return db.articles.length < initialLen;
  }
};

/* =========================================================================
   SERVICES OPERATIONS
   ========================================================================= */
export const dbServices = {
  getAll: () => {
    return [...(db.services || [])].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  },
  getById: (id: string) => {
    return db.services?.find(s => s.id === id);
  },
  create: (data: Partial<ServiceItem>) => {
    const newService: ServiceItem = {
      id: data.id || `svc-${Date.now()}`,
      slug: data.slug || `service-${Date.now()}`,
      title: data.title || { vi: 'Dịch vụ mới', en: 'New Service' },
      subtitle: data.subtitle,
      shortDesc: data.shortDesc,
      description: data.description || { vi: '', en: '' },
      deliverables: data.deliverables || [],
      methodologies: data.methodologies || [],
      tools: data.tools || ['AutoCAD', 'Revit'],
      toolsUsed: data.toolsUsed || ['AutoCAD', 'Revit'],
      visualType: data.visualType || 'structural',
      featured: data.featured !== undefined ? data.featured : true,
      published: data.published !== undefined ? data.published : true,
      sortOrder: data.sortOrder || (db.services?.length || 0) + 1
    };
    if (!db.services) db.services = [];
    db.services.push(newService);
    saveDb();
    syncToFirestore('services', newService.id, newService);
    return newService;
  },
  update: (id: string, data: Partial<ServiceItem>) => {
    if (!db.services) return null;
    const idx = db.services.findIndex(s => s.id === id);
    if (idx === -1) return null;
    db.services[idx] = {
      ...db.services[idx],
      ...data
    };
    saveDb();
    syncToFirestore('services', id, db.services[idx]);
    return db.services[idx];
  },
  delete: (id: string) => {
    if (!db.services) return false;
    const initialLen = db.services.length;
    db.services = db.services.filter(s => s.id !== id);
    saveDb();
    deleteFromFirestore('services', id);
    return db.services.length < initialLen;
  }
};

/* =========================================================================
   PARTNERS OPERATIONS
   ========================================================================= */
export const dbPartners = {
  getAll: (filter?: { activeOnly?: boolean }) => {
    let result = [...(db.partners || [])];
    if (filter?.activeOnly) {
      result = result.filter(p => p.active !== false && p.published !== false);
    }
    return result.sort((a, b) => (a.sortOrder || a.order || 0) - (b.sortOrder || b.order || 0));
  },
  getById: (id: string) => {
    return db.partners?.find(p => p.id === id);
  },
  create: (data: Partial<Partner>) => {
    const newPartner: Partner = {
      id: `ptn-${Date.now()}`,
      name: data.name || 'Đối tác mới',
      roleType: data.roleType || 'direct_client',
      relationshipType: data.relationshipType || 'Khách hàng trực tiếp',
      roleLabel: data.roleLabel || { vi: 'Khách hàng trực tiếp', en: 'Direct Client' },
      logoText: data.logoText || data.name || 'PARTNER',
      logoUrl: data.logoUrl,
      description: data.description,
      projectRefs: data.projectRefs || [],
      website: data.website,
      featured: data.featured !== undefined ? data.featured : true,
      published: data.published !== undefined ? data.published : true,
      active: data.active !== undefined ? data.active : true,
      sortOrder: data.sortOrder || (db.partners?.length || 0) + 1
    };
    if (!db.partners) db.partners = [];
    db.partners.push(newPartner);
    saveDb();
    syncToFirestore('partners', newPartner.id, newPartner);
    return newPartner;
  },
  update: (id: string, data: Partial<Partner>) => {
    if (!db.partners) return null;
    const idx = db.partners.findIndex(p => p.id === id);
    if (idx === -1) return null;
    db.partners[idx] = {
      ...db.partners[idx],
      ...data
    };
    saveDb();
    syncToFirestore('partners', id, db.partners[idx]);
    return db.partners[idx];
  },
  reorder: (orderedIds: string[]) => {
    if (!db.partners) return [];
    orderedIds.forEach((id, index) => {
      const p = db.partners.find(item => item.id === id);
      if (p) {
        p.sortOrder = index + 1;
        p.order = index + 1;
        syncToFirestore('partners', id, p);
      }
    });
    saveDb();
    return dbPartners.getAll();
  },
  delete: (id: string) => {
    if (!db.partners) return false;
    db.partners = db.partners.filter(p => p.id !== id);
    saveDb();
    deleteFromFirestore('partners', id);
    return true;
  }
};

/* =========================================================================
   PAGES OPERATIONS
   ========================================================================= */
export const dbPages = {
  getAll: () => {
    return {
      ...initialPages,
      ...(db.pages || {})
    };
  },
  getByKey: (key: string) => {
    const defaultPage = initialPages[key];
    const userPage = db.pages?.[key];
    if (!userPage && !defaultPage) return null;
    return {
      ...(defaultPage || {}),
      ...(userPage || {})
    };
  },
  update: (key: string, data: Partial<PageContent>) => {
    if (!db.pages) db.pages = {};
    const defaultPage = initialPages[key] || {};
    const existing = db.pages[key] || defaultPage;
    db.pages[key] = {
      ...defaultPage,
      ...existing,
      ...data,
      id: `page-${key}`,
      key: key as any,
      slug: key,
      updatedAt: new Date().toISOString()
    };
    saveDb();
    syncToFirestore('pages', key, db.pages[key]);
    return db.pages[key];
  }
};

/* =========================================================================
   COMPANY SETTINGS
   ========================================================================= */
export const dbSettings = {
  get: () => db.settings || initialCompanySettings,
  update: (data: Partial<CompanySettings>) => {
    db.settings = {
      ...(db.settings || initialCompanySettings),
      ...data
    };
    saveDb();
    syncToFirestore('settings', 'company', db.settings);
    return db.settings;
  }
};

/* =========================================================================
   INQUIRIES / LEADS (QUOTE & ENGINEER CANDIDATES)
   ========================================================================= */
export const dbInquiries = {
  getAll: () => [...(db.inquiries || [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  create: (data: Partial<InquirySubmission>) => {
    const newInquiry: InquirySubmission = {
      id: `inq-${Date.now()}`,
      type: data.type || 'quote',
      fullName: data.fullName || 'Khách hàng / Ứng viên',
      company: data.company || '',
      email: data.email || '',
      phone: data.phone || '',
      serviceInterest: data.serviceInterest || '',
      discipline: (data as any).discipline || '',
      experienceYears: (data as any).experienceYears || '',
      softwareSkills: (data as any).softwareSkills || '',
      portfolioUrl: (data as any).portfolioUrl || '',
      experienceSummary: (data as any).experienceSummary || '',
      projectScale: data.projectScale || '',
      message: data.message || '',
      status: 'new',
      createdAt: new Date().toISOString()
    };
    if (!db.inquiries) db.inquiries = [];
    db.inquiries.unshift(newInquiry);
    saveDb();
    syncToFirestore('inquiries', newInquiry.id, newInquiry);
    console.log(`[Inquiries] New submission received (${newInquiry.type}) from: ${newInquiry.fullName}`);
    return newInquiry;
  },
  updateStatus: (id: string, status: InquirySubmission['status']) => {
    if (!db.inquiries) return null;
    const item = db.inquiries.find(i => i.id === id);
    if (!item) return null;
    item.status = status;
    saveDb();
    syncToFirestore('inquiries', id, item);
    return item;
  },
  delete: (id: string) => {
    if (!db.inquiries) return false;
    db.inquiries = db.inquiries.filter(i => i.id !== id);
    saveDb();
    deleteFromFirestore('inquiries', id);
    return true;
  }
};

/* =========================================================================
   MEDIA LIBRARY
   ========================================================================= */
export const dbMedia = {
  getAll: () => [...(db.media || [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  add: (file: Omit<MediaFile, 'id' | 'createdAt'>) => {
    const newMedia: MediaFile = {
      id: `med-${Date.now()}`,
      ...file,
      createdAt: new Date().toISOString()
    };
    if (!db.media) db.media = [];
    db.media.push(newMedia);
    saveDb();
    syncToFirestore('media', newMedia.id, newMedia);
    return newMedia;
  },
  updateAltText: (id: string, altText: string) => {
    if (!db.media) return null;
    const file = db.media.find(m => m.id === id);
    if (!file) return null;
    file.altText = altText;
    saveDb();
    syncToFirestore('media', id, file);
    return file;
  },
  delete: (id: string) => {
    if (!db.media) return false;
    const file = db.media.find(m => m.id === id);
    if (file && file.path && file.path.startsWith('/uploads/')) {
      try {
        const fullPath = path.resolve(process.cwd(), file.path.replace(/^\//, ''));
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch (err) {
        console.warn('[Media Warning] Failed to delete file on disk:', err);
      }
    }
    db.media = db.media.filter(m => m.id !== id);
    saveDb();
    deleteFromFirestore('media', id);
    return true;
  }
};

/* =========================================================================
   USER & CREDENTIAL OPERATIONS
   ========================================================================= */
export const dbUsers = {
  getAll: () => {
    if (!db.users) return [];
    return db.users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name || 'Quản trị viên',
      createdAt: (u as any).createdAt || new Date().toISOString()
    }));
  },
  getByEmail: (email: string) => {
    if (!db.users) return null;
    return db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  },
  getById: (id: string) => {
    if (!db.users) return null;
    return db.users.find(u => u.id === id);
  },
  create: (email: string, passwordPlain: string, name: string) => {
    if (!db.users) db.users = [];
    const cleanEmail = email.trim().toLowerCase();
    if (db.users.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('Email này đã tồn tại trong hệ thống.');
    }
    const newUser = {
      id: `admin-${Date.now()}`,
      email: cleanEmail,
      name: name.trim() || 'Quản trị viên',
      passwordHash: hashPassword(passwordPlain),
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    saveDb();
    syncToFirestore('users', newUser.id, newUser);
    return { id: newUser.id, email: newUser.email, name: newUser.name, createdAt: newUser.createdAt };
  },
  delete: (id: string): boolean => {
    if (!db.users) return false;
    if (db.users.length <= 1) {
      throw new Error('Không thể xóa tài khoản quản trị viên duy nhất của hệ thống.');
    }
    db.users = db.users.filter(u => u.id !== id);
    saveDb();
    deleteFromFirestore('users', id);
    return true;
  },
  updatePassword: (userId: string, newPasswordPlain: string): boolean => {
    if (!db.users || !newPasswordPlain) return false;
    const user = db.users.find(u => u.id === userId);
    if (!user) return false;
    user.passwordHash = hashPassword(newPasswordPlain);
    saveDb();
    syncToFirestore('users', userId, user);
    return true;
  },
  updateProfile: (userId: string, updates: { email?: string; name?: string }): boolean => {
    if (!db.users) return false;
    const user = db.users.find(u => u.id === userId);
    if (!user) return false;
    if (updates.email) user.email = updates.email.trim().toLowerCase();
    if (updates.name) user.name = updates.name.trim();
    saveDb();
    syncToFirestore('users', userId, user);
    return true;
  }
};
