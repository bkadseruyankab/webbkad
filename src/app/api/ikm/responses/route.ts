import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const unitId = searchParams.get('unitId');
    const surveyPeriodId = searchParams.get('surveyPeriodId');

    const where: any = {};
    if (unitId) where.unitId = unitId;
    if (surveyPeriodId) where.surveyPeriodId = surveyPeriodId;

    const data = await db.ikmResponse.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        unit: { select: { id: true, name: true, code: true } },
        surveyPeriod: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ success: true, data, total: data.length });
  } catch (error) {
    console.error('[IKM_RESPONSES_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch IKM responses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      unitId,
      surveyPeriodId,
      ind1, ind2, ind3, ind4, ind5, ind6, ind7, ind8, ind9,
      respondentName,
      respondentAge,
      respondentGender,
      respondentEdu,
      respondentJob,
      suggestions,
    } = body;

    // Validation
    if (!unitId || !surveyPeriodId) {
      return NextResponse.json(
        { success: false, error: 'unitId and surveyPeriodId are required' },
        { status: 400 }
      );
    }

    const indicators = [ind1, ind2, ind3, ind4, ind5, ind6, ind7, ind8, ind9];
    const unrated = indicators.filter((v) => !v || v < 1 || v > 4);
    if (unrated.length > 0) {
      return NextResponse.json(
        { success: false, error: 'All 9 indicators must be rated between 1 and 4' },
        { status: 400 }
      );
    }

    if (!suggestions || suggestions.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Suggestions must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Verify unit and period exist
    const [unit, period] = await Promise.all([
      db.ikmUnit.findUnique({ where: { id: unitId } }),
      db.ikmSurveyPeriod.findUnique({ where: { id: surveyPeriodId } }),
    ]);

    if (!unit) {
      return NextResponse.json(
        { success: false, error: 'Unit not found' },
        { status: 404 }
      );
    }
    if (!period || !period.active) {
      return NextResponse.json(
        { success: false, error: 'Survey period not found or inactive' },
        { status: 404 }
      );
    }

    const data = await db.ikmResponse.create({
      data: {
        unitId,
        surveyPeriodId,
        ind1: ind1,
        ind2: ind2,
        ind3: ind3,
        ind4: ind4,
        ind5: ind5,
        ind6: ind6,
        ind7: ind7,
        ind8: ind8,
        ind9: ind9,
        respondentName: respondentName ?? '',
        respondentAge: respondentAge ?? '',
        respondentGender: respondentGender ?? '',
        respondentEdu: respondentEdu ?? '',
        respondentJob: respondentJob ?? '',
        suggestions: suggestions.trim(),
      },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('[IKM_RESPONSES_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit IKM response' },
      { status: 500 }
    );
  }
}
