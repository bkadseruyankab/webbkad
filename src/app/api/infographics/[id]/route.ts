import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const data = await db.infographic.findUnique({ where: { id } });

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Infographic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[INFOGRAPHICS_GET_ONE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch infographic' },
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

    const existing = await db.infographic.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Infographic not found' },
        { status: 404 }
      );
    }

    const { title, image, date, order, active } = body;
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (image !== undefined) updateData.image = image;
    if (date !== undefined) updateData.date = date;
    if (order !== undefined) updateData.order = order;
    if (active !== undefined) updateData.active = active;

    const data = await db.infographic.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[INFOGRAPHICS_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update infographic' },
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

    const existing = await db.infographic.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Infographic not found' },
        { status: 404 }
      );
    }

    await db.infographic.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[INFOGRAPHICS_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete infographic' },
      { status: 500 }
    );
  }
}
