import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryFilter = searchParams.get('category');
    const syncedFilter = searchParams.get('synced');

    const where: Record<string, unknown> = {};

    if (categoryFilter) {
      where.category = categoryFilter;
    }

    if (syncedFilter !== null) {
      where.synced = syncedFilter === 'true';
    }

    const data = await db.blobFile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[BLOB_FILES_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blob files' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      filename,
      originalName,
      mimeType,
      size,
      compressedSize,
      width,
      height,
      path,
      thumbnailPath,
      category,
      altText,
      synced,
    } = body;

    if (!filename || !originalName || !mimeType || size === undefined || !path) {
      return NextResponse.json(
        {
          success: false,
          error: 'filename, originalName, mimeType, size, and path are required',
        },
        { status: 400 }
      );
    }

    const data = await db.blobFile.create({
      data: {
        filename,
        originalName,
        mimeType,
        size,
        compressedSize: compressedSize ?? 0,
        width: width ?? 0,
        height: height ?? 0,
        path,
        thumbnailPath: thumbnailPath ?? '',
        category: category ?? 'general',
        altText: altText ?? '',
        synced: synced ?? true,
      },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('[BLOB_FILES_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to register blob file' },
      { status: 500 }
    );
  }
}
