# Build Phases — SiteSledge Command Center

## Milestone 1: Foundation & Planning (Complete)
**Phases 0–5** — Docs, audit, tooling verification

| Phase | Name | Status |
|-------|------|--------|
| 0 | Git checkpoint | Done |
| 1 | AGENTS.md update | Done |
| 2 | Audit + CURRENT_STATE.md + cleanup | Done |
| 3 | Full planning docs | Done |
| 4 | Critical plan review | Done |
| 5 | Verify scripts | Done |

## Milestone 2: Core Planning Hub (Complete)
**Phases 6–18** — First usable version of the planning suite

| Phase | Name | Route | New Models |
|-------|------|-------|------------|
| 6 | Password gate refinement | `/login` (existing) | — |
| 7 | App shell & sidebar | Layout | — |
| 8 | Command Dashboard | `/dashboard` (rebuild) | — |
| 9 | Shared CRUD foundation | Components | — |
| 10 | Business Model Planner | `/business-model` | BusinessModel |
| 11 | Niche Research Hub | `/niches` | Niche |
| 12 | Offer Builder | `/offers` | Offer |
| 13 | Financial Model | `/financial-model` | FinancialScenario |
| 14 | Weekly Planning Room | `/weekly-planning` | WeeklyPlan |
| 15 | Notes | `/notes` | Note |
| 16 | Decision Log | `/decisions` | Decision |
| 17 | Whiteboard cleanup | `/whiteboards` | Board (extend) |
| 18 | Phase 1 audit | — | — |

## Milestone 3: Sales & Growth (Complete)
**Phases 19–25** — Outreach, scripts, pipeline, experiments, funnels

| Phase | Name | Route | New Models |
|-------|------|-------|------------|
| 19 | Phase 2 plan | Docs | — |
| 20 | Outreach Planner | `/outreach` | OutreachCampaign |
| 21 | Script Library | `/scripts` | Script |
| 22 | Sales Pipeline | `/pipeline` | Prospect |
| 23 | Experiment Tracker | `/experiments` | Experiment |
| 24 | Funnel Planner | `/funnels` | Funnel |
| 25 | Phase 2 audit | — | — |

## Milestone 4: Fulfillment & Operations (Complete)
**Phases 26–35** — Client management, fulfillment, SOPs, VA tasks, automations, templates, reviews, retention

| Phase | Name | Route | New Models |
|-------|------|-------|------------|
| 26 | Phase 3 plan | Docs | — |
| 27 | Client Tracker | `/clients` | Client (extend) |
| 28 | Fulfillment Tracker | `/fulfillment` | FulfillmentTask |
| 29 | SOP Library | `/sops` | SOP |
| 30 | VA Task System | `/va-tasks` | VATask (extend) |
| 31 | Automation Map | `/automations` | AutomationTemplate |
| 32 | Website Template Library | `/website-templates` | WebsiteTemplate |
| 33 | Review System Planner | `/reviews` | ReviewTracker |
| 34 | Churn & Retention Planner | `/retention` | RetentionPlaybook |
| 35 | Phase 3 audit | — | — |

## Milestone 5: Data & Metrics (Complete)
**Phases 36–40** — CSV import, metrics, reports, integration placeholders

| Phase | Name | Route | New Models |
|-------|------|-------|------------|
| 36 | Phase 4 plan | Docs | — |
| 37 | CSV Import/Data Room | `/imports` | ImportBatch, ImportedRecord |
| 38 | Metrics Dashboard | `/metrics` | — |
| 39 | Reports | `/reports` | — |
| 40 | Integration Placeholders | `/integrations` | IntegrationConnection |

## Milestone 6: Polish & Ship
**Phases 41–45** — Audit, UI polish, Docker hardening, documentation, acceptance

| Phase | Name | Type |
|-------|------|------|
| 41 | Full app audit | Audit |
| 42 | UI polish pass | UI |
| 43 | Docker hardening | DevOps |
| 44 | README + Operator Manual | Docs |
| 45 | Final acceptance checklist | QA |

## Execution Pattern

Every phase follows:
1. Read AGENTS.md and docs
2. Implement only that phase's scope
3. Run `pnpm lint`, `pnpm typecheck`, `pnpm build`
4. Fix all errors
5. Commit with descriptive message
6. Update docs if implementation differs from plan

## Constraints

- Do not expand scope beyond the current phase
- Do not add signup, registration, public users, or multi-tenant logic
- Do not break the existing whiteboard
- Do not use localStorage as the main database
- All business records persist in PostgreSQL
- Use Zod validation for all inputs
- Keep components reusable
- Keep server/database logic separate from UI
