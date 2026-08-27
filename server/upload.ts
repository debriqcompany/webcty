import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import sharp from 'sharp';
import express from 'express';
import { UPLOAD_DIR } from './config';

// Target Upload Directory
export const UPLOAD_DIR_PATH = UPLOAD_DIR;

// Ensure base upload directory exists
if (!fs.existsSync(UPLOAD_DIR_PATH)) {
  fs.mkdirSync(UPLOAD_DIR_PATH, { recursive: true });
}

// Allowed MIME types & file extensions
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/svg+xml',
  'image/gif'
]);

const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
  '.svg',
  '.gif'
]);

// Maximum upload size (Default: 10MB)
const MAX_SIZE = parseInt(process.env.MAX_UPLOAD_SIZE_BYTES || '', 10) || 10 * 1024 * 1024;

// Use memory storage so we can safely validate and optimize with Sharp before writing to disk
const memoryStorage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage: memoryStorage,
  limits: {
    fileSize: MAX_SIZE,
    files: 10
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    
    // Check MIME type
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return cb(new Error('Chỉ chấp nhận định dạng ảnh hợp lệ (JPEG, PNG, WebP, AVIF, SVG, GIF).'));
    }
    
    // Check file extension
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return cb(new Error('Phần mở rộng tập tin không hợp lệ.'));
    }
    
    // Check for dangerous double extensions (e.g. image.php.jpg)
    const baseWithoutExt = path.basename(file.originalname, ext);
    if (/\.(php|phtml|sh|bash|exe|bat|js|cjs|mjs|ts|html|htm|py|pl|cgi)$/i.test(baseWithoutExt)) {
      return cb(new Error('Phát hiện tên tập tin chứa phần mở rộng không an toàn.'));
    }

    cb(null, true);
  }
});

export interface ProcessedUploadResult {
  filename: string;
  originalName: string;
  relativePath: string;
  absolutePath: string;
  size: number;
  mimeType: string;
  category: string;
}

/**
 * Process and optimize an uploaded image buffer, saving it safely to the VPS filesystem
 */
export async function processAndSaveImage(
  buffer: Buffer,
  originalName: string,
  mimetype: string,
  categoryInput: string = 'general'
): Promise<ProcessedUploadResult> {
  // Sanitize category folder to prevent path traversal
  const category = categoryInput.replace(/[^a-zA-Z0-9_-]/g, '') || 'general';
  const targetDir = path.join(UPLOAD_DIR_PATH, category);
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const rawExt = path.extname(originalName).toLowerCase();
  const cleanBase = path.basename(originalName, rawExt)
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 40);
  
  const randomSuffix = crypto.randomBytes(8).toString('hex');

  // Handle SVG or GIF: save directly without re-encoding to preserve vectors/animation
  if (mimetype === 'image/svg+xml' || rawExt === '.svg') {
    const filename = `${cleanBase}-${randomSuffix}.svg`;
    const destPath = path.join(targetDir, filename);
    fs.writeFileSync(destPath, buffer);
    
    return {
      filename,
      originalName,
      relativePath: `/uploads/${category}/${filename}`,
      absolutePath: destPath,
      size: buffer.length,
      mimeType: 'image/svg+xml',
      category
    };
  }

  if (mimetype === 'image/gif' || rawExt === '.gif') {
    const filename = `${cleanBase}-${randomSuffix}.gif`;
    const destPath = path.join(targetDir, filename);
    fs.writeFileSync(destPath, buffer);
    
    return {
      filename,
      originalName,
      relativePath: `/uploads/${category}/${filename}`,
      absolutePath: destPath,
      size: buffer.length,
      mimeType: 'image/gif',
      category
    };
  }

  // For raster images (JPEG, PNG, WebP, AVIF): optimize and convert to high-quality WebP
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Auto-rotate by EXIF and resize if width exceeds 2400px (standard high-res architectural max)
    let transformer = image.rotate();
    if (metadata.width && metadata.width > 2400) {
      transformer = transformer.resize({ width: 2400, withoutEnlargement: true });
    }

    // Convert to WebP format (quality 85 for crisp CAD lines and realistic photos)
    const optimizedBuffer = await transformer
      .webp({ quality: 85, effort: 4 })
      .toBuffer();

    const filename = `${cleanBase}-${randomSuffix}.webp`;
    const destPath = path.join(targetDir, filename);
    fs.writeFileSync(destPath, optimizedBuffer);

    return {
      filename,
      originalName,
      relativePath: `/uploads/${category}/${filename}`,
      absolutePath: destPath,
      size: optimizedBuffer.length,
      mimeType: 'image/webp',
      category
    };
  } catch (err) {
    // If sharp processing fails for any reason, fallback to safe sanitized disk write
    console.warn('[Sharp Warning] Optimization fallback used:', err);
    const fallbackExt = ALLOWED_EXTENSIONS.has(rawExt) ? rawExt : '.jpg';
    const filename = `${cleanBase}-${randomSuffix}${fallbackExt}`;
    const destPath = path.join(targetDir, filename);
    fs.writeFileSync(destPath, buffer);

    return {
      filename,
      originalName,
      relativePath: `/uploads/${category}/${filename}`,
      absolutePath: destPath,
      size: buffer.length,
      mimeType: mimetype,
      category
    };
  }
}
