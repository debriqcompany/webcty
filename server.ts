import 'dotenv/config';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import {
  initDb,
  dbProjects,
  dbArticles,
  dbServices,
  dbPartners,
  dbPages,
  dbSettings,
  dbInquiries,
  dbMedia,
  dbUsers
} from './server/db';
import { verifyPassword, createSessionToken, validateSessionToken, revokeSession } from './server/auth';
import { uploadMiddleware, processAndSaveImage, UPLOAD_DIR_PATH } from './server/upload';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10) || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

if (IS_PRODUCTION && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.trim().length < 32)) {
  throw new Error('SESSION_SECRET must be set to at least 32 characters in production. See .env.example.');
}

// Initialize JSON database
initDb();

// Core Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Disable x-powered-by header for security
app.disable('x-powered-by');
app.set('trust proxy', 1);

// Serve uploaded media files statically from the VPS filesystem
app.use('/uploads', express.static(UPLOAD_DIR_PATH, {
  maxAge: IS_PRODUCTION ? '7d' : '0',
  immutable: IS_PRODUCTION,
  index: false
}));

// Admin Authentication Middleware
function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const token = req.cookies?.debriq_session || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  
  if (!token) {
    res.status(401).json({ error: 'Unauthorized: Session missing or required' });
    return;
  }
  
  const session = validateSessionToken(token);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
    return;
  }
  
  (req as any).user = session;
  next();
}

/* =========================================================================
   PUBLIC API ROUTES (Read-only for the public website)
   ========================================================================= */

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: IS_PRODUCTION ? 'production' : 'development',
    time: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// Bootstrap public data
app.get('/api/public/data', (req, res) => {
  try {
    const projects = dbProjects.getAll({ publishedOnly: true });
    const articles = dbArticles.getAll({ publishedOnly: true });
    const services = dbServices.getAll();
    const partners = dbPartners.getAll({ activeOnly: true });
    const pages = dbPages.getAll();
    const settings = dbSettings.get();
    res.json({ projects, articles, services, partners, pages, settings });
  } catch (err: any) {
    res.status(500).json({ error: IS_PRODUCTION ? 'Failed to fetch public data' : err.message });
  }
});

// Projects
app.get('/api/public/projects', (req, res) => {
  try {
    const service = req.query.service as string | undefined;
    const featuredOnly = req.query.featured === 'true';
    const projects = dbProjects.getAll({ publishedOnly: true, service, featuredOnly });
    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
});

app.get('/api/public/projects/:slug', (req, res) => {
  try {
    const project = dbProjects.getBySlug(req.params.slug);
    if (!project || !project.published) {
      res.status(404).json({ error: 'Dự án không tồn tại hoặc chưa được công khai.' });
      return;
    }
    res.json(project);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve project details' });
  }
});

// Articles / Insights
app.get('/api/public/articles', (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const featuredOnly = req.query.featured === 'true';
    const articles = dbArticles.getAll({ publishedOnly: true, category, featuredOnly });
    res.json(articles);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve articles' });
  }
});

app.get('/api/public/articles/:slug', (req, res) => {
  try {
    const article = dbArticles.getBySlug(req.params.slug);
    if (!article || !article.published) {
      res.status(404).json({ error: 'Bài viết không tồn tại hoặc chưa được công khai.' });
      return;
    }
    res.json(article);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve article details' });
  }
});

// Services
app.get('/api/public/services', (req, res) => {
  res.json(dbServices.getAll());
});

// Partners
app.get('/api/public/partners', (req, res) => {
  res.json(dbPartners.getAll());
});

// Pages
app.get('/api/public/pages/:key', (req, res) => {
  const page = dbPages.getByKey(req.params.key);
  if (!page) {
    res.status(404).json({ error: 'Trang không tồn tại.' });
    return;
  }
  res.json(page);
});

// Settings
app.get('/api/public/settings', (req, res) => {
  res.json(dbSettings.get());
});

// Contact & Quote / Engineer Registration Submissions
app.post('/api/public/contact', (req, res) => {
  try {
    const { fullName, email, phone } = req.body;
    if (!fullName || typeof fullName !== 'string' || (!email && !phone)) {
      res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ họ tên và email hoặc số điện thoại liên hệ.' });
      return;
    }
    const inquiry = dbInquiries.create(req.body);
    res.status(201).json({
      success: true,
      inquiryId: inquiry.id,
      message: 'Yêu cầu của bạn đã được gửi thành công đến bộ phận kỹ thuật DEBRIQ!'
    });
  } catch (err: any) {
    res.status(500).json({ error: IS_PRODUCTION ? 'Không thể lưu yêu cầu.' : err.message });
  }
});

/* =========================================================================
   ADMIN AUTHENTICATION ROUTES
   ========================================================================= */

// In-memory failed attempts tracker for brute-force prevention
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

app.post('/api/admin/login', async (req, res) => {
  try {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const attempt = loginAttempts.get(clientIp);
    const now = Date.now();

    if (attempt && attempt.lockedUntil > now) {
      const waitSec = Math.ceil((attempt.lockedUntil - now) / 1000);
      res.status(429).json({ error: `Quá nhiều lần thử không đúng. Vui lòng thử lại sau ${waitSec} giây.` });
      return;
    }

    const { email, password } = req.body;
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'Email và mật khẩu không được để trống.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = dbUsers.getByEmail(cleanEmail);

    let isValid = false;
    let userId = '';
    let userName = 'DEBRIQ Administrator';

    if (user && user.passwordHash) {
      isValid = verifyPassword(password, user.passwordHash);
      if (isValid) {
        userId = user.id;
        userName = user.name;
      }
    }

    if (!isValid) {
      const currentCount = (attempt?.count || 0) + 1;
      let lockedUntil = 0;
      if (currentCount >= 5) {
        lockedUntil = now + 15 * 60 * 1000; // Lock for 15 mins after 5 failed attempts
      }
      loginAttempts.set(clientIp, { count: currentCount, lockedUntil });
      
      res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác.' });
      return;
    }

    // Reset failed login attempts upon success
    loginAttempts.delete(clientIp);

    const token = createSessionToken(userId, cleanEmail);

    // Set secure HTTP-only cookie
    res.cookie('debriq_session', token, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.json({
      success: true,
      token,
      user: { id: userId, email: cleanEmail, name: userName }
    });
  } catch (err: any) {
    res.status(500).json({ error: IS_PRODUCTION ? 'Lỗi đăng nhập hệ thống.' : err.message });
  }
});

app.post('/api/admin/logout', (req, res) => {
  const token = req.cookies?.debriq_session || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (token) {
    revokeSession(token);
  }
  res.clearCookie('debriq_session', { path: '/' });
  res.json({ success: true, message: 'Đăng xuất thành công.' });
});

app.get('/api/admin/me', requireAdminAuth, (req, res) => {
  const user = (req as any).user;
  res.json({ authenticated: true, user });
});

app.post('/api/admin/change-password', requireAdminAuth, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const sessionUser = (req as any).user;
    
    if (!newPassword || newPassword.length < 8) {
      res.status(400).json({ error: 'Mật khẩu mới phải có tối thiểu 8 ký tự.' });
      return;
    }

    const user = dbUsers.getById(sessionUser.userId);
    if (!user || !verifyPassword(currentPassword, user.passwordHash)) {
      res.status(400).json({ error: 'Mật khẩu hiện tại không đúng.' });
      return;
    }

    dbUsers.updatePassword(user.id, newPassword);
    res.json({ success: true, message: 'Cập nhật mật khẩu thành công.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Không thể đổi mật khẩu.' });
  }
});

// Admin User Accounts Management
app.get('/api/admin/users', requireAdminAuth, (req, res) => {
  try {
    res.json(dbUsers.getAll());
  } catch (err: any) {
    res.status(500).json({ error: 'Không thể tải danh sách tài khoản.' });
  }
});

app.post('/api/admin/users', requireAdminAuth, (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'Email và mật khẩu là bắt buộc.' });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ error: 'Mật khẩu phải có tối thiểu 8 ký tự.' });
      return;
    }
    const createdUser = dbUsers.create(email, password, name || 'Quản trị viên');
    res.status(201).json({ success: true, user: createdUser });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tạo tài khoản.' });
  }
});

app.delete('/api/admin/users/:id', requireAdminAuth, (req, res) => {
  try {
    const targetId = req.params.id;
    const sessionUser = (req as any).user;
    if (sessionUser.userId === targetId) {
      res.status(400).json({ error: 'Không thể xóa chính tài khoản đang đăng nhập.' });
      return;
    }
    dbUsers.delete(targetId);
    res.json({ success: true, message: 'Đã xóa tài khoản quản trị viên.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Không thể xóa tài khoản.' });
  }
});

/* =========================================================================
   ADMIN CMS PROTECTED ROUTES
   ========================================================================= */

// Projects CMS
app.get('/api/admin/projects', requireAdminAuth, (req, res) => {
  res.json(dbProjects.getAll());
});

app.post('/api/admin/projects', requireAdminAuth, (req, res) => {
  try {
    const project = dbProjects.create(req.body);
    res.status(201).json(project);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/projects/:id', requireAdminAuth, (req, res) => {
  try {
    const updated = dbProjects.update(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Không tìm thấy dự án để cập nhật.' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/projects/:id', requireAdminAuth, (req, res) => {
  const success = dbProjects.delete(req.params.id);
  res.json({ success });
});

// Articles / Insights CMS
app.get('/api/admin/articles', requireAdminAuth, (req, res) => {
  res.json(dbArticles.getAll());
});

app.post('/api/admin/articles', requireAdminAuth, (req, res) => {
  try {
    const article = dbArticles.create(req.body);
    res.status(201).json(article);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/articles/:id', requireAdminAuth, (req, res) => {
  try {
    const updated = dbArticles.update(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Không tìm thấy bài viết để cập nhật.' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/articles/:id', requireAdminAuth, (req, res) => {
  const success = dbArticles.delete(req.params.id);
  res.json({ success });
});

// Services CMS
app.get('/api/admin/services', requireAdminAuth, (req, res) => {
  res.json(dbServices.getAll());
});

app.put('/api/admin/services/:id', requireAdminAuth, (req, res) => {
  const updated = dbServices.update(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Không tìm thấy dịch vụ.' });
    return;
  }
  res.json(updated);
});

// Partners CMS
app.get('/api/admin/partners', requireAdminAuth, (req, res) => {
  res.json(dbPartners.getAll());
});

app.post('/api/admin/partners', requireAdminAuth, (req, res) => {
  const partner = dbPartners.create(req.body);
  res.status(201).json(partner);
});

app.put('/api/admin/partners/reorder', requireAdminAuth, (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      res.status(400).json({ error: 'orderedIds must be an array' });
      return;
    }
    const list = dbPartners.reorder(orderedIds);
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/partners/:id', requireAdminAuth, (req, res) => {
  const updated = dbPartners.update(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Không tìm thấy đối tác.' });
    return;
  }
  res.json(updated);
});

app.delete('/api/admin/partners/:id', requireAdminAuth, (req, res) => {
  dbPartners.delete(req.params.id);
  res.json({ success: true });
});

// Pages CMS
app.get('/api/admin/pages', requireAdminAuth, (req, res) => {
  res.json(dbPages.getAll());
});

app.put('/api/admin/pages/:key', requireAdminAuth, (req, res) => {
  const updated = dbPages.update(req.params.key, req.body);
  res.json(updated);
});

// Settings CMS
app.get('/api/admin/settings', requireAdminAuth, (req, res) => {
  res.json(dbSettings.get());
});

app.put('/api/admin/settings', requireAdminAuth, (req, res) => {
  const updated = dbSettings.update(req.body);
  res.json(updated);
});

// Inquiries / Leads CMS
app.get('/api/admin/inquiries', requireAdminAuth, (req, res) => {
  const items = dbInquiries.getAll();
  res.json({ inquiries: items, count: items.length });
});

app.patch('/api/admin/inquiries/:id/status', requireAdminAuth, (req, res) => {
  const updated = dbInquiries.updateStatus(req.params.id, req.body.status);
  if (!updated) {
    res.status(404).json({ error: 'Không tìm thấy yêu cầu.' });
    return;
  }
  res.json(updated);
});

app.delete('/api/admin/inquiries/:id', requireAdminAuth, (req, res) => {
  dbInquiries.delete(req.params.id);
  res.json({ success: true });
});

// Media Library CMS
app.get('/api/admin/media', requireAdminAuth, (req, res) => {
  res.json(dbMedia.getAll());
});

// Unified Upload Handler (Supports both single file or image field name)
const handleFileUpload = async (req: express.Request, res: express.Response) => {
  try {
    const files = (req.files as Express.Multer.File[]) || (req.file ? [req.file] : []);
    
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'Không có tập tin nào được chọn để tải lên.' });
      return;
    }

    const uploadedFile = files[0];
    const category = (req.body.category as string) || 'general';
    
    const processed = await processAndSaveImage(
      uploadedFile.buffer,
      uploadedFile.originalname,
      uploadedFile.mimetype,
      category
    );

    const mediaRecord = dbMedia.add({
      filename: processed.filename,
      originalName: processed.originalName,
      path: processed.relativePath,
      size: processed.size,
      mimeType: processed.mimeType,
      category: (['projects', 'services', 'general', 'drawings'].includes(processed.category)
        ? processed.category
        : 'general') as any,
      altText: req.body.altText || processed.originalName
    });

    res.status(201).json({
      success: true,
      url: processed.relativePath,
      filename: processed.filename,
      size: processed.size,
      media: mediaRecord
    });
  } catch (err: any) {
    console.error('[Upload Error]', err);
    res.status(500).json({ error: err.message || 'Lỗi khi xử lý tải lên tập tin.' });
  }
};

// Mount upload endpoints with authentication and any field name
app.post('/api/admin/upload', requireAdminAuth, uploadMiddleware.any(), handleFileUpload);
app.post('/api/admin/media/upload', requireAdminAuth, uploadMiddleware.any(), handleFileUpload);

app.delete('/api/admin/media/:id', requireAdminAuth, (req, res) => {
  dbMedia.delete(req.params.id);
  res.json({ success: true });
});

/* =========================================================================
   VITE & SPA MIDDLEWARE SETUP
   ========================================================================= */

async function startServer() {
  if (!IS_PRODUCTION) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const indexHtmlPath = path.join(distPath, 'index.html');
    
    // Static assets (except index.html so we can inject dynamic meta tags)
    app.use(express.static(distPath, {
      maxAge: '1d',
      index: false
    }));

    // Dynamic HTML Response with OpenGraph Social Preview metadata injection
    app.get('*', (req, res) => {
      try {
        if (!fs.existsSync(indexHtmlPath)) {
          res.status(404).send('Not Found');
          return;
        }

        let html = fs.readFileSync(indexHtmlPath, 'utf-8');
        const settings = dbSettings.get();
        const host = req.get('host') || 'debriq.vn';
        const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
        const fullUrl = `${protocol}://${host}${req.originalUrl}`;

        let ogTitle = settings.ogTitle || `${settings.displayName || 'DEBRIQ'} — Kỹ thuật thi công & Shopdrawing`;
        let ogDesc = settings.ogDescription || settings.tagline || 'Giải pháp Shopdrawing kết cấu, hoàn thiện, BIM/Revit và biện pháp thi công chuẩn xác.';
        let ogImage = settings.ogImageUrl || `${protocol}://${host}/placeholder-blueprint.svg`;
        let favicon = settings.faviconUrl || '/favicon.svg';

        // Check if route is a Project Detail
        if (req.originalUrl.startsWith('/projects/') && req.originalUrl !== '/projects/') {
          const slug = req.originalUrl.replace('/projects/', '').split('?')[0].split('/')[0];
          const project = dbProjects.getBySlug(slug);
          if (project) {
            ogTitle = `${typeof project.name === 'object' ? project.name.vi : project.name} — DEBRIQ ENGINEERING`;
            ogDesc = typeof project.scope === 'object' ? project.scope.vi : (project.shortSummary?.vi || ogDesc);
            if (project.heroImage) {
              ogImage = project.heroImage.startsWith('http') ? project.heroImage : `${protocol}://${host}${project.heroImage}`;
            }
          }
        }
        // Check if route is an Article Detail
        else if ((req.originalUrl.startsWith('/insights/') || req.originalUrl.startsWith('/articles/')) && req.originalUrl !== '/insights/') {
          const slug = req.originalUrl.replace('/insights/', '').replace('/articles/', '').split('?')[0].split('/')[0];
          const article = dbArticles.getBySlug(slug);
          if (article) {
            ogTitle = `${typeof article.title === 'object' ? article.title.vi : article.title} — DEBRIQ`;
            ogDesc = typeof article.excerpt === 'object' ? article.excerpt.vi : ogDesc;
            if (article.coverImage) {
              ogImage = article.coverImage.startsWith('http') ? article.coverImage : `${protocol}://${host}${article.coverImage}`;
            }
          }
        }

        // Ensure absolute URL for ogImage
        if (!ogImage.startsWith('http')) {
          ogImage = `${protocol}://${host}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
        }

        // Inject dynamic tags into HTML head
        const dynamicMeta = `
    <title>${ogTitle}</title>
    <link rel="icon" href="${favicon}" />
    <meta name="description" content="${ogDesc.replace(/"/g, '&quot;')}" />
    <meta property="og:title" content="${ogTitle.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${ogDesc.replace(/"/g, '&quot;')}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:url" content="${fullUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${settings.displayName || 'DEBRIQ ENGINEERING'}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${ogTitle.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${ogDesc.replace(/"/g, '&quot;')}" />
    <meta name="twitter:image" content="${ogImage}" />`;

        // Replace existing title and meta tags before injecting dynamic ones
        html = html.replace(/<title>.*?<\/title>/i, '');
        html = html.replace(/<meta\s+name=["']description["'][^>]*>/gi, '');
        html = html.replace(/<meta\s+property=["']og:[^"']*["'][^>]*>/gi, '');
        html = html.replace(/<meta\s+name=["']twitter:[^"']*["'][^>]*>/gi, '');
        html = html.replace('</head>', `${dynamicMeta}\n  </head>`);

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
      } catch (err) {
        res.sendFile(indexHtmlPath);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DEBRIQ Server] Running on http://0.0.0.0:${PORT} [${IS_PRODUCTION ? 'PRODUCTION' : 'DEVELOPMENT'}]`);
  });
}

startServer().catch(err => {
  console.error('[Server Fatal Error] Failed to start server:', err);
  process.exit(1);
});
