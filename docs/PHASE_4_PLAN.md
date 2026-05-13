# Phase 4 Plan — Data & Metrics (Milestone 5)

## Overview
Phase 4 covers data import, metrics aggregation, reporting, and integration placeholders.

## Phase 36: Phase 4 Plan
- **Status**: Complete
- **Output**: This document

## Phase 37: CSV Import / Data Room (AI-Enhanced)
- **Route**: `/imports`, `/imports/[id]`, `/imports/new`
- **Model**: `ImportBatch`, `ImportedRecord`
- **Purpose**: Upload CSV files, AI-powered column mapping, data cleaning, and bulk import into target models
- **Features**:
  - File upload with drag-and-drop
  - CSV parsing and preview (first 10 rows)
  - AI column mapping (suggests CSV header → DB field mappings)
  - AI data cleaning (flags bad emails, phones, prices, etc.)
  - Bulk insert into Clients or Prospects
  - Manual override on all AI suggestions
  - Graceful fallback: works fully without OPENAI_API_KEY
- **AI Routes**: `/api/imports/ai-map`, `/api/imports/ai-clean`, `/api/imports/csv`, `/api/imports/bulk-insert`
- **Dashboard connections**: Total imports count
- **Status**: Complete

## Phase 38: Metrics Dashboard (AI-Enhanced)
- **Route**: `/metrics`
- **API**: `/api/metrics`, `/api/metrics/trends`, `/api/metrics/narrative`, `/api/metrics/anomalies`
- **Purpose**: Aggregated metrics with Recharts visualizations and AI-powered insights
- **Charts**: MRR trend line, client growth area chart, pipeline funnel bar chart
- **AI Features**:
  - Executive narrative: 3-5 paragraph summary generated from metrics data
  - Anomaly detection: flags metrics >30% outside 3-month average with AI-suggested causes
  - Graceful fallback: works fully without OPENAI_API_KEY
- **Widgets**: All existing widgets preserved + charts + AI sections
- **Status**: Complete

## Phase 39: Reports (AI-Enhanced)
- **Route**: `/reports`
- **API**: `/api/reports?type=weekly|clients|outreach&ai=true`
- **Purpose**: Generate internal reports with optional AI analysis
- **Report types**: Weekly Business Review, Client Report, Outreach Report
- **AI Features**:
  - AI toggle on report generation page
  - Per-report-type AI analysis (health scores, recommendations, risk flags)
  - Graceful fallback: works fully without OPENAI_API_KEY
- **Export**: Print-friendly view via window.print()
- **Status**: Complete

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
