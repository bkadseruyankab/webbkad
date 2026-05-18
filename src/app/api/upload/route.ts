import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureUploadDir();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const originalName = file.name;
    const mimeType = file.type;
    const size = file.size;

    // Generate unique filename with webp extension for images
    const isImage = IMAGE_MIME_TYPES.includes(mimeType);
    const ext = isImage ? 'webp' : originalName.split('.').pop() || 'bin';
    const uniqueName = `${uuidv4()}.${ext}`;
    const filePath = join(UPLOAD_DIR, uniqueName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let compressedSize = size;
    let width = 0;
    let height = 0;
    let thumbnailPath = '';

    if (isImage) {
      // Process image with Sharp
      const image = sharp(buffer);
      const metadata = await image.metadata();

      // Resize and convert to webp
      const processedImage = image
        .resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 80 });

      const processedBuffer = await processedImage.toBuffer();
      compressedSize = processedBuffer.length;

      // Get dimensions of processed image
      const processedMetadata = await sharp(processedBuffer).metadata();
      width = processedMetadata.width ?? 0;
      height = processedMetadata.height ?? 0;

      // Save processed image
      writeFileSync(filePath, processedBuffer);

      // Create thumbnail
      const thumbName = `thumb_${uniqueName}`;
      const thumbFilePath = join(UPLOAD_DIR, thumbName);

      const thumbnailBuffer = await sharp(buffer)
        .resize(300, 200, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 70 })
        .toBuffer();

      writeFileSync(thumbFilePath, thumbnailBuffer);
      thumbnailPath = `/uploads/${thumbName}`;
    } else {
      // Save non-image files as-is
      writeFileSync(filePath, buffer);
      compressedSize = buffer.length;
    }

    // Record in database
    const blobFile = await db.blobFile.create({
      data: {
        filename: uniqueName,
        originalName,
        mimeType,
        size,
        compressedSize,
        width,
        height,
        path: `/uploads/${uniqueName}`,
        thumbnailPath,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: blobFile.id,
          filename: blobFile.filename,
          originalName: blobFile.originalName,
          mimeType: blobFile.mimeType,
          size: blobFile.size,
          compressedSize: blobFile.compressedSize,
          width: blobFile.width,
          height: blobFile.height,
          path: blobFile.path,
          thumbnailPath: blobFile.thumbnailPath,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[UPLOAD_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { path: relativePath } = body;

    if (!relativePath) {
      return NextResponse.json(
        { success: false, error: 'Path is required' },
        { status: 400 }
      );
    }

    // Find the file record in database
    const blobFile = await db.blobFile.findFirst({
      where: { path: relativePath },
    });

    if (!blobFile) {
      return NextResponse.json(
        { success: false, error: 'File record not found' },
        { status: 404 }
      );
    }

    // Delete main file from filesystem
    const mainFilePath = join(process.cwd(), 'public', relativePath);
    if (existsSync(mainFilePath)) {
      unlinkSync(mainFilePath);
    }

    // Delete thumbnail from filesystem
    if (blobFile.thumbnailPath) {
      const thumbFilePath = join(
        process.cwd(),
        'public',
        blobFile.thumbnailPath
      );
      if (existsSync(thumbFilePath)) {
        unlinkSync(thumbFilePath);
      }
    }

    // Delete database record
    await db.blobFile.delete({ where: { id: blobFile.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[UPLOAD_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
