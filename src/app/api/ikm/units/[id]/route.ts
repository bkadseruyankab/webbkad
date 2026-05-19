import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.ikmUnit.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'IKM unit not found' },
        { status: 404 }
      );
    }

    const { name, code, description, headName, address, phone, email, active, order } = body;
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (code !== undefined) updateData.code = code;
    if (description !== undefined) updateData.description = description;
    if (headName !== undefined) updateData.headName = headName;
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (active !== undefined) updateData.active = active;
    if (order !== undefined) updateData.order = order;

    const data = await db.ikmUnit.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[IKM_UNIT_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update IKM unit' },
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

    const existing = await db.ikmUnit.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'IKM unit not found' },
        { status: 404 }
      );
    }

    // Cascade delete responses associated with this unit
    await db.ikmResponse.deleteMany({ where: { unitId: id } });
    await db.ikmUnit.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[IKM_UNIT_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete IKM unit' },
      { status: 500 }
    );
  }
}
