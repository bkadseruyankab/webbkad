import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';

    const where = showAll ? {} : { active: true };

    const data = await db.heroSlide.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[HERO_SLIDES_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hero slides' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, image, order, active, images } = body;

    if (!title || !subtitle || !image) {
      return NextResponse.json(
        { success: false, error: 'title, subtitle, and image are required' },
        { status: 400 }
      );
    }

    const data = await db.heroSlide.create({
      data: {
        title,
        subtitle,
        image,
        order: order ?? 0,
        active: active ?? true,
        images: images ?? '[]',
      },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('[HERO_SLIDES_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create hero slide' },
      { status: 500 }
    );
  }
}
