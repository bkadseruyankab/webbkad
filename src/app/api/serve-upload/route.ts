import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat, copyFile } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// ─── Configuration ──────────────────────────────────────────────────

const PROJECT_ROOT = process.cwd();
const PUBLIC_UPLOADS_DIR = path.join(PROJECT_ROOT, 'public/uploads');
const EXTERNAL_UPLOAD_DIR = '/home/z/my-project/upload';
const PUBLIC_IMAGES_DIR = path.join(PROJECT_ROOT, 'public/images');

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.bmp': 'image/bmp',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.zip': 'application/zip',
  '.rar': 'application/x-rar-compressed',
  '.7z': 'application/x-7z-compressed',
  '.txt': 'text/plain',
  '.csv': 'text/csv',
};

/**
 * Serve uploaded files. This is a fallback route for files that can't be
 * served directly by Caddy/Next.js static file server (e.g., files in the
 * external upload directory).
 *
 * Primary file serving is done via /uploads/xxx.jpg which is handled
 * directly by Caddy (production) or Next.js static file server (dev).
 *
 * Query params:
 *   f - filename to serve
 *   download - set to "1" to force download (Content-Disposition: attachment)
 *   mode - "json" for base64 data URL (legacy), "binary" for direct file (default)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('f');
    const mode = searchParams.get('mode') || 'binary';
    const download = searchParams.get('download') === '1';

    if (!filename) {
      return NextResponse.json({ error: 'Missing filename parameter' }, { status: 400 });
    }

    // Security: prevent directory traversal - only keep the filename
    const normalized = path.basename(filename);

    // Search directories in order of priority
    const searchDirs = [PUBLIC_UPLOADS_DIR, EXTERNAL_UPLOAD_DIR, PUBLIC_IMAGES_DIR];
    let resolvedPath: string | null = null;

    for (const dir of searchDirs) {
      const fullPath = path.join(dir, normalized);
      const candidate = path.resolve(fullPath);

      // Security: ensure the resolved path is within the base directory
      if (!candidate.startsWith(path.resolve(dir))) {
        continue;
      }

      if (existsSync(candidate)) {
        resolvedPath = candidate;

        // If found in external upload dir, copy to public/uploads for future static serving
        if (dir === EXTERNAL_UPLOAD_DIR) {
          const destPath = path.join(PUBLIC_UPLOADS_DIR, normalized);
          if (!existsSync(destPath)) {
            try {
              await copyFile(candidate, destPath);
            } catch {
              // Non-critical: copy failed, just serve from external dir this time
            }
          }
        }
        break;
      }
    }

    if (!resolvedPath) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
    const fileStat = await stat(resolvedPath);

    // JSON mode: return base64-encoded data (legacy compatibility)
    if (mode === 'json') {
      const fileBuffer = await readFile(resolvedPath);
      const base64 = fileBuffer.toString('base64');

      return NextResponse.json({
        success: true,
        mimeType,
        size: fileStat.size,
        dataUrl: `data:${mimeType};base64,${base64}`,
      });
    }

    // Binary mode: serve the file directly with proper headers
    const fileBuffer = await readFile(resolvedPath);

    const isImage = mimeType.startsWith('image/');
    const isPdf = mimeType === 'application/pdf';
    const isInline = !download && (isImage || isPdf);

    const headers: Record<string, string> = {
      'Content-Type': mimeType,
      'Content-Length': fileStat.size.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
    };

    if (!isInline || download) {
      headers['Content-Disposition'] = `attachment; filename="${normalized}"`;
    } else {
      headers['Content-Disposition'] = 'inline';
    }

    return new NextResponse(fileBuffer, { headers });
  } catch (error) {
    console.error('[SERVE_UPLOAD_GET]', error);
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
  }
}
