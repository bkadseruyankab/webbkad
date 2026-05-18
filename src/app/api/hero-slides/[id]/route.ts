import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const data = await db.heroSlide.findUnique({ where: { id } });

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Hero slide not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[HERO_SLIDE_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hero slide' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.heroSlide.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Hero slide not found' },
        { status: 404 }
      );
    }

    const { title, subtitle, image, order, active } = body;
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (image !== undefined) updateData.image = image;
    if (order !== undefined) updateData.order = order;
    if (active !== undefined) updateData.active = active;

    const data = await db.heroSlide.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[HERO_SLIDE_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update hero slide' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.heroSlide.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Hero slide not found' },
        { status: 404 }
      );
    }

    await db.heroSlide.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[HERO_SLIDE_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete hero slide' },
      { status: 500 }
    );
  }
}
