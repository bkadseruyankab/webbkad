import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 9 Standard IKM Indicators (Permenpan-RB 14/2017)
const INDICATORS = [
  { name: 'Persyaratan Pelayanan', code: 'ind1', weight: 0.11 },
  { name: 'Prosedur Pelayanan', code: 'ind2', weight: 0.11 },
  { name: 'Waktu Pelayanan', code: 'ind3', weight: 0.11 },
  { name: 'Biaya/Tarif Pelayanan', code: 'ind4', weight: 0.11 },
  { name: 'Produk Pelayanan', code: 'ind5', weight: 0.11 },
  { name: 'Kompetensi Petugas', code: 'ind6', weight: 0.11 },
  { name: 'Perilaku Petugas', code: 'ind7', weight: 0.11 },
  { name: 'Penanganan Pengaduan', code: 'ind8', weight: 0.11 },
  { name: 'Sarana dan Prasarana', code: 'ind9', weight: 0.12 },
] as const;

// Quality classification based on IKM value
function getIkmQuality(ikmValue: number): { grade: string; label: string } {
  if (ikmValue > 85) return { grade: 'A', label: 'Sangat Baik' };
  if (ikmValue > 70) return { grade: 'B', label: 'Baik' };
  if (ikmValue > 55) return { grade: 'C', label: 'Kurang Baik' };
  return { grade: 'D', label: 'Tidak Baik' };
}

// Quality label for individual indicator NRR
function getMutu(nrr: number): string {
  if (nrr >= 3.51) return 'Sangat Baik';
  if (nrr >= 2.51) return 'Baik';
  if (nrr >= 1.76) return 'Kurang Baik';
  return 'Tidak Baik';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const surveyPeriodId = searchParams.get('surveyPeriodId');
    const unitId = searchParams.get('unitId');

    if (!surveyPeriodId) {
      return NextResponse.json(
        { success: false, error: 'surveyPeriodId query parameter is required' },
        { status: 400 }
      );
    }

    // Verify survey period exists
    const surveyPeriod = await db.ikmSurveyPeriod.findUnique({
      where: { id: surveyPeriodId },
    });
    if (!surveyPeriod) {
      return NextResponse.json(
        { success: false, error: 'Survey period not found' },
        { status: 404 }
      );
    }

    // Build where clause
    const where: Record<string, string> = { surveyPeriodId };
    if (unitId) where.unitId = unitId;

    // Fetch all responses for the given filters
    const responses = await db.ikmResponse.findMany({
      where,
      include: {
        unit: { select: { id: true, name: true, code: true } },
      },
    });

    const totalRespondents = responses.length;

    if (totalRespondents === 0) {
      return NextResponse.json({
        success: true,
        data: {
          totalRespondents: 0,
          ikmValue: 0,
          ikmQuality: '-',
          ikmQualityLabel: 'Tidak Ada Data',
          indicators: INDICATORS.map((ind) => ({
            name: ind.name,
            code: ind.code,
            nrr: 0,
            nrrWeighted: 0,
            mutu: '-',
            distribution: { '1': 0, '2': 0, '3': 0, '4': 0 },
          })),
          unitStats: [],
          periodComparison: [],
          demographics: {
            age: {},
            gender: {},
            education: {},
            occupation: {},
          },
          suggestions: [],
        },
      });
    }

    // Calculate indicator statistics
    const indicators = INDICATORS.map((ind) => {
      const values = responses.map((r) => r[ind.code] as number);
      const sum = values.reduce((acc, val) => acc + val, 0);
      const nrr = sum / totalRespondents;
      const nrrWeighted = nrr * ind.weight;

      // Distribution
      const distribution: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0 };
      values.forEach((val) => {
        const key = String(val);
        if (key in distribution) {
          distribution[key]++;
        }
      });

      return {
        name: ind.name,
        code: ind.code,
        nrr: Math.round(nrr * 100) / 100,
        nrrWeighted: Math.round(nrrWeighted * 1000) / 1000,
        mutu: getMutu(nrr),
        distribution,
      };
    });

    // IKM = Sum of all NRR Weighted × 25
    const totalNrrWeighted = indicators.reduce((acc, ind) => acc + ind.nrrWeighted, 0);
    const ikmValue = Math.round(totalNrrWeighted * 25 * 100) / 100;
    const { grade: ikmQuality, label: ikmQualityLabel } = getIkmQuality(ikmValue);

    // Unit statistics - group by unit
    const unitMap = new Map<string, { name: string; code: string; responses: typeof responses }>();
    for (const r of responses) {
      if (!unitMap.has(r.unitId)) {
        unitMap.set(r.unitId, {
          name: r.unit.name,
          code: r.unit.code,
          responses: [],
        });
      }
      unitMap.get(r.unitId)!.responses.push(r);
    }

    const unitStats = Array.from(unitMap.entries()).map(([unitIdRes, info]) => {
      const unitResponses = info.responses;
      const unitTotal = unitResponses.length;

      const unitIndicators = INDICATORS.map((ind) => {
        const values = unitResponses.map((r) => r[ind.code] as number);
        const sum = values.reduce((acc, val) => acc + val, 0);
        const nrr = unitTotal > 0 ? sum / unitTotal : 0;
        const nrrWeighted = nrr * ind.weight;
        return { code: ind.code, nrr, nrrWeighted };
      });

      const unitTotalNrrWeighted = unitIndicators.reduce((acc, i) => acc + i.nrrWeighted, 0);
      const unitIkm = Math.round(unitTotalNrrWeighted * 25 * 100) / 100;
      const { grade, label } = getIkmQuality(unitIkm);

      return {
        unitId: unitIdRes,
        unitName: info.name,
        unitCode: info.code,
        totalRespondents: unitTotal,
        ikmValue: unitIkm,
        ikmQuality: grade,
        ikmQualityLabel: label,
        indicators: unitIndicators.map((ui) => ({
          code: ui.code,
          nrr: Math.round(ui.nrr * 100) / 100,
          nrrWeighted: Math.round(ui.nrrWeighted * 1000) / 1000,
        })),
      };
    });

    // Period comparison - fetch all survey periods for comparison
    const allPeriods = await db.ikmSurveyPeriod.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const periodComparison = await Promise.all(
      allPeriods.map(async (p) => {
        const pWhere: Record<string, string> = { surveyPeriodId: p.id };
        if (unitId) pWhere.unitId = unitId;

        const pResponses = await db.ikmResponse.findMany({ where: pWhere });
        const pTotal = pResponses.length;

        if (pTotal === 0) {
          return {
            periodId: p.id,
            periodTitle: p.title,
            period: p.period,
            totalRespondents: 0,
            ikmValue: 0,
            ikmQuality: '-',
            ikmQualityLabel: 'Tidak Ada Data',
          };
        }

        const pIndicators = INDICATORS.map((ind) => {
          const values = pResponses.map((r) => r[ind.code] as number);
          const sum = values.reduce((acc, val) => acc + val, 0);
          const nrr = sum / pTotal;
          return nrr * ind.weight;
        });

        const pTotalNrrWeighted = pIndicators.reduce((acc, w) => acc + w, 0);
        const pIkm = Math.round(pTotalNrrWeighted * 25 * 100) / 100;
        const { grade, label } = getIkmQuality(pIkm);

        return {
          periodId: p.id,
          periodTitle: p.title,
          period: p.period,
          totalRespondents: pTotal,
          ikmValue: pIkm,
          ikmQuality: grade,
          ikmQualityLabel: label,
        };
      })
    );

    // Demographics
    const ageDistribution: Record<string, number> = {};
    const genderDistribution: Record<string, number> = {};
    const educationDistribution: Record<string, number> = {};
    const occupationDistribution: Record<string, number> = {};

    for (const r of responses) {
      if (r.respondentAge) {
        ageDistribution[r.respondentAge] = (ageDistribution[r.respondentAge] || 0) + 1;
      }
      if (r.respondentGender) {
        const genderKey = r.respondentGender.toUpperCase();
        genderDistribution[genderKey] = (genderDistribution[genderKey] || 0) + 1;
      }
      if (r.respondentEdu) {
        educationDistribution[r.respondentEdu] = (educationDistribution[r.respondentEdu] || 0) + 1;
      }
      if (r.respondentJob) {
        occupationDistribution[r.respondentJob] = (occupationDistribution[r.respondentJob] || 0) + 1;
      }
    }

    // Collect suggestions
    const suggestions = responses
      .map((r) => r.suggestions)
      .filter((s) => s && s.trim() !== '');

    return NextResponse.json({
      success: true,
      data: {
        totalRespondents,
        ikmValue,
        ikmQuality,
        ikmQualityLabel,
        indicators,
        unitStats,
        periodComparison,
        demographics: {
          age: ageDistribution,
          gender: genderDistribution,
          education: educationDistribution,
          occupation: occupationDistribution,
        },
        suggestions,
      },
    });
  } catch (error) {
    console.error('[IKM_STATISTICS_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to compute IKM statistics' },
      { status: 500 }
    );
  }
}
