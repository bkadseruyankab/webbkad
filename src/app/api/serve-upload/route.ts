import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.csv': 'text/csv',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('f');

    if (!filename) {
      return NextResponse.json({ error: 'Missing filename parameter' }, { status: 400 });
    }

    // Security: prevent directory traversal
    const normalized = path.basename(filename); // Only keep the filename, strip any path
    const fullPath = path.join(UPLOAD_DIR, normalized);
    const resolvedPath = path.resolve(fullPath);

    if (!resolvedPath.startsWith(UPLOAD_DIR)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!existsSync(resolvedPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
    const fileStat = await stat(resolvedPath);

    // Return file info as JSON with base64-encoded data
    const fileBuffer = await readFile(resolvedPath);
    const base64 = fileBuffer.toString('base64');

    return NextResponse.json({
      success: true,
      mimeType,
      size: fileStat.size,
      dataUrl: `data:${mimeType};base64,${base64}`,
    });
  } catch (error) {
    console.error('[SERVE_UPLOAD_GET]', error);
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
  }
}
