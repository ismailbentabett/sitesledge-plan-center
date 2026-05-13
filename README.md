# SiteSledge Command Center

A private internal business planning and operating system for managing a GoHighLevel-based local service marketing business.

**Not a SaaS product. Not multi-tenant. Single admin user only.**

## Features

### Planning Hub
- **Business Model Planner** — Store and edit core business assumptions
- **Niche Research Hub** — Evaluate and score target niches with 12 scoring dimensions
- **Offer Builder** — Build and track offer positioning, linked to niches
- **Financial Model** — Model business economics with scenarios and projections
- **Weekly Planning Room** — Weekly business review and goal setting

### Workspace
- **Whiteboards** — Excalidraw-based visual planning canvas with PostgreSQL persistence
- **Notes** — Quick notes with pinning and tags
- **Decision Log** — Track important business decisions with outcomes

### Sales & Growth
- **Outreach Planner** — Track cold outreach campaigns with rate calculations
- **Script Library** — Store and organize sales scripts by type and channel
- **Sales Pipeline** — Kanban-style prospect tracking with follow-up management
- **Experiment Tracker** — Track business experiments with decisions (Scale/Keep/Kill)
- **Funnel Planner** — Map and track sales funnels with stage definitions

### Clients & Operations
- **Client Tracker** — Manage clients, track MRR, churn risk, and access URLs
- **Fulfillment Tracker** — Track client onboarding and setup tasks by stage
- **SOP Library** — Standard operating procedures with categories and checklists
- **VA Task System** — Delegate tasks to virtual assistants with QA tracking

### Systems
- **Automation Map** — GHL automation templates with setup/testing steps
- **Website Template Library** — Reusable website templates linked to niches
- **Review System** — Track Google review progress per client
- **Retention Planner** — Churn prevention playbooks

### Data & Metrics
- **CSV Import** — Track import batches and record counts
- **Metrics Dashboard** — Aggregated metrics from all modules
- **Reports** — Generate weekly reviews, client reports, and outreach reports
- **Integrations** — Placeholder entries for future CRM connections

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 13 App Router |
| Language | TypeScript |
| UI | React 18 + Tailwind CSS |
| Database | PostgreSQL (or SQLite for local dev) |
| ORM | Prisma |
| Validation | Zod |
| Canvas | Excalidraw |
| Auth | Custom cookie-based password gate |
| Package Manager | pnpm |

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm
- Docker (optional, for PostgreSQL)

### Quick Start (SQLite — local dev)

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env: set DATABASE_URL="file:./dev.db" and ADMIN_PASSWORD

# Generate Prisma client + migrate
pnpm db:generate
pnpm db:migrate

# Run dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and enter your admin password.

### With Docker (PostgreSQL)

```bash
# Start PostgreSQL
docker compose up -d

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env: set DATABASE_URL to match docker-compose and ADMIN_PASSWORD

# Generate Prisma client + migrate
pnpm db:generate
pnpm db:migrate

# Run dev server
pnpm dev
```

### Production Build

```bash
pnpm build
pnpm start
```

Or with Docker:
```bash
docker compose up --build
```

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | Database connection | `postgresql://postgres:postgres@localhost:5432/whiteboard?schema=public` or `file:./dev.db` |
| `ADMIN_PASSWORD` | Admin password gate | `your-secure-password` |

## Project Scripts

| Script | Command |
|--------|---------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript type check |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:push` | Push schema to DB |
| `pnpm db:studio` | Open Prisma Studio |

## Architecture

### Routes
All routes are protected behind the admin password gate except `/login` and `/share/[publicId]`.

| Route | Purpose |
|-------|---------|
| `/login` | Password gate |
| `/dashboard` | Command Dashboard (business overview) |
| `/business-model` | Business Model Planner |
| `/niches` | Niche Research Hub |
| `/offers` | Offer Builder |
| `/financial-model` | Financial Model |
| `/weekly-planning` | Weekly Planning Room |
| `/whiteboards` | Whiteboard list |
| `/boards/[id]` | Whiteboard editor |
| `/notes` | Notes |
| `/decisions` | Decision Log |
| `/outreach` | Outreach Planner |
| `/scripts` | Script Library |
| `/pipeline` | Sales Pipeline |
| `/experiments` | Experiment Tracker |
| `/funnels` | Funnel Planner |
| `/clients` | Client Tracker |
| `/fulfillment` | Fulfillment Tracker |
| `/sops` | SOP Library |
| `/va-tasks` | VA Task System |
| `/automations` | Automation Map |
| `/website-templates` | Website Template Library |
| `/reviews` | Review System |
| `/retention` | Retention Planner |
| `/imports` | CSV Import |
| `/metrics` | Metrics Dashboard |
| `/reports` | Reports |
| `/integrations` | Integration Placeholders |
| `/share/[publicId]` | Public shared whiteboard |

### Database Models
22 models: Board, Client, Pillar, FinancialRecord, VATask, BusinessModel, Niche, Offer, FinancialScenario, WeeklyPlan, Note, Decision, OutreachCampaign, Script, Prospect, Experiment, Funnel, FulfillmentTask, SOP, AutomationTemplate, WebsiteTemplate, ReviewTracker, RetentionPlaybook, ImportBatch, ImportedRecord, IntegrationConnection.

### Auth
Custom cookie-based auth. Password is compared against `ADMIN_PASSWORD` env var. Cookie expires in 7 days. Middleware protects all routes except `/login`, `/api/auth/*`, `/share`, and static assets.

## Documentation
- `/docs/CURRENT_STATE.md` — Current app state
- `/docs/PRODUCT_SPEC.md` — Product specification
- `/docs/MODULE_MAP.md` — Module map with routes and models
- `/docs/DATA_MODEL.md` — Database model definitions
- `/docs/ROUTES_AND_PAGES.md` — Route definitions
- `/docs/API_SPEC.md` — API specification
- `/docs/UI_SPEC.md` — UI specification
- `/docs/BUILD_PHASES.md` — Build phase tracking
- `/docs/ACCEPTANCE_TESTS.md` — Acceptance test checklist
- `/docs/DECISIONS.md` — Architecture decisions log
- `/docs/PHASE_2_PLAN.md` — Phase 2 plan
- `/docs/PHASE_3_PLAN.md` — Phase 3 plan
- `/docs/PHASE_4_PLAN.md` — Phase 4 plan

## License
Private — not for public distribution.
