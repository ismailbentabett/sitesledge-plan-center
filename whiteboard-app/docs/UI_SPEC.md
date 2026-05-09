# UI Specification — SiteSledge Command Center

## Design Principles

- **Dark mode first** — internal tool, dense information, low eye strain
- **Functional over decorative** — no animations unless they convey state
- **Consistent patterns** — every CRUD module follows the same layout
- **Empty states** — every page shows a clear message when no data exists
- **No SaaS marketing UI** — no hero sections, pricing tables, feature grids

## Shared Components

### PageHeader
```
Props: { title: string, description?: string, action?: ReactNode }
Layout: Title (h1), optional description (text-sm muted), optional action button (right-aligned)
```

### EmptyState
```
Props: { title: string, description: string, action?: { label: string, onClick: () => void } }
Layout: Centered icon, title, description, optional CTA button
```

### StatusBadge
```
Props: { label: string, variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }
Layout: Small pill with colored background and text
```

### ConfirmDelete
```
Props: { onConfirm: () => void, itemName?: string }
Layout: Button that opens a confirmation dialog before calling onConfirm
```

### DataTable
```
Props: { columns: Column[], data: Row[], actions?: (row: Row) => ReactNode }
Layout: Table with sortable headers, row actions column
```

### Card
```
Props: { title?: string, children: ReactNode, footer?: ReactNode }
Layout: Bordered card with optional header and footer
```

### MetricCard
```
Props: { label: string, value: string | number, change?: { value: number, positive: boolean }, icon?: ReactNode }
Layout: Card with label, large value, optional change indicator
```

## Page Layout Pattern

Every CRUD module page follows this structure:

```
┌─────────────────────────────────────────┐
│ PageHeader                              │
│ [Title] [Description]     [+ Create]    │
├─────────────────────────────────────────┤
│ Filters/Search (optional)               │
├─────────────────────────────────────────┤
│ DataTable or Card Grid                  │
│ ┌───┬───┬───┬───┬──────┐               │
│ │Col│Col│Col│Col│Action│               │
│ ├───┼───┼───┼───┼──────┤               │
│ │   │   │   │   │E D   │               │
│ │   │   │   │   │E D   │               │
│ └───┴───┴───┴───┴──────┘               │
│                                         │
│ EmptyState (if no data)                 │
└─────────────────────────────────────────┘
```

## Create/Edit Form Pattern

- Server component page or client component form
- Zod validation on submit
- Inline error messages below fields
- Save button disabled until form is valid
- Success toast on save
- Redirect to list page or stay on edit page

## Dashboard Widget Pattern

```
┌──────────────────────┐
│ Label                │
│ Large Value          │
│ Optional: change %   │
│ Optional: progress bar│
└──────────────────────┘
```

Grid: 4 columns on lg, 2 on md, 1 on sm

## Color Usage

| Purpose | Token |
|---------|-------|
| Background | `bg-background` |
| Card surface | `bg-card` |
| Primary action | `bg-primary text-primary-foreground` |
| Secondary action | `border border-input hover:bg-accent` |
| Danger action | `text-destructive border-destructive/30 hover:bg-destructive/10` |
| Success indicator | `text-green-600` |
| Warning indicator | `text-yellow-600` |
| Muted text | `text-muted-foreground` |

## Sidebar

- Width: 56 (14rem)
- Sticky, full height
- Logo at top
- Grouped nav items with section labels
- Active item highlighted with `bg-accent`
- Logout at bottom, separated by border

## Mobile

- Sidebar collapses to hamburger menu
- Tables scroll horizontally
- Cards stack vertically
- No complex layouts — basic but functional
