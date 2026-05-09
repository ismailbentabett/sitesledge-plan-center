# Current State — SiteSledge Command Center

> Generated: 2026-05-09

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js App Router | 13.5.6 |
| Language | TypeScript | 5.6 |
| UI | React | 18.3 |
| Styling | Tailwind CSS | 3.4 |
| Database | PostgreSQL | 16 (via Docker) |
| ORM | Prisma | 5.22 |
| Validation | Zod | 3.23 |
| Canvas | Excalidraw | 0.18.1 |
| Theme | next-themes | 0.4 |
| Package Manager | pnpm | — |
| Auth | Custom cookie-based (not next-auth) | — |

**Dead dependency**: `next-auth` v4.24.10 is installed but not used. The `api/auth/[...nextauth]/route.ts` returns 404 for all requests. Will be removed.

## How to Run

```bash
# Start PostgreSQL
docker compose up -d

# Install deps
pnpm install

# Generate Prisma client + migrate
pnpm db:generate
pnpm db:migrate

# Run dev server
pnpm dev
```

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://postgres:postgres@localhost:5432/whiteboard?schema=public` |
| `ADMIN_PASSWORD` | Password gate | `sitesledge-admin-2024` |
| `NEXTAUTH_SECRET` | Dead — from unused next-auth | `dev-secret-key-change-in-production-12345` |
| `NEXTAUTH_URL` | Dead — from unused next-auth | `http://localhost:3000` |

**Note**: `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are dead and will be removed.

## Existing Pages

| Route | File | Status | Description |
|-------|------|--------|-------------|
| `/` | `src/app/page.tsx` | Working | Redirects to `/login` or `/dashboard` |
| `/login` | `src/app/login/page.tsx` | Working | Password gate UI |
| `/dashboard` | `src/app/(dashboard)/page.tsx` | Working | Business dashboard with real data from DB |
| `/boards/[id]` | `src/app/boards/[boardId]/page.tsx` | Working | Excalidraw whiteboard editor |
| `/share/[publicId]` | `src/app/share/[publicId]/page.tsx` | Working | Read-only shared board view |

**Broken links**: The sidebar in `(dashboard)/layout.tsx` links to `/clients`, `/pillars`, `/financials`, `/va-tasks`, `/whiteboards`, `/settings` — but only `/dashboard` has a page. The others have API routes but no UI pages.

**Dead route**: `app/dashboard/page.tsx` (client-side whiteboard list) is shadowed by `app/(dashboard)/page.tsx`. Will be deleted in Milestone 2.

## Existing API Routes

| Route | Methods | Auth | Description |
|-------|---------|------|-------------|
| `/api/auth/login` | POST | No | Password verification + set cookie |
| `/api/auth/logout` | POST | No | Clear auth cookie |
| `/api/auth/[...nextauth]` | GET, POST | — | Dead — returns 404 |
| `/api/boards` | GET, POST | Yes | List/create boards |
| `/api/boards/[id]` | GET, PATCH, DELETE | Yes | Read/update/delete board |
| `/api/share/[publicId]` | GET | No | Get public board (no auth) |
| `/api/dashboard` | GET | No | Dashboard stats (relies on middleware) |
| `/api/clients` | GET, POST | Yes | List/create clients |
| `/api/clients/[id]` | GET, PATCH, DELETE | Yes | Read/update/delete client |
| `/api/pillars/[id]` | PATCH | Yes | Update pillar status/notes |
| `/api/financials` | GET, POST | Yes | List/create financial records (upsert) |
| `/api/va-tasks` | GET, POST | Yes | List/create VA tasks |
| `/api/va-tasks/[id]` | PATCH, DELETE | Yes | Update/delete VA task |

## Database Models

### Board (`boards`)
| Field | Type | Notes |
|-------|------|-------|
| `id` | String (cuid) | PK |
| `title` | String | Default "Untitled Board" |
| `stateJson` | String | Default "{}" — Excalidraw serialized JSON |
| `isPublic` | Boolean | Default false |
| `publicId` | String (cuid) | Unique, for sharing |
| `createdAt` | DateTime | |
| `updatedAt` | DateTime | |

### Client (`clients`)
| Field | Type | Notes |
|-------|------|-------|
| `id` | String (cuid) | PK |
| `businessName` | String | |
| `contactName` | String | |
| `email` | String | |
| `phone` | String | |
| `businessType` | String | Acts as niche identifier |
| `status` | Enum | prospect, active, churned, paused |
| `monthlyPrice` | Int | |
| `startDate` | DateTime? | |
| `churnDate` | DateTime? | |
| `notes` | String | Default "" |
| `createdAt` | DateTime | |
| `updatedAt` | DateTime | |

### Pillar (`pillars`)
| Field | Type | Notes |
|-------|------|-------|
| `id` | String (cuid) | PK |
| `clientId` | String | FK → Client (cascade delete) |
| `type` | Enum | seo_website, google_reviews, missed_call_textback, database_reactivation |
| `status` | Enum | not_started, in_progress, active, paused |
| `notes` | String | Default "" |
| `setupDate` | DateTime? | |
| `lastReview` | DateTime? | |
| `createdAt` | DateTime | |
| `updatedAt` | DateTime | |

### FinancialRecord (`financial_records`)
| Field | Type | Notes |
|-------|------|-------|
| `id` | String (cuid) | PK |
| `year` | Int | Part of unique constraint |
| `month` | Int | Part of unique constraint |
| `mrr` | Int | |
| `newClients` | Int | Default 0 |
| `churnedClients` | Int | Default 0 |
| `churnedMrr` | Int | Default 0 |
| `targetMrr` | Int? | |
| `notes` | String | Default "" |
| `createdAt` | DateTime | |
| `updatedAt` | DateTime | |

### VATask (`va_tasks`)
| Field | Type | Notes |
|-------|------|-------|
| `id` | String (cuid) | PK |
| `title` | String | |
| `description` | String | Default "" |
| `assignedTo` | String | Default "" — free text, not a user FK |
| `status` | Enum | todo, in_progress, done, archived |
| `priority` | Enum | low, medium, high, urgent |
| `dueDate` | DateTime? | |
| `clientId` | String? | FK → Client (set null on delete) |
| `createdAt` | DateTime | |
| `updatedAt` | DateTime | |

## Existing Components

| Component | File | Purpose |
|-----------|------|---------|
| `BoardEditor` | `src/components/BoardEditor.tsx` | Excalidraw wrapper with autosave, manual save, save status |
| `Toast` / `useToast` | `src/components/Toast.tsx` | Toast notification system with portal |
| `ThemeProvider` | `src/components/ThemeProvider.tsx` | next-themes wrapper |

## Auth System

- **Method**: Custom cookie-based auth (not next-auth)
- **Cookie name**: `sitesledge-auth`
- **Cookie value**: JSON `{ authenticated: true, timestamp: ... }`
- **Expiry**: 7 days
- **Password source**: `ADMIN_PASSWORD` env var, compared in plain text
- **Middleware**: `src/middleware.ts` protects all routes except `/login`, `/api/auth/*`, `/share`
- **Server-side check**: `isAuthenticated()` in `src/lib/auth.ts` reads cookie from headers

## Middleware

`src/middleware.ts`:
- Blocks unauthenticated requests to all paths except `/login`, `/api/auth/*`, `/share`, `/_next/*`, `/favicon.ico`
- Redirects to `/login` if no cookie or expired
- Cookie expiry: 7 days

## Docker Setup

`docker-compose.yml`:
- `postgres` service: PostgreSQL 16 Alpine, port 5432, healthcheck
- `app` service: builds from Dockerfile, port 3000
- Volume: `postgres_data` for persistence
- **Missing**: `ADMIN_PASSWORD` env var in app service

## Package Scripts

| Script | Command | Status |
|--------|---------|--------|
| `dev` | `next dev` | Working |
| `build` | `next build` | Working |
| `start` | `next start` | Working |
| `lint` | `next lint` | Working |
| `typecheck` | `tsc --noEmit` | Working |
| `db:generate` | `prisma generate` | Working |
| `db:migrate` | `prisma migrate dev` | Working |
| `db:push` | `prisma db push` | Working |
| `db:studio` | `prisma studio` | Working |

## What Is Working

- Password gate with cookie auth
- Dashboard with real data from DB (MRR, clients, tasks, pillars, financials)
- Whiteboard creation, editing, autosave, manual save, rename, delete, share
- Public share links (read-only)
- Dark/light theme toggle
- API routes for clients, pillars, financials, VA tasks (CRUD)
- Zod validation on all API inputs
- Docker Compose for local dev

## What Is Fragile

- **Sidebar links to missing pages**: `/clients`, `/pillars`, `/financials`, `/va-tasks`, `/whiteboards`, `/settings` — all return 404 or hit the middleware redirect
- **next-auth dead dependency**: installed but unused, adds bundle weight
- **`/dashboard` is both a whiteboard list AND a business dashboard**: `src/app/dashboard/page.tsx` is a client-side whiteboard list, while `src/app/(dashboard)/page.tsx` is the server-side business dashboard. The route group `(dashboard)` means `/dashboard` resolves to `(dashboard)/page.tsx`. The standalone `dashboard/page.tsx` is shadowed and unused.
- **Docker compose missing ADMIN_PASSWORD**: app container won't have the password set
- **No UI for existing API routes**: clients, pillars, financials, va-tasks APIs exist but no pages consume them

## What Must Not Be Broken

- Excalidraw whiteboard editor (`/boards/[id]`)
- Whiteboard autosave to PostgreSQL
- Public share links (`/share/[publicId]`)
- Password gate and middleware
- Dashboard real-data queries
- Prisma schema existing models

## Missing Items (vs. business.txt plan)

- No `/docs` directory (created now)
- No PRODUCT_SPEC, MODULE_MAP, DATA_MODEL, ROUTES_AND_PAGES, API_SPEC, UI_SPEC, BUILD_PHASES, ACCEPTANCE_TESTS, DECISIONS docs
- No app shell/sidebar matching the planned navigation structure
- No Business Model Planner, Niche Research Hub, Offer Builder, Financial Model (scenario), Weekly Planning, Notes, Decision Log modules
- No Outreach, Scripts, Pipeline, Experiments, Funnels modules
- No Fulfillment Tracker, SOP Library, Automation Map, Template Library, Review Tracker, Retention Planner modules
- No CSV Import, Metrics Dashboard, Reports, Integration placeholders
- Board model missing `linkedType`/`linkedId` fields for linking to planning records
- Client model missing niche relation, URL fields (website, GHL, GBP), churnRisk field
