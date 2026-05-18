import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const data = await db.stat.findUnique({ where: { id } });

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Stat not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[STAT_GET_ONE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stat' },
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

    const existing = await db.stat.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Stat not found' },
        { status: 404 }
      );
    }

    const data = await db.stat.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[STAT_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update stat' },
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

    const existing = await db.stat.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Stat not found' },
        { status: 404 }
      );
    }

    await db.stat.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[STAT_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete stat' },
      { status: 500 }
    );
  }
}
