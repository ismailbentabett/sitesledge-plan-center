# Current State — SiteSledge Command Center

> Updated: 2026-05-12

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js App Router | 13.5.6 |
| Language | TypeScript | 5.6 |
| UI | React | 18.3 |
| Styling | Tailwind CSS | 3.4 |
| Database | PostgreSQL (schema) / SQLite (local dev) | — |
| ORM | Prisma | 5.22 |
| Validation | Zod | 3.23 |
| Canvas | Excalidraw | 0.18.1 |
| Theme | next-themes | 0.4 |
| Package Manager | pnpm | — |
| Auth | Custom cookie-based password gate | — |

## How to Run

```bash
# Start PostgreSQL (optional)
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
| `DATABASE_URL` | Database connection | `postgresql://...` or `file:./dev.db` |
| `ADMIN_PASSWORD` | Password gate | `your-secure-password` |

## All Routes (30+ pages)

| Route | Status | Description |
|-------|--------|-------------|
| `/login` | Working | Password gate |
| `/dashboard` | Working | Command Dashboard with real data |
| `/business-model` | Working | Business Model Planner |
| `/niches` | Working | Niche Research Hub |
| `/offers` | Working | Offer Builder |
| `/financial-model` | Working | Financial Model |
| `/weekly-planning` | Working | Weekly Planning Room |
| `/whiteboards` | Working | Whiteboard list |
| `/boards/[id]` | Working | Excalidraw editor |
| `/share/[publicId]` | Working | Public shared view |
| `/notes` | Working | Notes with pinning |
| `/decisions` | Working | Decision Log |
| `/outreach` | Working | Outreach Planner |
| `/scripts` | Working | Script Library |
| `/pipeline` | Working | Sales Pipeline |
| `/experiments` | Working | Experiment Tracker |
| `/funnels` | Working | Funnel Planner |
| `/clients` | Working | Client Tracker |
| `/fulfillment` | Working | Fulfillment Tracker |
| `/sops` | Working | SOP Library |
| `/va-tasks` | Working | VA Task System |
| `/automations` | Working | Automation Map |
| `/website-templates` | Working | Website Template Library |
| `/reviews` | Working | Review System |
| `/retention` | Working | Retention Planner |
| `/imports` | Working | CSV Import |
| `/metrics` | Working | Metrics Dashboard |
| `/reports` | Working | Reports |
| `/integrations` | Working | Integration Placeholders |

## Database Models (26 total)

Board, Client, Pillar, FinancialRecord, VATask, BusinessModel, Niche, Offer, FinancialScenario, WeeklyPlan, Note, Decision, OutreachCampaign, Script, Prospect, Experiment, Funnel, FulfillmentTask, SOP, AutomationTemplate, WebsiteTemplate, ReviewTracker, RetentionPlaybook, ImportBatch, ImportedRecord, IntegrationConnection.

## API Routes

All API routes are protected by auth middleware. 29+ route handlers covering CRUD for all models plus `/api/metrics` (aggregated data) and `/api/reports` (report generation).

## What Is Working

- Password gate with 7-day cookie auth
- Command Dashboard with real data from all modules
- All 26+ modules with full CRUD
- Whiteboard creation, editing, autosave, manual save, rename, delete, share
- Public share links (read-only)
- Dark/light theme toggle
- Zod validation on all API inputs
- Sidebar navigation with active route highlighting
- Metrics dashboard aggregating data from all modules
- Report generation (weekly review, client report, outreach report)
- Docker Compose for local PostgreSQL

## What Is Fixed

- ✅ `/clients` page — was missing, now created with list + detail
- ✅ `/va-tasks` page — was missing, now created with list + detail
- ✅ Sidebar Data/Future sections — were disabled, now enabled
- ✅ `/api/metrics` — was missing, now created
- ✅ `/api/reports` — was missing, now created
- ✅ Prisma schema provider — corrected to PostgreSQL

## Constraints

- No signup, registration, or public accounts
- Single admin user only
- No tldraw used
- No localStorage as main database
- All business records persist in database
- Excalidraw whiteboard preserved and working
