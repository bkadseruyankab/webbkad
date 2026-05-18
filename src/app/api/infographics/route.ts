import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';

    const where = showAll ? {} : { active: true };

    const data = await db.infographic.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ success: true, data, total: data.length });
  } catch (error) {
    console.error('[INFOGRAPHICS_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch infographics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, image, date, order, active } = body;

    if (!title || !image || !date) {
      return NextResponse.json(
        { success: false, error: 'title, image, and date are required' },
        { status: 400 }
      );
    }

    const data = await db.infographic.create({
      data: {
        title,
        image,
        date,
        order: order ?? 0,
        active: active ?? true,
      },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('[INFOGRAPHICS_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create infographic' },
      { status: 500 }
    );
  }
}
