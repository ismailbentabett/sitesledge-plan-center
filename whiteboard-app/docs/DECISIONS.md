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

*(To be filled during Phase 4)*
