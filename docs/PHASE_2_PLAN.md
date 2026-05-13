# Phase 2 Plan — Sales & Growth Modules

> **Milestone**: 3 — Sales & Growth Modules
> **Phases**: 19–25
> **Status**: Not started

---

## Overview

Build outreach, scripts, pipeline, experiments, and funnel planning modules. These modules enable tracking sales activities, managing prospect pipelines, running experiments, and planning funnels.

---

## Database Models to Create

### 1. OutreachCampaign
- **Fields**: name, targetNicheId, offerId, channel, status, leadSource, messageVersion, callToAction, dailyVolume, sentCount, replyCount, positiveReplyCount, bookedCallCount, closedWonCount, notes
- **Calculations**: reply rate, positive reply rate, booked call rate, close rate
- **Statuses**: Draft, Active, Paused, Completed

### 2. Script
- **Fields**: title, type, channel, targetNicheId, offerId, body, status, notes
- **Types**: Cold Email, Cold Call, Voicemail, Follow-up, LinkedIn Message, SMS
- **Channels**: Email, Phone, LinkedIn, SMS, In-Person
- **Statuses**: Draft, Active, Archived

### 3. Prospect
- **Fields**: businessName, ownerName, nicheId, phone, email, website, googleRating, reviewCount, currentWebsiteQualityScore, painPoint, offerAngle, status, lastContactedAt, nextFollowUpAt, expectedMonthlyValue, closeProbability, notes
- **Statuses**: New, Contacted, Interested, Proposal Sent, Won, Lost

### 4. Experiment
- **Fields**: name, hypothesis, area, targetNicheId, offerId, outreachCampaignId, startDate, endDate, metricToImprove, baseline, result, decision, status, notes
- **Areas**: Outreach, Offer, Pricing, Channel, Funnel, Ad Creative
- **Decisions**: Scale, Keep, Kill, Inconclusive
- **Statuses**: Planned, Running, Completed, Archived

### 5. Funnel
- **Fields**: name, targetNicheId, offerId, trafficSource, landingPageUrl, calendarUrl, followUpSequence (JSON), conversionRate, costPerBookedCall, closeRate, status, notes
- **Statuses**: Draft, Testing, Active, Paused, Retired

---

## Routes to Create

| Route | Purpose |
|-------|---------|
| `/outreach` | Outreach campaigns list + create/edit |
| `/scripts` | Script library list + create/edit |
| `/pipeline` | Sales pipeline list + create/edit |
| `/experiments` | Experiment tracker list + create/edit |
| `/funnels` | Funnel planner list + create/edit |

---

## API Routes to Create

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/outreach` | GET, POST | Outreach campaigns CRUD |
| `/api/outreach/[id]` | GET, PATCH, DELETE | Single campaign |
| `/api/scripts` | GET, POST | Scripts CRUD |
| `/api/scripts/[id]` | GET, PATCH, DELETE | Single script |
| `/api/pipeline` | GET, POST | Prospects CRUD |
| `/api/pipeline/[id]` | GET, PATCH, DELETE | Single prospect |
| `/api/experiments` | GET, POST | Experiments CRUD |
| `/api/experiments/[id]` | GET, PATCH, DELETE | Single experiment |
| `/api/funnels` | GET, POST | Funnels CRUD |
| `/api/funnels/[id]` | GET, PATCH, DELETE | Single funnel |

---

## Validations to Add

- `outreachCampaignSchema`
- `scriptSchema`
- `prospectSchema`
- `experimentSchema`
- `funnelSchema`

---

## Sidebar Updates

Update the Sales section in `(dashboard)/layout.tsx` to remove `disabled: true` from:
- Outreach
- Scripts
- Pipeline
- Experiments
- Funnels

---

## Execution Order

1. Add new models to Prisma schema
2. Run `pnpm db:push`
3. Add Zod validations to `validations.ts`
4. Create API routes for each model
5. Create UI pages for each module
6. Enable sidebar links
7. Run `pnpm lint`, `pnpm typecheck`, `pnpm build`
8. Fix all errors
9. Commit

---

## Dependencies

- Milestone 2 must be complete (Niches and Offers models exist for linking)
- All Milestone 3 modules are independent of each other
