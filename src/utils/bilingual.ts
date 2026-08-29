import { BilingualText } from '../types';

/**
 * Safely resolves a bilingual text object or string with robust fallback.
 * If value is empty string, undefined, or missing the requested language,
 * it seamlessly falls back to the other language or the supplied default string.
 */
export function getBilingualText(
  value: string | BilingualText | undefined | null,
  lang: 'vi' | 'en',
  fallbackVi: string = '',
  fallbackEn: string = ''
): string {
  if (value === undefined || value === null) {
    return lang === 'vi' ? fallbackVi : (fallbackEn || fallbackVi);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length > 0) return trimmed;
    return lang === 'vi' ? fallbackVi : (fallbackEn || fallbackVi);
  }

  if (typeof value === 'object') {
    const valVi = typeof value.vi === 'string' ? value.vi.trim() : '';
    const valEn = typeof value.en === 'string' ? value.en.trim() : '';

    if (lang === 'vi') {
      if (valVi.length > 0) return valVi;
      if (valEn.length > 0) return valEn;
      return fallbackVi;
    } else {
      if (valEn.length > 0) return valEn;
      if (valVi.length > 0) return valVi;
      return fallbackEn || fallbackVi;
    }
  }

  return lang === 'vi' ? fallbackVi : (fallbackEn || fallbackVi);
}

/**
 * Checks if a string is a valid image URL/path (starts with / or http/https).
 */
export function isValidImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.length < 4) return false;
  return trimmed.startsWith('/') || trimmed.startsWith('http://') || trimmed.startsWith('https://');
}
