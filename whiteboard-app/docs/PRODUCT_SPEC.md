# Product Specification — SiteSledge Command Center

## Overview

SiteSledge Command Center is a **private internal business planning and operating system** for a single owner who runs a GoHighLevel-based local business marketing agency.

## Business Context

- **Business model**: Productized service — sells a recurring marketing foundation system to local service businesses
- **Price target**: $97–$297/month per client
- **Core pillars**: SEO website, Google review automation, missed-call text-back, database reactivation
- **Fulfillment**: Standardized, later delegated to VAs
- **Target**: 100+ low-churn clients

## Product Rules

- **NOT a SaaS product**
- **No signup, no registration, no client accounts, no public users, no multi-tenant logic**
- Single private password gate using `ADMIN_PASSWORD` environment variable
- All business records persist in PostgreSQL (no localStorage as main database)
- Excalidraw whiteboard is preserved and integrated

## Target User

One person: the business owner. No other users, no roles, no permissions.

## Modules (26 total)

### Phase 1 — Core Planning (Milestone 2)
1. Command Dashboard — business overview with real data
2. Business Model Planner — core assumptions, pillars, pricing
3. Niche Research Hub — scored niche evaluation
4. Offer Builder — offer positioning, pricing, guarantees
5. Financial Model — scenario calculator with projections
6. Weekly Planning Room — weekly goals and priorities
7. Notes — pinned notes, tags, search
8. Decision Log — tracked decisions with outcomes
9. Whiteboard — Excalidraw integration (existing)

### Phase 2 — Sales & Growth (Milestone 3)
10. Outreach Planner — campaign tracking with rate calculations
11. Script Library — cold email, call, DM scripts
12. Sales Pipeline — prospect tracking, follow-ups
13. Experiment Tracker — hypothesis testing, decisions
14. Funnel Planner — funnel stages and metrics

### Phase 3 — Fulfillment & Operations (Milestone 4)
15. Client Tracker — client management, MRR, churn risk
16. Fulfillment Tracker — stage-based task management
17. SOP Library — standard operating procedures
18. VA Task System — task assignment by name
19. Automation Map — GHL workflow templates
20. Website Template Library — reusable site templates
21. Review System Planner — per-client review tracking
22. Churn & Retention Planner — retention playbooks

### Phase 4 — Data & Reports (Milestone 5)
23. CSV Import/Data Room — upload and map CSV data
24. Metrics Dashboard — real-time metrics from all modules
25. Reports — generated internal reports
26. Integration Placeholders — future CRM/API prep

## Non-Goals

- No public-facing website
- No client portal
- No billing/invoicing system
- No real-time collaboration
- No mobile app
- No AI features (yet)
- No external API integrations (yet)
