import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const data = await db.official.findUnique({ where: { id } });

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Official not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[OFFICIALS_GET_ONE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch official' },
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

    const existing = await db.official.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Official not found' },
        { status: 404 }
      );
    }

    const { name, position, photo, nip, order, active, images } = body;
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (position !== undefined) updateData.position = position;
    if (photo !== undefined) updateData.photo = photo;
    if (nip !== undefined) updateData.nip = nip;
    if (order !== undefined) updateData.order = order;
    if (active !== undefined) updateData.active = active;
    if (images !== undefined) updateData.images = images;

    const data = await db.official.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[OFFICIALS_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update official' },
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

    const existing = await db.official.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Official not found' },
        { status: 404 }
      );
    }

    await db.official.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[OFFICIALS_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete official' },
      { status: 500 }
    );
  }
}
