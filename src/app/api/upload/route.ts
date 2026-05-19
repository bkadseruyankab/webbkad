import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { db } from '@/lib/db';

// ─── Configuration from environment ──────────────────────────────────

// Primary upload directory - serves as the web-accessible path
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'public/uploads';
// External upload directory for direct file storage (e.g., pasted images)
const EXTERNAL_UPLOAD_DIR = '/home/z/my-project/upload';
const MAX_SIZE_MB = parseInt(process.env.UPLOAD_MAX_SIZE_MB || '10', 10);
const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024;
const BLOB_TRACKING = process.env.UPLOAD_BLOB_TRACKING !== 'false';
const COMPRESS_QUALITY = parseInt(process.env.UPLOAD_COMPRESS_QUALITY || '80', 10);
const MAX_IMAGE_WIDTH = parseInt(process.env.UPLOAD_MAX_IMAGE_WIDTH || '1920', 10);
const MAX_IMAGE_HEIGHT = parseInt(process.env.UPLOAD_MAX_IMAGE_HEIGHT || '1080', 10);

const DEFAULT_ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
  'text/plain', 'text/csv',
];

const DEFAULT_ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip', '.rar', '.7z', '.txt', '.csv', '.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

const allowedTypes = process.env.UPLOAD_ALLOWED_TYPES
  ? process.env.UPLOAD_ALLOWED_TYPES.split(',').map(t => t.trim())
  : DEFAULT_ALLOWED_TYPES;

const allowedExtensions = process.env.UPLOAD_ALLOWED_EXTENSIONS
  ? process.env.UPLOAD_ALLOWED_EXTENSIONS.split(',').map(e => e.trim().toLowerCase())
  : DEFAULT_ALLOWED_EXTENSIONS;

// ─── Helpers ──────────────────────────────────────────────────────────

async function ensureUploadsDir() {
  const uploadsDir = path.join(process.cwd(), UPLOAD_DIR);
  try {
    await mkdir(uploadsDir, { recursive: true });
  } catch {
    // Directory already exists
  }
  return uploadsDir;
}

function generateFilename(originalName: string): string {
  const ext = path.extname(originalName) || '.jpg';
  const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${baseName}_${timestamp}_${random}${ext}`;
}

// ─── POST: Upload file ───────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 },
      );
    }

    // Validate file type
    const ext = path.extname(file.name).toLowerCase();
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { success: false, error: `File type ${file.type || ext} is not allowed. Allowed: ${allowedExtensions.join(', ')}` },
        { status: 400 },
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: `File size exceeds ${MAX_SIZE_MB}MB limit` },
        { status: 400 },
      );
    }

    // Save file to disk
    const uploadsDir = await ensureUploadsDir();
    const filename = generateFilename(file.name);
    const filePath = path.join(uploadsDir, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // The public URL path - served directly by Caddy/Next.js from the public/ directory
    // /uploads/xxx.jpg is served by Caddy's @uploads handler or Next.js static file server
    const publicPath = `/uploads/${filename}`;

    // Register in blob-files DB for metadata tracking
    if (BLOB_TRACKING) {
      try {
        await db.blobFile.create({
          data: {
            filename,
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            compressedSize: file.size,
            path: publicPath,
            thumbnailPath: '',
            category: (formData.get('category') as string) || 'general',
            altText: (formData.get('altText') as string) || '',
            synced: true,
          },
        });
      } catch (dbError) {
        console.warn('[UPLOAD] Failed to register in blob-files DB:', dbError);
        // Non-critical: file is already saved to disk
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        path: publicPath,
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        thumbnailPath: '',
      },
    });
  } catch (error) {
    console.error('[UPLOAD_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 },
    );
  }
}

// ─── GET: Get upload configuration ────────────────────────────────────

export async function GET() {
  try {
    // Get blob file stats
    const totalFiles = await db.blobFile.count();
    const syncedFiles = await db.blobFile.count({ where: { synced: true } });
    const totalSize = await db.blobFile.aggregate({ _sum: { size: true } });

    return NextResponse.json({
      success: true,
      data: {
        config: {
          uploadDir: UPLOAD_DIR,
          maxSizeMB: MAX_SIZE_MB,
          allowedTypes,
          allowedExtensions,
          blobTracking: BLOB_TRACKING,
          compressQuality: COMPRESS_QUALITY,
          maxImageWidth: MAX_IMAGE_WIDTH,
          maxImageHeight: MAX_IMAGE_HEIGHT,
        },
        stats: {
          totalFiles,
          syncedFiles,
          unsyncedFiles: totalFiles - syncedFiles,
          totalSizeBytes: totalSize._sum.size || 0,
          totalSizeFormatted: formatFileSize(totalSize._sum.size || 0),
        },
      },
    });
  } catch (error) {
    console.error('[UPLOAD_CONFIG_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get upload config' },
      { status: 500 },
    );
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
