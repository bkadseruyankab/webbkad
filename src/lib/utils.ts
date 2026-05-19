import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resolve uploaded file URLs to accessible static paths.
 * Returns null for invalid/empty URLs so components can skip rendering <img>.
 *
 * URL patterns:
 * - `/api/files/uploads/xxx.jpg` → `/uploads/xxx.jpg` (legacy, convert to static path)
 * - `/uploads/xxx.jpg` → as-is (served by Caddy/Next.js static files from public/)
 * - `/images/xxx.png` → as-is (static images served by Caddy/Next.js)
 * - `blob:xxx` → null (invalid, browser-only temporary URLs)
 * - Empty string → null
 * - Full URLs (http/https) → as-is
 */
export function resolveFileUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  // Remove invalid blob: URLs (these are browser-only temporary URLs that don't persist)
  if (url.startsWith('blob:')) return null;
  // Convert legacy /api/files/uploads/xxx to /uploads/xxx
  if (url.startsWith('/api/files/uploads/')) {
    return url.replace('/api/files/', '/');
  }
  // /uploads/ and /images/ paths are already correct
  return url;
}

/**
 * Get a download URL for a file (forces browser to download instead of displaying).
 * Uses the /api/serve-upload endpoint with download=1 parameter as fallback.
 * The primary display uses /uploads/ directly via resolveFileUrl().
 */
export function getDownloadUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  // For blob: URLs, return null
  if (url.startsWith('blob:')) return null;

  // Extract filename from various URL patterns
  let filename = '';
  if (url.startsWith('/api/files/uploads/')) {
    filename = url.replace('/api/files/uploads/', '');
  } else if (url.startsWith('/uploads/')) {
    filename = url.replace('/uploads/', '');
  } else {
    // External URL or other path - use as-is
    return url;
  }

  // Use the serve-upload API with download flag for reliable downloads
  return `/api/serve-upload?f=${encodeURIComponent(filename)}&download=1`;
}
