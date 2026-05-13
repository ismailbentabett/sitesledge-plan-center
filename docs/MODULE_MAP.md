# Module Map — SiteSledge Command Center

## Phase 1 — Core Planning (Milestone 2)

### 1. Command Dashboard
- **Route**: `/dashboard`
- **Purpose**: Single-pane business overview
- **Data sources**: All Phase 1 modules
- **Widgets**: MRR, active clients, prospects, niche focus, offer focus, weekly priority, pinned notes, recent decisions, whiteboard count, financial summary
- **Status**: Partially exists (has MRR, clients, tasks, pillars, financials)

### 2. Business Model Planner
- **Route**: `/business-model`
- **Purpose**: Store/edit core business assumptions
- **Model**: `BusinessModel` (single record)
- **Fields**: name, targetCustomer, coreProblem, mainPromise, mechanism, priceMin/Max, setupFee, fulfillmentCostMin/Max, corePillars (JSON), acquisitionChannels, fulfillmentProcess, retentionMechanism, notes

### 3. Niche Research Hub
- **Route**: `/niches`, `/niches/[id]`
- **Purpose**: Evaluate and score target niches
- **Model**: `Niche`
- **Fields**: name, description, 12 scoring fields (1–5), opportunityScore (calculated), offerAngle, outreachAngle, objections, notes, status
- **Statuses**: Researching, Testing, Active, Paused, Rejected

### 4. Offer Builder
- **Route**: `/offers`, `/offers/[id]`
- **Purpose**: Build and track offer positioning
- **Model**: `Offer`
- **Fields**: name, targetNicheId, status, priceMonthly, setupFee, mainPromise, mechanism, includedAssets, bonuses, guarantee, riskReversal, urgencyAngle, scarcityAngle, primaryObjection, objectionResponse, coldEmailVersion, coldCallVersion, landingPageHeadline, metaAdAngle, notes
- **Statuses**: Draft, Testing, Active, Paused, Retired

### 5. Financial Model
- **Route**: `/financial-model`
- **Purpose**: Model business economics with scenarios
- **Model**: `FinancialScenario`
- **Fields**: name, averageMonthlyPrice, setupFee, currentClients, newClientsPerMonth, monthlyChurnRate, vaSetupCost, softwareCostPerClient, monthlyFixedCosts, adSpend, bookedCallCost, closeRate, monthsToProject, notes
- **Calculations**: MRR, ARR, setup revenue, gross margin, projected clients/MRR, churn, net new, fixed costs, monthly profit, break-even

### 6. Weekly Planning Room
- **Route**: `/weekly-planning`
- **Purpose**: Weekly business review and planning
- **Model**: `WeeklyPlan`
- **Fields**: weekStartDate, weekEndDate, previousWeekReview, whatWorked, whatDidNotWork, mainBottleneck, mainMetric, weeklyGoal, topPriorities, salesActions, fulfillmentActions, systemActions, delegatedTasks, stoppedTasks, notes

### 7. Notes
- **Route**: `/notes`, `/notes/[id]`
- **Purpose**: Quick notes with pinning and tags
- **Model**: `Note`
- **Fields**: title, body, tags (string[]), pinned, linkedType, linkedId

### 8. Decision Log
- **Route**: `/decisions`, `/decisions/[id]`
- **Purpose**: Track important business decisions
- **Model**: `Decision`
- **Fields**: title, context, optionsConsidered, chosenOption, reason, expectedResult, reviewDate, outcome, status
- **Statuses**: Open, Decided, Reviewing, Validated, Reversed

### 9. Whiteboard (existing)
- **Route**: `/whiteboards`, `/boards/[id]`, `/share/[publicId]`
- **Purpose**: Visual planning canvas
- **Model**: `Board` (existing)
- **Enhancement**: Add `linkedType`, `linkedId` fields for linking to planning records

## Phase 2 — Sales & Growth (Milestone 3)

### 10. Outreach Planner
- **Route**: `/outreach`
- **Model**: `OutreachCampaign`
- **Fields**: name, targetNicheId, offerId, channel, status, leadSource, messageVersion, callToAction, dailyVolume, sentCount, replyCount, positiveReplyCount, bookedCallCount, closedWonCount, notes
- **Calculations**: reply rate, positive reply rate, booked call rate, close rate

### 11. Script Library
- **Route**: `/scripts`
- **Model**: `Script`
- **Fields**: title, type, channel, targetNicheId, offerId, body, status, notes

### 12. Sales Pipeline
- **Route**: `/pipeline`
- **Model**: `Prospect`
- **Fields**: businessName, ownerName, nicheId, phone, email, website, googleRating, reviewCount, currentWebsiteQualityScore, painPoint, offerAngle, status, lastContactedAt, nextFollowUpAt, expectedMonthlyValue, closeProbability, notes

### 13. Experiment Tracker
- **Route**: `/experiments`
- **Model**: `Experiment`
- **Fields**: name, hypothesis, area, targetNicheId, offerId, outreachCampaignId, startDate, endDate, metricToImprove, baseline, result, decision, status, notes

### 14. Funnel Planner
- **Route**: `/funnels`
- **Model**: `Funnel`
- **Fields**: name, targetNicheId, offerId, trafficSource, landingPageUrl, calendarUrl, followUpSequence (JSON), conversionRate, costPerBookedCall, closeRate, status, notes

## Phase 3 — Fulfillment & Operations (Milestone 4)

### 15. Client Tracker
- **Route**: `/clients`
- **Model**: `Client` (existing, extended)
- **New fields**: nicheId, packageName, websiteUrl, ghlSubaccountUrl, googleBusinessProfileUrl, accessNotes, churnRisk, renewalDate

### 16. Fulfillment Tracker
- **Route**: `/fulfillment`
- **Model**: `FulfillmentTask`
- **Fields**: clientId, title, description, stage, status, assignedTo, priority, dueDate, checklist (JSON), qaStatus, notes

### 17. SOP Library
- **Route**: `/sops`
- **Model**: `SOP`
- **Fields**: title, category, purpose, steps (JSON), requiredTools, inputs, outputs, owner, estimatedMinutes, checklist, loomUrl, status

### 18. VA Task System
- **Route**: `/va-tasks`
- **Model**: `VATask` (existing, extended)
- **New fields**: assignedVAName, checklist (JSON), files (JSON), qaStatus

### 19. Automation Map
- **Route**: `/automations`
- **Model**: `AutomationTemplate`
- **Fields**: name, purpose, trigger, action, packageLevel, ghlWorkflowName, requiredInputs, setupSteps, testingSteps, failureCases, status, notes

### 20. Website Template Library
- **Route**: `/website-templates`
- **Model**: `WebsiteTemplate`
- **Fields**: name, nicheId, pagesIncluded, heroHeadline, sections (JSON), cta, seoKeywords, exampleUrl, status, conversionNotes

### 21. Review System Planner
- **Route**: `/reviews`
- **Model**: `ReviewTracker`
- **Fields**: clientId, currentGoogleRating, currentReviewCount, targetReviewCount, reviewRequestAutomationStatus, reviewRequestMessage, reviewLink, newReviewsThisMonth, negativeReviews, responseNeeded, notes

### 22. Churn & Retention Planner
- **Route**: `/retention`
- **Model**: `RetentionPlaybook`
- **Fields**: name, trigger, timing, message, actionSteps, status, notes

## Phase 4 — Data & Reports (Milestone 5)

### 23. CSV Import/Data Room
- **Route**: `/imports`
- **Models**: `ImportBatch`, `ImportedRecord`
- **Features**: Upload CSV, preview, column mapping, history

### 24. Metrics Dashboard
- **Route**: `/metrics`
- **Purpose**: Aggregated metrics from all modules
- **No new models** — reads from existing data

### 25. Reports
- **Route**: `/reports`
- **Purpose**: Generate internal reports from DB records
- **No new models** — reads and formats existing data

### 26. Integration Placeholders
- **Route**: `/integrations`
- **Model**: `IntegrationConnection`
- **Fields**: provider, status, displayName, notes, lastSyncAt
