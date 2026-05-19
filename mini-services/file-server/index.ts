/**
 * BKAD File Server - Serves uploaded files on port 3001
 * 
 * This is a dedicated file server because Next.js 16 with Turbopack
 * has issues serving large binary files through API routes.
 * 
 * Access via gateway: /uploads/file.jpg?XTransformPort=3001
 */

const PORT = 3001;

// Use absolute paths relative to the project root
const PROJECT_ROOT = '/home/z/my-project';
const PUBLIC_DIR = `${PROJECT_ROOT}/public`;

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
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
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
};

import { stat } from 'fs/promises';
import { extname, basename, resolve, normalize, join } from 'path';
import { existsSync } from 'fs';

const server = Bun.serve({
  port: PORT,
  async fetch(req: Request): Promise<Response> {
    try {
      const url = new URL(req.url);
      let filePath = url.pathname;

      // Remove /api/files prefix if present
      if (filePath.startsWith('/api/files')) {
        filePath = filePath.slice('/api/files'.length);
      }

      // Remove leading slash
      if (filePath.startsWith('/')) {
        filePath = filePath.slice(1);
      }

      // Security: prevent directory traversal
      const normalizedPath = normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, '');

      // The full path within the public directory
      const fullPath = join(PUBLIC_DIR, normalizedPath);

      // Security: ensure the resolved path is within the public directory
      const resolvedPath = resolve(fullPath);
      if (!resolvedPath.startsWith(PUBLIC_DIR)) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (!existsSync(resolvedPath)) {
        return new Response(JSON.stringify({ error: 'File not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Use Bun.file() for efficient file serving (zero-copy where possible)
      const file = Bun.file(resolvedPath);
      const exists = await file.exists();
      if (!exists) {
        return new Response(JSON.stringify({ error: 'File not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const ext = extname(resolvedPath).toLowerCase();
      const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

      // Build headers
      const headers: Record<string, string> = {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      };

      // Force download for non-image files
      if (!mimeType.startsWith('image/') && !mimeType.startsWith('text/') && !mimeType.startsWith('application/javascript')) {
        const fileName = basename(resolvedPath);
        headers['Content-Disposition'] = `attachment; filename="${fileName}"`;
      }

      // Bun.file() returns a Response with proper Content-Type and Content-Length
      return new Response(file, { headers });
    } catch (error) {
      console.error('[FILE_SERVER_ERROR]', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
});

console.log(`📁 BKAD File Server running on http://localhost:${PORT}`);
