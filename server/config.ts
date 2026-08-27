import path from 'path';

/**
 * All relative runtime paths are anchored to APP_ROOT, not to an incidental
 * working directory. Set APP_ROOT in systemd when the service is installed.
 */
export const APP_ROOT = path.resolve(process.env.APP_ROOT || process.cwd());

export function resolveAppPath(value: string): string {
  return path.resolve(APP_ROOT, value);
}

export const DATA_DIR = resolveAppPath(process.env.DATA_DIR || 'data');
export const UPLOAD_DIR = resolveAppPath(process.env.UPLOAD_DIR || 'uploads');
export const DATABASE_FILENAME = path.basename(process.env.DATABASE_FILENAME || 'database.json');
