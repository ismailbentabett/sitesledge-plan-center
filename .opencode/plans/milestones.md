# SiteSledge Command Center — Milestone Roadmap

> **App**: SiteSledge Command Center
> **Purpose**: Private internal business planning OS for a GoHighLevel-based local marketing business
> **Rule**: NOT a SaaS. No signup. No registration. Single owner access only.

---

## Current State Summary

| Area | Status |
|------|--------|
| **Tech Stack** | Next.js 13 App Router + TypeScript + Tailwind + Prisma + PostgreSQL + Excalidraw |
| **Auth** | Password gate via `ADMIN_PASSWORD` env var, HTTP-only cookie, 7-day expiry |
| **Database Models** | `Board`, `Client`, `Pillar`, `FinancialRecord`, `VATask` |
| **Working Routes** | `/` (redirect), `/login`, `/dashboard` (whiteboard list), `/boards/[id]`, `/share/[publicId]` |
| **API Routes** | Boards CRUD, Clients CRUD, Pillars CRUD, Financials CRUD, VA Tasks CRUD, Auth login/logout, Dashboard stats, Share |
| **Whiteboard** | Excalidraw working with PostgreSQL persistence |
| **Package Manager** | pnpm |
| **Scripts** | `dev`, `build`, `start`, `lint`, `typecheck`, `db:*` |
| **Docker** | Dockerfile + docker-compose.yml exist |
| **AGENTS.md** | Already created with project rules |

---

## Milestone Structure

The full build is organized into **6 milestones** containing **46 phases** (0–45). Each milestone ends with an audit gate before proceeding.

```
Plan → Implement slice → Test → Fix → Commit → Next slice
```

---

## MILESTONE 1 — Foundation & Planning (Phases 0–5)

**Goal**: Lock in project rules, audit current state, create full documentation, verify tooling.

| Phase | Name | Type | Deliverable |
|-------|------|------|-------------|
| 0 | Backup current app | Setup | Git checkpoint of working whiteboard |
| 1 | Create AGENTS.md | Docs | Already done |
| 2 | Audit current app | Audit | `/docs/CURRENT_STATE.md` |
| 3 | Create full planning docs | Docs | 9 doc files in `/docs/` |
| 4 | Critical plan review | Review | Corrections in `/docs/DECISIONS.md` |
| 5 | Verify check scripts | Config | `pnpm lint`, `pnpm typecheck`, `pnpm build` all pass |

**Status**: Phase 0–1 partially done. Phase 2–5 **not started**.

**Commits**:
```
0. "Checkpoint working whiteboard app"
1. "Add project agent instructions"
2. "Document current app state"
3. "Add product planning documentation"
4. "Review and correct planning docs"
5. "Add and verify project check scripts"
```

---

## MILESTONE 2 — Core Planning Hub (Phases 6–18)

**Goal**: Build the private app shell and all Phase 1 planning modules. First usable version.

| Phase | Name | Route | New DB Models | Key Features |
|-------|------|-------|---------------|--------------|
| 6 | Private password gate | `/unlock` or refine `/login` | — | Env-based password, cookie auth, logout |
| 7 | App shell & sidebar | Layout | — | Dark mode sidebar, top bar, nav structure |
| 8 | Command Dashboard | `/dashboard` | — | Real data widgets, empty states, summary cards |
| 9 | Shared CRUD foundation | Components | — | PageHeader, EmptyState, StatusBadge, form utils, Zod patterns |
| 10 | Business Model Planner | `/business-model` | `BusinessModel` | Single record CRUD, core pillars, Zod validation |
| 11 | Niche Research Hub | `/niches`, `/niches/[id]` | `Niche` | Scored niches, opportunity score, status tracking |
| 12 | Offer Builder | `/offers`, `/offers/[id]` | `Offer` | Offers linked to niches, positioning fields |
| 13 | Financial Model | `/financial-model` | `FinancialScenario` | Scenario calculator, MRR/ARR/projection formulas |
| 14 | Weekly Planning Room | `/weekly-planning` | `WeeklyPlan` | Weekly goals, priorities, review fields |
| 15 | Notes | `/notes`, `/notes/[id]` | `Note` | Pin/unpin, tags, markdown, search |
| 16 | Decision Log | `/decisions`, `/decisions/[id]` | `Decision` | Status tracking, review dates, outcomes |
| 17 | Whiteboard cleanup | `/whiteboards` | Update `Board` | Sidebar integration, save status, linking fields |
| 18 | Phase 1 full audit | Audit | — | Full checklist, fix all issues |

**Status**: Auth exists (Phase 6 partially done). Dashboard is whiteboard-only (Phase 8 needs rebuild). Phases 7, 9–17 **not started**.

**Commits** (one per phase):
```
6.  "Implement private password gate"
7.  "Add private app shell and sidebar"
8.  "Implement command dashboard"
9.  "Add shared CRUD foundation"
10. "Implement business model planner"
11. "Implement niche research hub"
12. "Implement offer builder"
13. "Implement financial model"
14. "Implement weekly planning room"
15. "Implement notes"
16. "Implement decision log"
17. "Integrate whiteboard with planning hub"
18. "Audit and stabilize phase 1"
```

---

## MILESTONE 3 — Sales & Growth Modules (Phases 19–25)

**Goal**: Build outreach, scripts, pipeline, experiments, and funnel planning.

| Phase | Name | Route | New DB Models | Key Features |
|-------|------|-------|---------------|--------------|
| 19 | Phase 2 plan | Docs | — | `/docs/PHASE_2_PLAN.md` |
| 20 | Outreach Planner | `/outreach` | `OutreachCampaign` | Campaign CRUD, rate calculations, niche/offer linking |
| 21 | Script Library | `/scripts` | `Script` | Script types, channels, niche/offer linking |
| 22 | Sales Pipeline | `/pipeline` | `Prospect` | Pipeline statuses, follow-ups, expected value |
| 23 | Experiment Tracker | `/experiments` | `Experiment` | Hypothesis tracking, decisions (scale/keep/kill) |
| 24 | Funnel Planner | `/funnels` | `Funnel` | Funnel stages as JSON, niche/offer linking |
| 25 | Phase 2 audit | Audit | — | Full checklist, fix all issues |

**Status**: Not started.

**Commits**:
```
19. "Plan phase 2 sales modules"
20. "Implement outreach planner"
21. "Implement script library"
22. "Implement sales pipeline"
23. "Implement experiment tracker"
24. "Implement funnel planner"
25. "Audit and stabilize phase 2"
```

---

## MILESTONE 4 — Fulfillment & Operations (Phases 26–35)

**Goal**: Build client management, fulfillment tracking, SOPs, VA tasks, automations, templates, reviews, retention.

| Phase | Name | Route | New DB Models | Key Features |
|-------|------|-------|---------------|--------------|
| 26 | Phase 3 plan | Docs | — | `/docs/PHASE_3_PLAN.md` |
| 27 | Client Tracker | `/clients` | Update `Client` | MRR tracking, churn risk, GHL/access fields |
| 28 | Fulfillment Tracker | `/fulfillment` | `FulfillmentTask` | Stage-based tasks, per-client, overdue tracking |
| 29 | SOP Library | `/sops` | `SOP` | Categories, steps, Loom links, status |
| 30 | VA Task System | `/va-tasks` | Update `VATask` | VA assignment by name, QA status, filtering |
| 31 | Automation Map | `/automations` | `AutomationTemplate` | GHL workflow templates, trigger/action docs |
| 32 | Website Template Library | `/website-templates` | `WebsiteTemplate` | Section-based templates, niche linking |
| 33 | Review System Planner | `/reviews` | `ReviewTracker` | Per-client rating tracking, target counts |
| 34 | Churn & Retention Planner | `/retention` | `RetentionPlaybook` | Playbook types, at-risk client flags |
| 35 | Phase 3 audit | Audit | — | Full checklist, fix all issues |

**Status**: `Client`, `VATask`, `Pillar` models exist but need updates. Phase 27–34 **not started**.

**Commits**:
```
26. "Plan phase 3 fulfillment modules"
27. "Implement client tracker"
28. "Implement fulfillment tracker"
29. "Implement SOP library"
30. "Implement VA task system"
31. "Implement automation map"
32. "Implement website template library"
33. "Implement review system planner"
34. "Implement churn and retention planner"
35. "Audit and stabilize phase 3"
```

---

## MILESTONE 5 — Data, Metrics & Reports (Phases 36–40)

**Goal**: CSV import, metrics dashboard, internal reports, integration placeholders.

| Phase | Name | Route | New DB Models | Key Features |
|-------|------|-------|---------------|--------------|
| 36 | Phase 4 plan | Docs | — | `/docs/PHASE_4_PLAN.md` |
| 37 | CSV Import/Data Room | `/imports` | `ImportBatch`, `ImportedRecord` | Upload, preview, column mapping, history |
| 38 | Metrics Dashboard | `/metrics` | — | Real-time metrics from all modules, period filters |
| 39 | Reports | `/reports` | — | WBR, pipeline summary, financial snapshot, export |
| 40 | Integration Placeholders | `/integrations` | `IntegrationConnection` | Provider cards, notes, no real API calls yet |

**Status**: Not started.

**Commits**:
```
36. "Plan phase 4 data modules"
37. "Implement CSV import data room"
38. "Implement metrics dashboard"
39. "Implement internal reports"
40. "Add future integration placeholders"
```

---

## MILESTONE 6 — Polish, Harden & Ship (Phases 41–45)

**Goal**: Full audit, UI polish, Docker hardening, documentation, final acceptance.

| Phase | Name | Type | Deliverable |
|-------|------|------|-------------|
| 41 | Full app audit | Audit | Every route tested, all errors fixed |
| 42 | UI polish pass | UI | Consistent headers, spacing, empty states, loading states |
| 43 | Docker hardening | DevOps | Stable docker-compose, volumes, health checks, documented env vars |
| 44 | README + Operator Manual | Docs | `README.md`, `/docs/OPERATOR_MANUAL.md` |
| 45 | Final acceptance | QA | `/docs/FINAL_ACCEPTANCE_CHECKLIST.md`, all checks pass |

**Status**: Not started.

**Commits**:
```
41. "Full app audit and stabilization"
42. "Polish UI and empty states"
43. "Harden Docker and self-hosting setup"
44. "Add README and operator manual"
45. "Add final acceptance checklist"
```

---

## Database Model Map

### Already Exists
| Model | File | Notes |
|-------|------|-------|
| `Board` | `prisma/schema.prisma` | Whiteboard state, needs `linkedType`/`linkedId` |
| `Client` | `prisma/schema.prisma` | Needs niche, URL fields, churnRisk, GHL fields |
| `Pillar` | `prisma/schema.prisma` | Core pillars per client |
| `FinancialRecord` | `prisma/schema.prisma` | Monthly MRR tracking |
| `VATask` | `prisma/schema.prisma` | Needs assignedVAName, checklist, QA fields |

### To Create (by milestone)

**Milestone 2**: `BusinessModel`, `Niche`, `Offer`, `FinancialScenario`, `WeeklyPlan`, `Note`, `Decision`

**Milestone 3**: `OutreachCampaign`, `Script`, `Prospect`, `Experiment`, `Funnel`

**Milestone 4**: `FulfillmentTask`, `SOP`, `AutomationTemplate`, `WebsiteTemplate`, `ReviewTracker`, `RetentionPlaybook`

**Milestone 5**: `ImportBatch`, `ImportedRecord`, `IntegrationConnection`

---

## Route Map

### Existing
```
/              → redirect to /login or /dashboard
/login         → password gate
/dashboard     → whiteboard list (needs rebuild as command dashboard)
/boards/[id]   → whiteboard editor
/share/[publicId] → public share view
```

### To Add (by milestone)

**Milestone 2**:
```
/dashboard          → command dashboard (replaces whiteboard list)
/business-model     → business model planner
/niches             → niche research hub
/niches/[id]        → niche detail/edit
/offers             → offer builder
/offers/[id]        → offer detail/edit
/financial-model    → financial scenario calculator
/weekly-planning    → weekly planning room
/notes              → notes list
/notes/[id]         → note detail/edit
/decisions          → decision log
/decisions/[id]     → decision detail/edit
/whiteboards        → whiteboard list (new route)
```

**Milestone 3**:
```
/outreach           → outreach campaigns
/scripts            → script library
/pipeline           → sales pipeline
/experiments        → experiment tracker
/funnels            → funnel planner
```

**Milestone 4**:
```
/clients            → client tracker (update existing)
/fulfillment        → fulfillment tracker
/sops               → SOP library
/va-tasks           → VA task system (update existing)
/automations        → automation map
/website-templates  → website template library
/reviews            → review system planner
/retention          → churn & retention planner
```

**Milestone 5**:
```
/imports            → CSV import/data room
/metrics            → metrics dashboard
/reports            → internal reports
/integrations       → integration placeholders
```

---

## Sidebar Navigation Structure

```
SiteSledge Command Center
├── Dashboard                    /dashboard
│
├── Plan
│   ├── Business Model           /business-model
│   ├── Niches                   /niches
│   ├── Offers                   /offers
│   ├── Financial Model          /financial-model
│   └── Weekly Planning          /weekly-planning
│
├── Workspace
│   ├── Whiteboards              /whiteboards
│   ├── Notes                    /notes
│   └── Decision Log             /decisions
│
├── Sales
│   ├── Outreach                 /outreach
│   ├── Scripts                  /scripts
│   ├── Pipeline                 /pipeline
│   ├── Experiments              /experiments
│   └── Funnels                  /funnels
│
├── Clients
│   ├── Clients                  /clients
│   ├── Fulfillment              /fulfillment
│   ├── SOPs                     /sops
│   └── VA Tasks                 /va-tasks
│
├── Systems
│   ├── Automations              /automations
│   ├── Templates                /website-templates
│   ├── Reviews                  /reviews
│   └── Retention                /retention
│
├── Data
│   ├── Imports                  /imports
│   ├── Metrics                  /metrics
│   └── Reports                  /reports
│
└── Future
    └── Integrations             /integrations
```

---

## Execution Rules (from AGENTS.md)

1. **Never** give a "build everything" prompt
2. **Always** use: Plan → Implement slice → Test → Fix → Commit → Next slice
3. **Never** break the existing whiteboard
4. **Never** add signup, registration, public users, or multi-tenant logic
5. **Always** run `pnpm lint`, `pnpm typecheck`, `pnpm build` after each slice
6. **Always** fix errors before moving to the next slice
7. **Always** commit after each slice
8. **Never** use localStorage as the main database
9. **Always** use Zod validation for inputs
10. **Always** persist business records in PostgreSQL

---

## Progress Tracker

| Milestone | Phases | Status | % Complete |
|-----------|--------|--------|------------|
| 1 — Foundation | 0–5 | In Progress | ~20% |
| 2 — Core Planning Hub | 6–18 | Not Started | 0% |
| 3 — Sales & Growth | 19–25 | Not Started | 0% |
| 4 — Fulfillment & Ops | 26–35 | Not Started | 0% |
| 5 — Data & Metrics | 36–40 | Not Started | 0% |
| 6 — Polish & Ship | 41–45 | Not Started | 0% |
| **Total** | **0–45** | | **~3%** |

---

## Next Action

Start with **Milestone 1, Phase 2**: Audit the current app and create `/docs/CURRENT_STATE.md`.
