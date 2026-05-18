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

    const { icon, value, prefix, suffix, label, color, order, active } = body;
    const updateData: Record<string, unknown> = {};
    if (icon !== undefined) updateData.icon = icon;
    if (value !== undefined) updateData.value = value;
    if (prefix !== undefined) updateData.prefix = prefix;
    if (suffix !== undefined) updateData.suffix = suffix;
    if (label !== undefined) updateData.label = label;
    if (color !== undefined) updateData.color = color;
    if (order !== undefined) updateData.order = order;
    if (active !== undefined) updateData.active = active;

    const data = await db.stat.update({
      where: { id },
      data: updateData,
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
