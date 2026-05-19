# IKM Survey Page - Work Record

## Task: Create IkmSurveyPage.tsx Component

### What was done:

1. **Updated BKAD dark color** in `src/app/globals.css` from `#0A4F2E` to `#064E2B` to match spec.

2. **Created the main component** at `src/components/bkad/pages/IkmSurveyPage.tsx` (1103 lines):
   - `'use client'` directive with proper TypeScript typing
   - 3-step wizard with AnimatePresence/motion slide transitions
   - Step 1: Select Unit & Period - fetches from `/api/ikm/units` and `/api/ikm/survey-periods?active=true`
   - Step 2: Rate 9 Indicators - visual radio button cards with emoji ratings (1-4), progress bar, validation
   - Step 3: Demographics & Submit - optional demographics (name, age, gender, education, occupation), required suggestions textarea, submit to POST `/api/ikm/responses`
   - Success state with confetti animation and checkmark
   - Hero section with gradient green background
   - Step indicator (1-2-3) with connecting lines
   - Footer privacy notice
   - Loading, error, and no-active-period states handled

3. **Created API routes**:
   - `src/app/api/ikm/units/route.ts` - GET (list active/all units) and POST (create unit)
   - `src/app/api/ikm/survey-periods/route.ts` - GET (list, with active filter) and POST (create period)
   - `src/app/api/ikm/responses/route.ts` - GET (list with filters) and POST (submit survey with validation)

4. **Added page route**:
   - Added `"ikm-survey"` to `PageKey` type in `src/stores/usePageRouter.ts`
   - Added page title mapping
   - Added import and route handler in `src/app/page.tsx`

5. **Seeded test data** with `prisma/seed-ikm.ts`:
   - 6 IKM units (Sekretariat, Bidang Pendapatan, Bidang Belanja, Bidang Aset, Bidang Perbendaharaan, Layanan Perizinan)
   - 1 active survey period

### Tested:
- All 3 API endpoints verified working via curl
- Lint passes with no new errors
- Dev server running without issues
