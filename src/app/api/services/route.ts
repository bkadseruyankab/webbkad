import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';

    const where = showAll ? {} : { active: true };

    const data = await db.service.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[SERVICES_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { icon, title, description, content, color, bgColor, order, active, images } = body;

    if (!icon || !title || !description || !color || !bgColor) {
      return NextResponse.json(
        { success: false, error: 'icon, title, description, color, and bgColor are required' },
        { status: 400 }
      );
    }

    const data = await db.service.create({
      data: {
        icon,
        title,
        description,
        content: content ?? '',
        color,
        bgColor,
        order: order ?? 0,
        active: active ?? true,
        images: images ?? '[]',
      },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('[SERVICES_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
