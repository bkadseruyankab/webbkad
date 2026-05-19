import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';

    const where = showAll ? {} : { active: true };

    const data = await db.gallery.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[GALLERY_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, images, caption, order, active } = body;

    if (!image || !caption) {
      return NextResponse.json(
        { success: false, error: 'image and caption are required' },
        { status: 400 }
      );
    }

    const data = await db.gallery.create({
      data: {
        image,
        caption,
        order: order ?? 0,
        active: active ?? true,
        images: images ?? '[]',
      },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('[GALLERY_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create gallery item' },
      { status: 500 }
    );
  }
}
