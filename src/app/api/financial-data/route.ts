import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');

    const where: Record<string, unknown> = {};
    if (year) {
      where.year = year;
    }

    const data = await db.financialData.findMany({
      where,
      orderBy: { year: 'desc' },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[FINANCIAL_DATA_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch financial data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { year, pendapatan, belanja, realisasi, images } = body;

    if (!year || pendapatan === undefined || belanja === undefined || realisasi === undefined) {
      return NextResponse.json(
        { success: false, error: 'year, pendapatan, belanja, and realisasi are required' },
        { status: 400 }
      );
    }

    const data = await db.financialData.create({
      data: {
        year,
        pendapatan: Number(pendapatan),
        belanja: Number(belanja),
        realisasi: Number(realisasi),
        images: images ?? '[]',
      },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('[FINANCIAL_DATA_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create financial data' },
      { status: 500 }
    );
  }
}
