import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';
    const where = showAll ? {} : { active: true };

    const data = await db.official.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ success: true, data, total: data.length });
  } catch (error) {
    console.error('[OFFICIALS_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch officials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, position, photo, nip, order, active } = body;

    if (!name || !position || !photo) {
      return NextResponse.json(
        { success: false, error: 'name, position, and photo are required' },
        { status: 400 }
      );
    }

    const data = await db.official.create({
      data: {
        name,
        position,
        photo,
        nip: nip ?? '',
        order: order ?? 0,
        active: active ?? true,
      },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('[OFFICIALS_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create official' },
      { status: 500 }
    );
  }
}
