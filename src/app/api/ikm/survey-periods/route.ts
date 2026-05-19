import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    const where = activeOnly ? { active: true } : {};

    const data = await db.ikmSurveyPeriod.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data, total: data.length });
  } catch (error) {
    console.error('[IKM_SURVEY_PERIODS_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch survey periods' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, period, startDate, endDate, active, description } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'title is required' },
        { status: 400 }
      );
    }

    const data = await db.ikmSurveyPeriod.create({
      data: {
        title,
        period: period ?? '',
        startDate: startDate ?? '',
        endDate: endDate ?? '',
        active: active ?? true,
        description: description ?? '',
      },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('[IKM_SURVEY_PERIODS_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create survey period' },
      { status: 500 }
    );
  }
}
