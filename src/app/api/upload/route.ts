import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { db } from '@/lib/db';

// Ensure the uploads directory exists
async function ensureUploadsDir() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  try {
    await mkdir(uploadsDir, { recursive: true });
  } catch {
    // Directory already exists
  }
  return uploadsDir;
}

// Generate a unique filename to avoid collisions
function generateFilename(originalName: string): string {
  const ext = path.extname(originalName) || '.jpg';
  const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${baseName}_${timestamp}_${random}${ext}`;
}

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
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `File type ${file.type} is not allowed` },
        { status: 400 },
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit' },
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

    // The public URL path
    const publicPath = `/uploads/${filename}`;

    // Also register in blob-files DB for metadata tracking
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
