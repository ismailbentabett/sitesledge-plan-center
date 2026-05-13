# API Specification — SiteSledge Command Center

## Auth

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/login` | No | Verify password, set cookie |
| POST | `/api/auth/logout` | No | Clear cookie |

## Boards (existing)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/boards` | Yes | List all boards |
| POST | `/api/boards` | Yes | Create board |
| GET | `/api/boards/[id]` | Yes | Get single board |
| PATCH | `/api/boards/[id]` | Yes | Update board (title, stateJson, isPublic, linkedType, linkedId) |
| DELETE | `/api/boards/[id]` | Yes | Delete board |
| GET | `/api/share/[publicId]` | No | Get public board (read-only) |

## Clients (existing)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/clients` | Yes | List all clients with pillars and VA task count |
| POST | `/api/clients` | Yes | Create client |
| GET | `/api/clients/[id]` | Yes | Get single client with pillars and VA tasks |
| PATCH | `/api/clients/[id]` | Yes | Update client |
| DELETE | `/api/clients/[id]` | Yes | Delete client |

## Pillars (existing)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| PATCH | `/api/pillars/[id]` | Yes | Update pillar status/notes/dates |

## Financials (existing)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/financials` | Yes | List financial records |
| POST | `/api/financials` | Yes | Create/upsert financial record |

## VA Tasks (existing)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/va-tasks` | Yes | List all tasks with client info |
| POST | `/api/va-tasks` | Yes | Create task |
| PATCH | `/api/va-tasks/[id]` | Yes | Update task |
| DELETE | `/api/va-tasks/[id]` | Yes | Delete task |

## Dashboard (existing)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/dashboard` | No* | Get dashboard stats (*protected by middleware) |

## New API Routes (Milestone 2)

### Business Model
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/business-model` | Yes | Get current model (or null) |
| POST | `/api/business-model` | Yes | Create model |
| PATCH | `/api/business-model/[id]` | Yes | Update model |

### Niches
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/niches` | Yes | List niches (sorted by opportunityScore) |
| POST | `/api/niches` | Yes | Create niche |
| GET | `/api/niches/[id]` | Yes | Get single niche |
| PATCH | `/api/niches/[id]` | Yes | Update niche |
| DELETE | `/api/niches/[id]` | Yes | Delete niche |

### Offers
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/offers` | Yes | List offers |
| POST | `/api/offers` | Yes | Create offer |
| GET | `/api/offers/[id]` | Yes | Get single offer |
| PATCH | `/api/offers/[id]` | Yes | Update offer |
| DELETE | `/api/offers/[id]` | Yes | Delete offer |

### Financial Scenarios
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/financial-scenarios` | Yes | List scenarios |
| POST | `/api/financial-scenarios` | Yes | Create scenario |
| PATCH | `/api/financial-scenarios/[id]` | Yes | Update scenario |
| DELETE | `/api/financial-scenarios/[id]` | Yes | Delete scenario |
| POST | `/api/financial-scenarios/[id]/duplicate` | Yes | Duplicate scenario |

### Weekly Plans
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/weekly-plans` | Yes | List plans |
| POST | `/api/weekly-plans` | Yes | Create plan |
| PATCH | `/api/weekly-plans/[id]` | Yes | Update plan |
| DELETE | `/api/weekly-plans/[id]` | Yes | Delete plan |

### Notes
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/notes` | Yes | List notes (pinned first) |
| POST | `/api/notes` | Yes | Create note |
| PATCH | `/api/notes/[id]` | Yes | Update note (including pin/unpin) |
| DELETE | `/api/notes/[id]` | Yes | Delete note |

### Decisions
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/decisions` | Yes | List decisions |
| POST | `/api/decisions` | Yes | Create decision |
| PATCH | `/api/decisions/[id]` | Yes | Update decision |
| DELETE | `/api/decisions/[id]` | Yes | Delete decision |

## New API Routes (Milestone 3)

### Outreach Campaigns
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/outreach` | Yes | List campaigns |
| POST | `/api/outreach` | Yes | Create campaign |
| PATCH | `/api/outreach/[id]` | Yes | Update campaign |
| DELETE | `/api/outreach/[id]` | Yes | Delete campaign |

### Scripts
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/scripts` | Yes | List scripts |
| POST | `/api/scripts` | Yes | Create script |
| PATCH | `/api/scripts/[id]` | Yes | Update script |
| DELETE | `/api/scripts/[id]` | Yes | Delete script |

### Prospects
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/prospects` | Yes | List prospects |
| POST | `/api/prospects` | Yes | Create prospect |
| PATCH | `/api/prospects/[id]` | Yes | Update prospect (including status change) |
| DELETE | `/api/prospects/[id]` | Yes | Delete prospect |

### Experiments
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/experiments` | Yes | List experiments |
| POST | `/api/experiments` | Yes | Create experiment |
| PATCH | `/api/experiments/[id]` | Yes | Update experiment |
| DELETE | `/api/experiments/[id]` | Yes | Delete experiment |

### Funnels
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/funnels` | Yes | List funnels |
| POST | `/api/funnels` | Yes | Create funnel |
| PATCH | `/api/funnels/[id]` | Yes | Update funnel |
| DELETE | `/api/funnels/[id]` | Yes | Delete funnel |

## New API Routes (Milestone 4)

### Fulfillment Tasks
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/fulfillment` | Yes | List tasks |
| POST | `/api/fulfillment` | Yes | Create task |
| PATCH | `/api/fulfillment/[id]` | Yes | Update task |
| DELETE | `/api/fulfillment/[id]` | Yes | Delete task |

### SOPs
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/sops` | Yes | List SOPs |
| POST | `/api/sops` | Yes | Create SOP |
| PATCH | `/api/sops/[id]` | Yes | Update SOP |
| DELETE | `/api/sops/[id]` | Yes | Delete SOP |

### Automations
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/automations` | Yes | List templates |
| POST | `/api/automations` | Yes | Create template |
| PATCH | `/api/automations/[id]` | Yes | Update template |
| DELETE | `/api/automations/[id]` | Yes | Delete template |

### Website Templates
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/website-templates` | Yes | List templates |
| POST | `/api/website-templates` | Yes | Create template |
| PATCH | `/api/website-templates/[id]` | Yes | Update template |
| DELETE | `/api/website-templates/[id]` | Yes | Delete template |

### Reviews
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/reviews` | Yes | List review trackers |
| POST | `/api/reviews` | Yes | Create tracker |
| PATCH | `/api/reviews/[id]` | Yes | Update tracker |
| DELETE | `/api/reviews/[id]` | Yes | Delete tracker |

### Retention
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/retention` | Yes | List playbooks |
| POST | `/api/retention` | Yes | Create playbook |
| PATCH | `/api/retention/[id]` | Yes | Update playbook |
| DELETE | `/api/retention/[id]` | Yes | Delete playbook |

## New API Routes (Milestone 5)

### Imports
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/imports` | Yes | List import batches |
| POST | `/api/imports` | Yes | Create import batch |
| PATCH | `/api/imports/[id]` | Yes | Update batch |
| DELETE | `/api/imports/[id]` | Yes | Delete batch |

### Imported Records
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/imports/[batchId]/records` | Yes | List records for batch |
| POST | `/api/imports/[batchId]/records` | Yes | Create record |
| PATCH | `/api/imports/[batchId]/records/[recordId]` | Yes | Update record |

### Metrics
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/metrics` | Yes | Get all aggregated metrics |

### Reports
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/reports` | Yes | List generated reports |
| POST | `/api/reports` | Yes | Generate report |

### Integrations
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/integrations` | Yes | List connections |
| PATCH | `/api/integrations/[id]` | Yes | Update connection |

## Validation Pattern

All API routes use Zod schemas from `src/lib/validations.ts`:
1. Parse request body with `.safeParse()`
2. Return 400 with error message if validation fails
3. Proceed with validated data if successful

## Auth Pattern

All protected API routes check `isAuthenticated()` from `src/lib/auth.ts`:
```typescript
if (!await isAuthenticated()) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

The middleware also protects these routes at the edge level.
