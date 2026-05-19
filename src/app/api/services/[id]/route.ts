import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const data = await db.service.findUnique({ where: { id } });

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[SERVICE_GET_ONE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service' },
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

    const existing = await db.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    const { icon, title, description, content, color, bgColor, order, active, images } = body;
    const updateData: Record<string, unknown> = {};
    if (icon !== undefined) updateData.icon = icon;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (color !== undefined) updateData.color = color;
    if (bgColor !== undefined) updateData.bgColor = bgColor;
    if (order !== undefined) updateData.order = order;
    if (active !== undefined) updateData.active = active;
    if (images !== undefined) updateData.images = images;

    const data = await db.service.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[SERVICE_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update service' },
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

    const existing = await db.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    await db.service.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[SERVICE_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
