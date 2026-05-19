import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const data = await db.financialData.findUnique({ where: { id } });

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Financial data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[FINANCIAL_DATA_GET_ONE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch financial data' },
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

    const existing = await db.financialData.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Financial data not found' },
        { status: 404 }
      );
    }

    // Ensure numeric fields are properly typed
    const { images, ...restBody } = body;
    const updateData: Record<string, unknown> = { ...restBody };
    if (body.pendapatan !== undefined) updateData.pendapatan = Number(body.pendapatan);
    if (body.belanja !== undefined) updateData.belanja = Number(body.belanja);
    if (body.realisasi !== undefined) updateData.realisasi = Number(body.realisasi);
    if (images !== undefined) updateData.images = images;

    const data = await db.financialData.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[FINANCIAL_DATA_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update financial data' },
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

    const existing = await db.financialData.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Financial data not found' },
        { status: 404 }
      );
    }

    await db.financialData.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[FINANCIAL_DATA_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete financial data' },
      { status: 500 }
    );
  }
}
