# SiteSledge Command Center

## Project Overview
App name: **SiteSledge Command Center**
Purpose: Private internal business planning app for a single owner.
Not a SaaS product. Not multi-tenant. Not public-facing.

## Business Context
- Runs a GoHighLevel-based local business marketing system.
- Sells a low-ticket recurring marketing foundation system to local service businesses.
- Monthly price target: $97 to $297.
- Core pillars:
  - SEO website
  - Automated Google review requests
  - Missed-call text-back automation
  - Database reactivation
- Fulfillment is standardized and later delegated to VAs.
- Target: 100+ low-churn clients.

## Product Rules
- This is NOT a SaaS product.
- Do NOT add signup.
- Do NOT add registration.
- Do NOT add client accounts.
- Do NOT add public users.
- Do NOT add multi-tenant logic.
- This is for private use only.

## Access Rules
- Use a single private password gate or single admin access.
- Password must come from an environment variable (`ADMIN_PASSWORD`).
- Protect all planning pages behind the password gate.
- No registration page.
- No public account creation.
- No user management UI.

## Tech Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL + Prisma
- Zod for validation
- Docker Compose (if already installed)
- pnpm
- Excalidraw whiteboard (keep existing working integration)

## Engineering Rules
- Do not break the existing whiteboard.
- Do not rewrite working systems unless necessary.
- Do not use tldraw.
- Do not use paid-license canvas SDKs.
- Do not use localStorage as the main database.
- Do not fake persistence.
- All business records must persist in PostgreSQL.
- Use TypeScript everywhere.
- Avoid `any` unless absolutely necessary.
- Use Zod validation for all inputs.
- Keep components reusable.
- Keep server/database logic separate from UI components.
- Do not leave TODOs for core functionality.
- Do not remove features to make the build pass.

## Build Process
Before each implementation:
1. Read this AGENTS.md file.
2. Read docs in `/docs`.
3. Confirm the slice scope.
4. Implement only that slice.
5. Run checks.
6. Fix errors.
7. Update docs if implementation differs.

## Required Checks After Each Slice
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`

If the `typecheck` script does not exist, add it as: `"typecheck": "tsc --noEmit"`

## Reporting Format
When finished with any slice, report:
- What changed
- Files changed
- Commands run
- Errors found
- Errors fixed
- Remaining limitations
