# Task: Create IKM API Routes

## Summary
Created all 7 API route files for the IKM (Indeks Kepuasan Masyarakat) feature following Permenpan-RB 14/2017 standards.

## Files Created

1. **`/src/app/api/ikm/units/route.ts`** - GET (list all units ordered by `order`) & POST (create unit with auto-generated code from name)
2. **`/src/app/api/ikm/units/[id]/route.ts`** - PUT (update unit) & DELETE (delete unit with cascade response deletion)
3. **`/src/app/api/ikm/survey-periods/route.ts`** - GET (list periods with response count) & POST (create period)
4. **`/src/app/api/ikm/survey-periods/[id]/route.ts`** - PUT (update period) & DELETE (delete period with cascade response deletion)
5. **`/src/app/api/ikm/responses/route.ts`** - GET (paginated with unit/period includes and filters) & POST (submit response with 9-indicator validation and IP/user-agent capture)
6. **`/src/app/api/ikm/responses/[id]/route.ts`** - DELETE (delete response by id)
7. **`/src/app/api/ikm/statistics/route.ts`** - GET (full IKM computation with Permenpan-RB 14/2017 formula)

## Key Implementation Details

- Database client: `import { db } from '@/lib/db'`
- Next.js 16 route handlers with `NextRequest` / `NextResponse`
- Dynamic route params use `Promise<{ id: string }>` pattern (Next.js 16)
- IKM formula: NRR per indicator → NRR × weight → Sum × 25
- Weights: ind1-ind8 = 0.11 each, ind9 = 0.12 (total = 1.00)
- Quality: A (>85), B (>70), C (>55), D (≤55)
- Statistics route returns: indicators, unitStats, periodComparison, demographics, suggestions
- All routes have proper error handling with try/catch
- Lint: 0 errors on new code
