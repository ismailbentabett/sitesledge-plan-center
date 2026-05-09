# Routes & Pages — SiteSledge Command Center

## Navigation Structure

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

## Existing Routes (keep)

| Route | File | Auth | Description |
|-------|------|------|-------------|
| `/` | `app/page.tsx` | No | Redirect to `/login` or `/dashboard` |
| `/login` | `app/login/page.tsx` | No | Password gate |
| `/dashboard` | `app/(dashboard)/page.tsx` | Yes (middleware) | Command dashboard — **needs rebuild** |
| `/boards/[id]` | `app/boards/[boardId]/page.tsx` | Yes (middleware) | Whiteboard editor — **keep as-is** |
| `/share/[publicId]` | `app/share/[publicId]/page.tsx` | No | Public share view — **keep as-is** |

## Dead Route (remove)
| Route | File | Action |
|-------|------|--------|
| `/dashboard` (shadowed) | `app/dashboard/page.tsx` | Delete — client-side whiteboard list, shadowed by `(dashboard)/page.tsx` |

## New Routes (Milestone 2)

| Route | Type | Description |
|-------|------|-------------|
| `/whiteboards` | Page | Whiteboard list (replaces old `/dashboard` whiteboard list) |
| `/business-model` | Page | Single-record business model editor |
| `/niches` | Page | Niche list with scores |
| `/niches/[id]` | Page | Niche detail/edit |
| `/offers` | Page | Offer list |
| `/offers/[id]` | Page | Offer detail/edit |
| `/financial-model` | Page | Financial scenario calculator |
| `/weekly-planning` | Page | Weekly plan list and editor |
| `/notes` | Page | Note list |
| `/notes/[id]` | Page | Note detail/edit |
| `/decisions` | Page | Decision list |
| `/decisions/[id]` | Page | Decision detail/edit |

## New Routes (Milestone 3)

| Route | Type | Description |
|-------|------|-------------|
| `/outreach` | Page | Outreach campaign list |
| `/scripts` | Page | Script library |
| `/pipeline` | Page | Sales pipeline |
| `/experiments` | Page | Experiment tracker |
| `/funnels` | Page | Funnel planner |

## New Routes (Milestone 4)

| Route | Type | Description |
|-------|------|-------------|
| `/clients` | Page | Client list (UI for existing API) |
| `/fulfillment` | Page | Fulfillment task list |
| `/sops` | Page | SOP library |
| `/va-tasks` | Page | VA task list (UI for existing API) |
| `/automations` | Page | Automation template list |
| `/website-templates` | Page | Website template library |
| `/reviews` | Page | Review tracker list |
| `/retention` | Page | Retention playbook list |

## New Routes (Milestone 5)

| Route | Type | Description |
|-------|------|-------------|
| `/imports` | Page | CSV import/data room |
| `/metrics` | Page | Metrics dashboard |
| `/reports` | Page | Report generator |
| `/integrations` | Page | Integration placeholders |

## Sidebar Layout

The sidebar is rendered in the protected app layout (`(dashboard)/layout.tsx`). It will be restructured to match the navigation tree above.

- Active route highlighted
- Collapsible sections (Plan, Workspace, Sales, Clients, Systems, Data, Future)
- "Later" sections (Sales, Clients, Systems, Data, Future) show as disabled or "Coming Soon" until built
- Logout button at bottom

## Auth Flow

1. User visits any protected route
2. Middleware checks `sitesledge-auth` cookie
3. If missing/expired → redirect to `/login`
4. User enters password → POST `/api/auth/login`
5. Server verifies against `ADMIN_PASSWORD` env var
6. Sets `sitesledge-auth` cookie (7 days, httpOnly)
7. Redirects to `/dashboard`
8. Logout: POST `/api/auth/logout` → clears cookie → redirect `/login`
