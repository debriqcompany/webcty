# 🚀 GEMINI.md - HỒ SƠ DỰ ÁN & HƯỚNG DẪN DÀNH CHO AGENT AI (DEBRIQ.VN)

> **Dành cho Agent AI / Account mới:**  
> File này chứa toàn bộ bối cảnh kiến trúc, cấu hình hạ tầng (VPS, Cloudflare, Firebase, Docker), quy ước code và lịch sử kỹ thuật của dự án **DEBRIQ Engineering (`debriq.vn`)**. Hãy đọc kỹ file này trước khi thực hiện bất kỳ tác vụ fix bug, phát triển tính năng hoặc deploy nào!

---

## 1. 🏢 TỔNG QUAN DỰ ÁN
* **Tên dự án:** DEBRIQ Engineering
* **Website:** `debriq.vn` / `www.debriq.vn`
* **Mục tiêu:** Website doanh nghiệp cho công ty tư vấn & thi công kỹ thuật DEBRIQ, bao gồm:
  * **Trang Public:** Trang chủ (Home), Giới thiệu (About), Dịch vụ kỹ thuật (Services), Dự án tiêu biểu (Projects), Bài viết & Tin tức (Articles), Đối tác (Partners), Liên hệ & Báo giá trực tuyến (Quote Modal / Contact).
  * **Hệ thống Quản trị (CMS Admin):** `/admin` - Quản lý Dự án, Bài viết, Dịch vụ, Đối tác, Yêu cầu báo giá (Inquiries), Cài đặt chung (Settings), Uploads Media và Phân quyền người dùng.

---

## 2. 💻 TECH STACK & KIẾN TRÚC HỆ THỐNG

### Frontend
* **Framework / Core:** React 19 (`react@^19.0.1`), TypeScript (`typescript@~5.8.2`), Vite 6 (`vite@^6.2.3`).
* **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`, `@import "tailwindcss";` trong `src/index.css`), Lucide Icons (`lucide-react`), Motion (`motion@^12.23.24` / framer-motion).
* **Quản lý trạng thái:** React Context (`src/context/DataContext.tsx`, `src/context/AuthContext.tsx`).

### Backend (Fullstack Single Service)
* **Web Server:** Node.js 22 LTS + Express.js (`server.ts`).
* **Bundler & Runtime:** `tsx` (cho môi trường dev) và `esbuild` (bundle `server.ts` -> `dist/server.cjs` cho production).
* **Database:**
  * **JSON Database cục bộ:** Lưu tại `data/database.json` (hoặc `/var/lib/debriq/data/database.json` trên VPS) - được quản lý bởi `server/db.ts`.
  * **Firebase Firestore Admin:** Tích hợp sẵn qua `server/firebase.ts` để đồng bộ dữ liệu đám mây (Project: `debriq-engineering`).
* **Xác thực & Bảo mật (Auth & Security):**
  * Mã hóa mật khẩu bằng thuật toán `scrypt` với salt ngẫu nhiên (`server/auth.ts`).
  * Session token qua HttpOnly Cookie (`debriq_session`).
  * Middleware bảo mật: CSP (Content Security Policy), HSTS, X-Frame-Options (SAMEORIGIN), X-Content-Type-Options (nosniff), Referrer-Policy.
* **Xử lý Media:** `multer` + `sharp` tối ưu ảnh sang chuẩn WebP (`server/upload.ts`).

---

## 3. 📂 CẤU TRÚC THƯ MỤC CHÍNH

```tree
debriq-engineering-vps-ready/
├── assets/                  # File tĩnh, hình ảnh gốc
├── data/                    # Chứa database.json (Dữ liệu CMS local)
├── deploy/                  # Script & Cấu hình VPS
│   ├── debriq.service       # File systemd service mẫu
│   └── nginx-debriq.conf    # File cấu hình Nginx mẫu
├── dist/                    # Output sau khi build (Frontend + server.cjs)
├── public/                  # Static assets public của Vite
├── server/                  # Backend modules
│   ├── auth.ts              # Logic mã hóa, tạo session, kiểm tra mật khẩu
│   ├── db.ts                # CRUD JSON database (Projects, Articles, Settings,...)
│   ├── firebase.ts          # Kết nối Firebase Admin SDK Firestore
│   └── upload.ts            # Xử lý upload và resize/compress ảnh (Sharp)
├── src/                     # Toàn bộ mã nguồn Frontend React
│   ├── components/          # Components dùng chung & public (Navbar, Footer, QuoteModal,...)
│   ├── context/             # AuthContext, DataContext
│   ├── pages/               # Các trang Public và Admin (/admin/...)
│   ├── types.ts             # Định nghĩa Type TypeScript cho toàn bộ project
│   ├── index.css            # Style Tailwind v4 & Glassmorphism theme
│   └── App.tsx              # Routing chính & Layout
├── uploads/                 # Thư mục chứa hình ảnh người dùng upload
├── Dockerfile               # Cấu hình containerization cho production
├── docker-compose.yml       # Docker Compose setup với persistent volumes
├── DEPLAY.md                # Hướng dẫn deploy chi tiết lên VPS Ubuntu
├── package.json             # Danh sách dependencies & scripts
├── server.ts                # Entrypoint Express server (Phục vụ API + Static + SPA)
└── vite.config.ts           # Cấu hình Vite & Tailwind plugin
```

---

## 4. 🌐 CẤU HÌNH HẠ TẦNG (VPS, CLOUDFLARE, FIREBASE)

### A. VPS Ubuntu
* **Phương thức chạy:** 
  * Cách 1: Native Node.js 22 qua Systemd Service (`debriq.service`) + Nginx Reverse Proxy (Port 3000).
  * Cách 2: Docker Container (`docker-compose up -d --build`).
* **Persistent Storage:** Thư mục `/var/lib/debriq/data` và `/var/lib/debriq/uploads` (Tuyệt đối không xóa khi deploy code mới).
* **File môi trường production:** `/etc/debriq/debriq.env` (hoặc `.env`).

### B. Biến Môi Trường (`.env`)
```ini
NODE_ENV=production
PORT=3000
APP_ROOT=/var/www/debriq
DATA_DIR=/var/lib/debriq/data
UPLOAD_DIR=/var/lib/debriq/uploads
ADMIN_EMAIL=admin@debriq.vn
ADMIN_PASSWORD=debriq2025
SESSION_SECRET=debriq_session_secret_min_32_characters_long_super_secure
MAX_UPLOAD_SIZE_BYTES=10485760
```

### C. Cloudflare & DNS
* **Domain:** `debriq.vn` và `www.debriq.vn`
* **SSL/TLS Mode:** Full hoặc Full (Strict) sau khi đã cấp Certbot trên VPS.
* **CSP Directives:** Đã whitelist `static.cloudflareinsights.com`, `cloudflareinsights.com`, `googleapis.com`, `google-analytics.com`.

### D. Firebase Admin
* **Project ID:** `debriq-engineering`
* **Service Account:** Đã tích hợp cấu hình trong `server/firebase.ts` (có hỗ trợ override bằng `FIREBASE_PRIVATE_KEY`).

---

## 5. 🛠️ CÁC LỆNH BUILD & KIỂM TRA (AGENT CẦN BIẾT)

1. **Chạy môi trường phát triển (Dev):**
   ```bash
   npm run dev
   # Khởi chạy tsx server.ts (tự động mount Vite dev middleware)
   ```

2. **Kiểm tra lỗi Type & Build (BẮT BUỘC CHẠY TRƯỚC KHI BÀN GIAO/DEPLOY):**
   ```bash
   npm run check
   # Chạy tsc --noEmit && npm run build
   ```

3. **Build Production:**
   ```bash
   npm run build
   # Build Vite client -> dist/ + Bundle server.ts -> dist/server.cjs
   ```

4. **Khởi chạy Production:**
   ```bash
   npm run start:production
   ```

---

## 6. ⚠️ NGUYÊN TẮC CỐT LÕI & LƯU Ý KHI SỬA CODE (CRITICAL RULES)

1. **Không làm mất dữ liệu CMS:**
   * Dữ liệu CMS lưu ở `data/database.json`. Khi sửa `server/db.ts`, luôn đảm bảo có cơ chế fallback và an toàn dữ liệu, không ghi đè cấu trúc mà không validate.
2. **React 19 & Tailwind v4:**
   * Không cài thêm thư viện cũ xung đột với React 19.
   * Tailwind CSS v4 dùng `@import "tailwindcss";` trong `index.css`, không tạo file `tailwind.config.js` cũ trừ khi được yêu cầu.
3. **Session Cookie qua HTTPS:**
   * Trong `server.ts`, luôn giữ `app.set('trust proxy', 1);` để cookie session hoạt động chính xác sau Nginx / Cloudflare.
4. **Luôn chạy Typecheck:**
   * Bất kỳ file nào trong `src/` hoặc `server/` khi sửa phải đảm bảo không có lỗi TypeScript (`npm run typecheck`).
