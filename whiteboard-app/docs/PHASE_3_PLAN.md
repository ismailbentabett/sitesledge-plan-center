# Phase 3 Plan — Fulfillment & Operations Modules

> **Milestone**: 4 — Fulfillment & Operations
> **Phases**: 26–35
> **Status**: Complete (schema, validations, API routes, UI pages, sidebar enabled)

---

## Overview

Build client management, fulfillment tracking, SOPs, VA tasks, automations, templates, reviews, and retention modules. These modules enable managing client relationships, tracking fulfillment progress, documenting processes, and maintaining client retention.

---

## Database Models to Update/Create

### 1. Client (Update existing)
- **New fields**: nicheId, packageName, websiteUrl, ghlSubaccountUrl, googleBusinessProfileUrl, accessNotes, churnRisk, renewalDate

### 2. FulfillmentTask (New)
- **Fields**: clientId, title, description, stage, status, assignedTo, priority, dueDate, checklist (JSON), qaStatus, notes
- **Stages**: Onboarding, Setup, Active, Review, Complete
- **Statuses**: Not Started, In Progress, Done, Blocked
- **QA Statuses**: Not Reviewed, Passed, Failed, Needs Revision

### 3. SOP (New)
- **Fields**: title, category, purpose, steps (JSON), requiredTools, inputs, outputs, owner, estimatedMinutes, checklist, loomUrl, status
- **Statuses**: Draft, Active, Under Review, Archived

### 4. VATask (Update existing)
- **New fields**: assignedVAName, checklist (JSON), files (JSON), qaStatus

### 5. AutomationTemplate (New)
- **Fields**: name, purpose, trigger, action, packageLevel, ghlWorkflowName, requiredInputs, setupSteps, testingSteps, failureCases, status, notes
- **Statuses**: Draft, Tested, Active, Deprecated

### 6. WebsiteTemplate (New)
- **Fields**: name, nicheId, pagesIncluded, heroHeadline, sections (JSON), cta, seoKeywords, exampleUrl, status, conversionNotes
- **Statuses**: Draft, Active, Archived

### 7. ReviewTracker (New)
- **Fields**: clientId, currentGoogleRating, currentReviewCount, targetReviewCount, reviewRequestAutomationStatus, reviewRequestMessage, reviewLink, newReviewsThisMonth, negativeReviews, responseNeeded, notes

### 8. RetentionPlaybook (New)
- **Fields**: name, trigger, timing, message, actionSteps, status, notes
- **Statuses**: Draft, Active, Archived

---

## Routes to Create

| Route | Purpose |
|-------|---------|
| `/clients` | Client tracker (update existing) |
| `/fulfillment` | Fulfillment task tracker |
| `/sops` | SOP library |
| `/va-tasks` | VA task system (update existing) |
| `/automations` | Automation map |
| `/website-templates` | Website template library |
| `/reviews` | Review system planner |
| `/retention` | Churn & retention planner |

---

## Sidebar Updates

Update the Clients and Systems sections in `(dashboard)/layout.tsx` to remove `disabled: true`.

---

## Execution Order

1. Add/update models in Prisma schema
2. Run `pnpm db:push`
3. Add/update Zod validations
4. Create/update API routes
5. Create/update UI pages
6. Enable sidebar links
7. Run `pnpm lint`, `pnpm typecheck`, `pnpm build`
8. Fix all errors
9. Commit
