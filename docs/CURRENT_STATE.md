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
| Charts | Recharts | 3.8 |
| AI | OpenAI SDK | 6.37 |
| CSV Parsing | PapaParse | 5.5 |
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
| `OPENAI_API_KEY` | AI features (optional) | `sk-...` (all AI features degrade gracefully when unset) |

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
| `/imports` | Working (AI-enhanced) | CSV Import with AI column mapping & cleaning |
| `/metrics` | Working (AI-enhanced) | Metrics Dashboard with charts, AI narrative & anomaly detection |
| `/reports` | Working (AI-enhanced) | Reports with optional AI analysis & print export |
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
- Metrics dashboard with Recharts visualizations (MRR trend, client growth, pipeline funnel)
- AI-powered insights: executive narrative, anomaly detection, report analysis (when OPENAI_API_KEY set)
- AI-powered CSV imports: column mapping, data cleaning, bulk insert into Clients/Prospects
- Report generation (weekly review, client report, outreach report) with optional AI analysis
- Print-friendly report export
- Docker Compose for local PostgreSQL

## What Is Fixed

- ✅ `/clients` page — was missing, now created with list + detail
- ✅ `/va-tasks` page — was missing, now created with list + detail
- ✅ Sidebar Data/Future sections — were disabled, now enabled
- ✅ `/api/metrics` — was missing, now created
- ✅ `/api/reports` — was missing, now created
- ✅ Prisma schema provider — corrected to PostgreSQL
- ✅ AI modules — Imports, Metrics, Reports enhanced with OpenAI-powered features

## AI Features

All AI features use the `OPENAI_API_KEY` environment variable and degrade gracefully:
- **No key set** → all modules work identically to their pre-AI behavior
- **Invalid key** → AI calls fail silently, modules fall back to non-AI mode
- **Rate limited** → `withFallback()` catches errors and returns defaults

| Module | AI Features | Model Used |
|--------|-----------|------------|
| Imports | Column mapping, data cleaning validation | GPT-4o-mini |
| Metrics | Executive narrative, anomaly detection with suggestions | GPT-4o-mini |
| Reports | AI-generated analysis per report type | GPT-4o-mini |

## Constraints

- No signup, registration, or public accounts
- Single admin user only
- No tldraw used
- No localStorage as main database
- All business records persist in database
- Excalidraw whiteboard preserved and working
