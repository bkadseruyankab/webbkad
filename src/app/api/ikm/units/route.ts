import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';
    const where = showAll ? {} : { active: true };

    const data = await db.ikmUnit.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ success: true, data, total: data.length });
  } catch (error) {
    console.error('[IKM_UNITS_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch IKM units' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, code, description, headName, address, phone, email, order, active } = body;

    if (!name || !code) {
      return NextResponse.json(
        { success: false, error: 'name and code are required' },
        { status: 400 }
      );
    }

    const data = await db.ikmUnit.create({
      data: {
        name,
        code,
        description: description ?? '',
        headName: headName ?? '',
        address: address ?? '',
        phone: phone ?? '',
        email: email ?? '',
        order: order ?? 0,
        active: active ?? true,
      },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    console.error('[IKM_UNITS_POST]', error);
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Unit code already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create IKM unit' },
      { status: 500 }
    );
  }
}
