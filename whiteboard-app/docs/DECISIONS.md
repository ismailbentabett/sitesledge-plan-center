# Decisions Log — SiteSledge Command Center

## Architecture Decisions

### 1. Password Gate Naming
- **Decision**: Use `ADMIN_PASSWORD` (not `PLANNING_HUB_PASSWORD`)
- **Reason**: The app was already built with `ADMIN_PASSWORD` in the env var, auth lib, and validation. Renaming would be a breaking change with no benefit.
- **Date**: 2026-05-09

### 2. Auth Method
- **Decision**: Custom cookie-based auth (not next-auth sessions)
- **Reason**: The app already has a working cookie-based system with middleware protection. next-auth was installed but never used — the `api/auth/[...nextauth]` route returned 404 for all requests.
- **Date**: 2026-05-09

### 3. next-auth Removal
- **Decision**: Remove next-auth dependency and dead route
- **Reason**: Dead code, adds bundle weight, not used anywhere in the app. Custom cookie auth handles all auth needs for a single-user private app.
- **Date**: 2026-05-09

### 4. bcryptjs Removal
- **Decision**: Remove bcryptjs dependency and type declaration
- **Reason**: Not used anywhere. Password comparison is plain text against env var. For a single-user private app with env-based password, hashing is unnecessary complexity.
- **Date**: 2026-05-09

### 5. Existing API Routes
- **Decision**: Keep existing API routes (clients, pillars, financials, va-tasks) and build UI for them
- **Reason**: The APIs are working, validated with Zod, and have proper auth checks. Rewriting them to match the plan exactly would break existing functionality. We'll extend models and adapt the plan to the existing structure where practical.
- **Date**: 2026-05-09

### 6. Existing Prisma Models
- **Decision**: Extend existing models (Client, VATask) rather than replace them
- **Reason**: Existing models have data and working API routes. New fields will be added via migrations. Legacy fields kept for backward compatibility.
- **Date**: 2026-05-09

### 7. Dashboard Route
- **Decision**: `/dashboard` will be the Command Dashboard (server-side, from `(dashboard)/page.tsx`). The client-side whiteboard list at `app/dashboard/page.tsx` is shadowed and will be deleted. Whiteboards get their own `/whiteboards` route.
- **Reason**: The route group `(dashboard)` means `/dashboard` resolves to the server-side dashboard. The standalone `dashboard/page.tsx` is dead code.
- **Date**: 2026-05-09

### 8. Docker Compose
- **Decision**: Add `ADMIN_PASSWORD` to docker-compose.yml app service
- **Reason**: Was missing, meaning the app container wouldn't have the password set when running via Docker.
- **Date**: 2026-05-09

### 9. Dead Dependency Cleanup
- **Decision**: Remove all unused dependencies during audit phase, not later
- **Reason**: Cleaner codebase from the start. Prevents confusion about what's actually used.
- **Date**: 2026-05-09

## Planning Review Decisions

### 1. DATA_MODEL Relation Fixes
- **Decision**: Add missing relation fields to Client→Niche, ReviewTracker→Client, FulfillmentTask→Client
- **Reason**: Initial DATA_MODEL.md had FK fields without Prisma relation declarations. Fixed during review.
- **Date**: 2026-05-09

### 2. Dashboard Route Conflict
- **Decision**: Delete `app/dashboard/page.tsx` (client-side whiteboard list) — it is shadowed by `app/(dashboard)/page.tsx`
- **Reason**: Next.js route groups take precedence. The standalone `dashboard/page.tsx` is dead code. Whiteboards will get their own `/whiteboards` route.
- **Date**: 2026-05-09

### 3. Existing Dashboard Preservation
- **Decision**: Extend the existing `(dashboard)/page.tsx` business dashboard rather than rebuild from scratch
- **Reason**: It already queries real data (MRR, clients, tasks, pillars, financials) and displays it correctly. We'll add new widgets for Phase 1 modules.
- **Date**: 2026-05-09

### 4. Sidebar Rebuild
- **Decision**: Rebuild `(dashboard)/layout.tsx` sidebar to match the full navigation tree
- **Reason**: Current sidebar has 7 items linking to pages that don't exist (404). New sidebar will have grouped sections with disabled/coming-soon states for unbuilt modules.
- **Date**: 2026-05-09

### 5. Client.businessType Legacy Field
- **Decision**: Keep `Client.businessType` as a legacy field; new `Client.nicheId` will supersede it
- **Reason**: Existing data uses businessType as a free-text niche identifier. Migration will map existing values to Niche records where possible.
- **Date**: 2026-05-09

## Milestone 5 Build Decisions

### 1. Missing Pages Fixed
- **Decision**: Create `/clients/page.tsx`, `/clients/[id]/page.tsx`, `/va-tasks/page.tsx`, `/va-tasks/[id]/page.tsx`
- **Reason**: These pages were referenced in the sidebar but did not exist, causing 404 errors. API routes already existed.
- **Date**: 2026-05-12

### 2. Metrics and Reports APIs Created
- **Decision**: Create `/api/metrics/route.ts` and `/api/reports/route.ts`
- **Reason**: These APIs were needed for the Metrics Dashboard and Reports pages. No new models required — they aggregate existing data.
- **Date**: 2026-05-12

### 3. Sidebar Sections Enabled
- **Decision**: Enable Data (imports, metrics, reports) and Future (integrations) sidebar sections
- **Reason**: All pages and APIs for these sections are now implemented.
- **Date**: 2026-05-12

### 4. Prisma Schema Provider Corrected
- **Decision**: Changed schema provider from `sqlite` to `postgresql`
- **Reason**: The docker-compose, .env.example, and all documentation reference PostgreSQL. The schema declaration should match the intended production database.
- **Date**: 2026-05-12

### 5. Import Detail Page Created
- **Decision**: Create `/imports/[id]/page.tsx` for import batch editing
- **Reason**: The list page existed but the detail page was missing.
- **Date**: 2026-05-12

### 6. Documentation Completed
- **Decision**: Create PHASE_4_PLAN.md, update README.md, create OPERATOR_MANUAL.md
- **Reason**: All phases are now complete. Documentation needed to reflect the final state.
- **Date**: 2026-05-12
