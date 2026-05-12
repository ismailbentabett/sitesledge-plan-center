# Phase 4 Plan — Data & Metrics (Milestone 5)

## Overview
Phase 4 covers data import, metrics aggregation, reporting, and integration placeholders.

## Phase 36: Phase 4 Plan
- **Status**: Complete
- **Output**: This document

## Phase 37: CSV Import / Data Room
- **Route**: `/imports`, `/imports/[id]`
- **Model**: `ImportBatch`, `ImportedRecord`
- **Purpose**: Track CSV import batches and their records
- **Features**:
  - List import batches
  - Create/edit/delete batch
  - Track source, file name, record count, status
  - Status: pending, processing, completed, failed
- **Dashboard connections**: Total imports count
- **Acceptance tests**:
  1. Can create import batch
  2. Can edit batch status
  3. Can delete batch
  4. Refresh preserves data
  5. Build passes

## Phase 38: Metrics Dashboard
- **Route**: `/metrics`
- **API**: `/api/metrics`
- **Purpose**: Aggregated metrics from all modules in one view
- **No new models** — reads from existing data
- **Widgets**:
  - MRR (from financial records or active clients)
  - Active clients count
  - Prospects count
  - Average new clients per month
  - Active campaigns count
  - Running experiments count
  - Overdue tasks count
  - High churn risk clients
  - VA task stats
  - Content counts (whiteboards, notes, decisions, SOPs)
  - Active niches/offers
  - Recent financial records table
- **Acceptance tests**:
  1. Metrics page loads
  2. Uses real data from database
  3. Empty states when data missing
  4. Dashboard and metrics are consistent
  5. Build passes

## Phase 39: Reports
- **Route**: `/reports`
- **API**: `/api/reports?type=weekly|clients|outreach`
- **Purpose**: Generate internal reports from database records
- **No new models** — reads and formats existing data
- **Report types**:
  - Weekly Business Review: combines weekly plan, financials, sales, experiments, decisions
  - Client Report: client counts, MRR, by status, by churn risk
  - Outreach Report: campaign totals, reply rates, booked rates
- **Acceptance tests**:
  1. Can generate weekly business review
  2. Can generate client report
  3. Can generate outreach report
  4. Reports use real database records
  5. Missing data handled clearly
  6. Build passes

## Phase 40: Integration Placeholders
- **Route**: `/integrations`, `/integrations/[id]`
- **Model**: `IntegrationConnection`
- **Purpose**: Placeholder entries for future CRM and external system connections
- **Features**:
  - List connections
  - Create/edit/delete connection
  - Track provider, API key, webhook URL, status, last sync
  - Status: disabled, active, error
  - Clear warning that no real API connections are active
- **Acceptance tests**:
  1. Integrations page loads
  2. Can add provider entry
  3. Can save notes/status
  4. No real external API calls
  5. Build passes

## Edge Cases
- Import batch with 0 records is valid
- Metrics page handles empty database gracefully
- Reports handle missing weekly plan or financial records
- Integration API keys stored in DB but not exposed in UI (password field)
- No real external API calls from integrations module

## Dashboard Connections
- `/api/metrics` provides data for main dashboard widgets
- Reports can reference dashboard data
- Import count shown on dashboard if relevant
