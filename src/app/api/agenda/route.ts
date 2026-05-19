import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const data = await db.agenda.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[AGENDA_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agenda' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, date, time, location, status, images } = body;

    if (!title || !date || !time || !location) {
      return NextResponse.json(
        { success: false, error: 'title, date, time, and location are required' },
        { status: 400 }
      );
    }

    const data = await db.agenda.create({
      data: {
        title,
        description: description ?? '',
        date,
        time,
        location,
        status: status ?? 'upcoming',
        images: images ?? '[]',
      },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('[AGENDA_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create agenda' },
      { status: 500 }
    );
  }
}
