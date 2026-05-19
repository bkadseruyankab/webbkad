import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.ikmSurveyPeriod.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Survey period not found' },
        { status: 404 }
      );
    }

    const { title, period, startDate, endDate, active, description } = body;
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (period !== undefined) updateData.period = period;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (active !== undefined) updateData.active = active;
    if (description !== undefined) updateData.description = description;

    const data = await db.ikmSurveyPeriod.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[IKM_SURVEY_PERIOD_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update survey period' },
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

    const existing = await db.ikmSurveyPeriod.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Survey period not found' },
        { status: 404 }
      );
    }

    // Cascade delete responses associated with this period
    await db.ikmResponse.deleteMany({ where: { surveyPeriodId: id } });
    await db.ikmSurveyPeriod.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[IKM_SURVEY_PERIOD_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete survey period' },
      { status: 500 }
    );
  }
}
