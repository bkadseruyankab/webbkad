import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';

    const where = showAll ? {} : { active: true };

    const data = await db.stat.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[STATS_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { icon, value, prefix, suffix, label, color, images, order, active } = body;

    if (!icon || !value || !label || !color) {
      return NextResponse.json(
        { success: false, error: 'icon, value, label, and color are required' },
        { status: 400 }
      );
    }

    const data = await db.stat.create({
      data: {
        icon,
        value,
        prefix: prefix ?? '',
        suffix: suffix ?? '',
        label,
        color,
        order: order ?? 0,
        active: active ?? true,
        images: images ?? '[]',
      },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('[STATS_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create stat' },
      { status: 500 }
    );
  }
}
