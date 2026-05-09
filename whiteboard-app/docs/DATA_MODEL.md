# Data Model — SiteSledge Command Center

## Existing Models (keep and extend)

### Board
```prisma
model Board {
  id         String   @id @default(cuid())
  title      String   @default("Untitled Board")
  stateJson  String   @default("{}")
  isPublic   Boolean  @default(false)
  publicId   String   @unique @default(cuid())
  linkedType String?  // "niche", "offer", "business-model", etc.
  linkedId   String?  // ID of the linked record
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

### Client (extended)
```prisma
model Client {
  id                    String       @id @default(cuid())
  businessName          String
  contactName           String
  email                 String
  phone                 String
  businessType          String       // legacy — will map to niche
  nicheId               String?      // NEW: relation to Niche
  packageName           String?      // NEW
  monthlyPrice          Int
  setupFee              Int?         // NEW
  status                ClientStatus @default(prospect)
  startDate             DateTime?
  churnDate             DateTime?
  renewalDate           DateTime?    // NEW
  websiteUrl            String?      // NEW
  ghlSubaccountUrl      String?      // NEW
  googleBusinessProfileUrl String?   // NEW
  accessNotes           String?      // NEW
  churnRisk             ChurnRisk?   // NEW: low, medium, high, critical
  notes                 String       @default("")
  pillars               Pillar[]
  vaTasks               VATask[]
  reviewTracker         ReviewTracker? // NEW
  createdAt             DateTime     @default(now())
  updatedAt             DateTime     @updatedAt
}
```

### Pillar (keep as-is)
```prisma
model Pillar {
  id          String       @id @default(cuid())
  clientId    String
  client      Client       @relation(fields: [clientId], references: [id], onDelete: Cascade)
  type        PillarType
  status      PillarStatus @default(not_started)
  notes       String       @default("")
  setupDate   DateTime?
  lastReview  DateTime?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@unique([clientId, type])
}
```

### FinancialRecord (keep as-is)
```prisma
model FinancialRecord {
  id              String   @id @default(cuid())
  year            Int
  month           Int
  mrr             Int
  newClients      Int      @default(0)
  churnedClients  Int      @default(0)
  churnedMrr      Int      @default(0)
  targetMrr       Int?
  notes           String   @default("")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([year, month])
}
```

### VATask (extended)
```prisma
model VATask {
  id          String       @id @default(cuid())
  title       String
  description String       @default("")
  clientId    String?
  client      Client?      @relation(fields: [clientId], references: [id], onDelete: SetNull)
  assignedTo  String       @default("")  // legacy — keep for backward compat
  assignedVAName String?   // NEW
  status      TaskStatus   @default(todo)
  priority    TaskPriority @default(medium)
  dueDate     DateTime?
  checklist   String       @default("[]")  // NEW: JSON array
  files       String       @default("[]")  // NEW: JSON array
  qaStatus    String?      // NEW
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}
```

## New Models (Milestone 2)

### BusinessModel
```prisma
model BusinessModel {
  id                  String   @id @default(cuid())
  name                String
  targetCustomer      String
  coreProblem         String
  mainPromise         String
  mechanism           String
  priceMin            Int
  priceMax            Int
  setupFee            Int?
  fulfillmentCostMin  Int?
  fulfillmentCostMax  Int?
  corePillars         String   @default("[]")  // JSON
  acquisitionChannels String   @default("")
  fulfillmentProcess  String   @default("")
  retentionMechanism  String   @default("")
  notes               String   @default("")
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

### Niche
```prisma
model Niche {
  id                          String   @id @default(cuid())
  name                        String
  description                 String   @default("")
  averageTicketValue          Int?
  repeatPurchasePotentialScore Int     @default(3)
  callVolumeScore             Int      @default(3)
  reviewImportanceScore       Int      @default(3)
  websiteQualityGapScore      Int      @default(3)
  competitionLevelScore       Int      @default(3)
  ownerSophisticationScore    Int      @default(3)
  urgencyScore                Int      @default(3)
  easeOfFindingLeadsScore     Int      @default(3)
  easeOfFulfillmentScore      Int      @default(3)
  retentionPotentialScore     Int      @default(3)
  affordabilityScore          Int      @default(3)
  offerAngle                  String   @default("")
  outreachAngle               String   @default("")
  objections                  String   @default("")
  notes                       String   @default("")
  status                      NicheStatus @default(researching)
  createdAt                   DateTime @default(now())
  updatedAt                   DateTime @updatedAt

  clients                     Client[]
  offers                      Offer[]
}
```

### Offer
```prisma
model Offer {
  id                  String      @id @default(cuid())
  name                String
  targetNicheId       String?
  targetNiche         Niche?      @relation(fields: [targetNicheId], references: [id])
  status              OfferStatus @default(draft)
  priceMonthly        Int
  setupFee            Int?
  mainPromise         String      @default("")
  mechanism           String      @default("")
  includedAssets      String      @default("")
  bonuses             String      @default("")
  guarantee           String      @default("")
  riskReversal        String      @default("")
  urgencyAngle        String      @default("")
  scarcityAngle       String      @default("")
  primaryObjection    String      @default("")
  objectionResponse   String      @default("")
  coldEmailVersion    String      @default("")
  coldCallVersion     String      @default("")
  landingPageHeadline String      @default("")
  metaAdAngle         String      @default("")
  notes               String      @default("")
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
}
```

### FinancialScenario
```prisma
model FinancialScenario {
  id                String   @id @default(cuid())
  name              String
  averageMonthlyPrice Int
  setupFee          Int?
  currentClients    Int      @default(0)
  newClientsPerMonth Int    @default(0)
  monthlyChurnRate  Float    @default(0)
  vaSetupCost       Int?
  softwareCostPerClient Int?
  monthlyFixedCosts Int      @default(0)
  adSpend           Int      @default(0)
  bookedCallCost    Int?
  closeRate         Float    @default(0)
  monthsToProject   Int      @default(12)
  notes             String   @default("")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

### WeeklyPlan
```prisma
model WeeklyPlan {
  id                String   @id @default(cuid())
  weekStartDate     DateTime
  weekEndDate       DateTime
  previousWeekReview String  @default("")
  whatWorked        String   @default("")
  whatDidNotWork    String   @default("")
  mainBottleneck    String   @default("")
  mainMetric        String   @default("")
  weeklyGoal        String   @default("")
  topPriorities     String   @default("")
  salesActions      String   @default("")
  fulfillmentActions String  @default("")
  systemActions     String   @default("")
  delegatedTasks    String   @default("")
  stoppedTasks      String   @default("")
  notes             String   @default("")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

### Note
```prisma
model Note {
  id         String   @id @default(cuid())
  title      String
  body       String   @default("")
  tags       String   @default("[]")  // JSON array
  pinned     Boolean  @default(false)
  linkedType String?
  linkedId   String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

### Decision
```prisma
model Decision {
  id               String      @id @default(cuid())
  title            String
  context          String      @default("")
  optionsConsidered String      @default("")
  chosenOption     String      @default("")
  reason           String      @default("")
  expectedResult   String      @default("")
  reviewDate       DateTime?
  outcome          String      @default("")
  status           DecisionStatus @default(open)
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
}
```

## New Models (Milestone 3)

### OutreachCampaign
```prisma
model OutreachCampaign {
  id                String          @id @default(cuid())
  name              String
  targetNicheId     String?
  offerId           String?
  channel           OutreachChannel
  status            CampaignStatus  @default(draft)
  leadSource        String          @default("")
  messageVersion    String          @default("")
  callToAction      String          @default("")
  dailyVolume       Int             @default(0)
  sentCount         Int             @default(0)
  replyCount        Int             @default(0)
  positiveReplyCount Int            @default(0)
  bookedCallCount   Int             @default(0)
  closedWonCount    Int             @default(0)
  notes             String          @default("")
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
}
```

### Script
```prisma
model Script {
  id            String       @id @default(cuid())
  title         String
  type          ScriptType
  channel       String       @default("")
  targetNicheId String?
  offerId       String?
  body          String
  status        ScriptStatus @default(draft)
  notes         String       @default("")
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}
```

### Prospect
```prisma
model Prospect {
  id                      String   @id @default(cuid())
  businessName            String
  ownerName               String   @default("")
  nicheId                 String?
  phone                   String   @default("")
  email                   String   @default("")
  website                 String   @default("")
  googleRating            Int?
  reviewCount             Int?
  currentWebsiteQualityScore Int?
  painPoint               String   @default("")
  offerAngle              String   @default("")
  status                  ProspectStatus @default(lead)
  lastContactedAt         DateTime?
  nextFollowUpAt          DateTime?
  expectedMonthlyValue    Int?
  closeProbability        Float?
  notes                   String   @default("")
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
}
```

### Experiment
```prisma
model Experiment {
  id                String        @id @default(cuid())
  name              String
  hypothesis        String
  area              ExperimentArea
  targetNicheId     String?
  offerId           String?
  outreachCampaignId String?
  startDate         DateTime?
  endDate           DateTime?
  metricToImprove   String        @default("")
  baseline          String        @default("")
  result            String        @default("")
  decision          ExperimentDecision?
  status            ExperimentStatus @default(planned)
  notes             String        @default("")
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
}
```

### Funnel
```prisma
model Funnel {
  id                String   @id @default(cuid())
  name              String
  targetNicheId     String?
  offerId           String?
  trafficSource     String   @default("")
  landingPageUrl    String   @default("")
  calendarUrl       String   @default("")
  followUpSequence  String   @default("[]")  // JSON
  conversionRate    Float?
  costPerBookedCall Int?
  closeRate         Float?
  status            FunnelStatus @default(draft)
  notes             String   @default("")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

## New Models (Milestone 4)

### FulfillmentTask
```prisma
model FulfillmentTask {
  id          String   @id @default(cuid())
  clientId    String
  title       String
  description String   @default("")
  stage       FulfillmentStage @default(payment_received)
  status      FulfillmentStatus @default(backlog)
  assignedTo  String   @default("")
  priority    TaskPriority @default(medium)
  dueDate     DateTime?
  checklist   String   @default("[]")  // JSON
  qaStatus    String?
  notes       String   @default("")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### SOP
```prisma
model SOP {
  id              String   @id @default(cuid())
  title           String
  category        SOPCategory
  purpose         String   @default("")
  steps           String   @default("[]")  // JSON
  requiredTools   String   @default("")
  inputs          String   @default("")
  outputs         String   @default("")
  owner           String   @default("")
  estimatedMinutes Int?
  checklist       String   @default("[]")  // JSON
  loomUrl         String   @default("")
  status          SOPStatus @default(draft)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### AutomationTemplate
```prisma
model AutomationTemplate {
  id              String   @id @default(cuid())
  name            String
  purpose         String   @default("")
  trigger         String   @default("")
  action          String   @default("")
  packageLevel    String   @default("")
  ghlWorkflowName String   @default("")
  requiredInputs  String   @default("")
  setupSteps      String   @default("")
  testingSteps    String   @default("")
  failureCases    String   @default("")
  status          AutomationStatus @default(draft)
  notes           String   @default("")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### WebsiteTemplate
```prisma
model WebsiteTemplate {
  id              String   @id @default(cuid())
  name            String
  nicheId         String?
  pagesIncluded   String   @default("[]")  // JSON
  heroHeadline    String   @default("")
  sections        String   @default("[]")  // JSON
  cta             String   @default("")
  seoKeywords     String   @default("")
  exampleUrl      String   @default("")
  status          TemplateStatus @default(draft)
  conversionNotes String   @default("")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### ReviewTracker
```prisma
model ReviewTracker {
  id                          String   @id @default(cuid())
  clientId                    String   @unique
  currentGoogleRating         Float    @default(0)
  currentReviewCount          Int      @default(0)
  targetReviewCount           Int      @default(0)
  reviewRequestAutomationStatus String @default("")
  reviewRequestMessage        String   @default("")
  reviewLink                  String   @default("")
  newReviewsThisMonth         Int      @default(0)
  negativeReviews             Int      @default(0)
  responseNeeded              Boolean  @default(false)
  notes                       String   @default("")
  createdAt                   DateTime @default(now())
  updatedAt                   DateTime @updatedAt
}
```

### RetentionPlaybook
```prisma
model RetentionPlaybook {
  id          String   @id @default(cuid())
  name        String
  trigger     String   @default("")
  timing      String   @default("")
  message     String   @default("")
  actionSteps String   @default("")
  status      PlaybookStatus @default(draft)
  notes       String   @default("")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## New Models (Milestone 5)

### ImportBatch
```prisma
model ImportBatch {
  id            String   @id @default(cuid())
  name          String
  sourceType    ImportSource
  targetType    ImportTarget
  fileName      String
  rowCount      Int      @default(0)
  status        ImportStatus @default(pending)
  columnMapping String   @default("{}")  // JSON
  errorSummary  String   @default("")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### ImportedRecord
```prisma
model ImportedRecord {
  id            String   @id @default(cuid())
  importBatchId String
  rawData       String   @default("{}")  // JSON
  mappedData    String   @default("{}")  // JSON
  status        ImportRecordStatus @default(pending)
  error         String   @default("")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### IntegrationConnection
```prisma
model IntegrationConnection {
  id         String   @id @default(cuid())
  provider   IntegrationProvider
  status     IntegrationStatus @default(planned)
  displayName String
  notes      String   @default("")
  lastSyncAt DateTime?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

## Enums

### Existing (keep)
```
ClientStatus: prospect, active, churned, paused
PillarType: seo_website, google_reviews, missed_call_textback, database_reactivation
PillarStatus: not_started, in_progress, active, paused
TaskStatus: todo, in_progress, done, archived
TaskPriority: low, medium, high, urgent
```

### New
```
NicheStatus: researching, testing, active, paused, rejected
OfferStatus: draft, testing, active, paused, retired
DecisionStatus: open, decided, reviewing, validated, reversed
OutreachChannel: cold_email, cold_call, instagram_dm, facebook_dm, linkedin, meta_ads, referral, other
CampaignStatus: draft, active, paused, completed, killed
ScriptType: cold_email, cold_call_opener, voicemail, sms, dm, follow_up, objection_response, breakup_message, sales_call, cancellation_save
ScriptStatus: draft, testing, active, retired
ProspectStatus: lead, contacted, replied, interested, booked_call, no_show, proposal_sent, closed_won, closed_lost, follow_up_later
ExperimentArea: niche, offer, outreach, pricing, landing_page, fulfillment, retention, ads, other
ExperimentDecision: scale, keep_testing, kill, modify
ExperimentStatus: planned, running, completed, archived
FunnelStatus: draft, active, paused, retired
FulfillmentStage: payment_received, onboarding_form, access_collected, website_started, website_completed, review_automation_installed, missed_call_textback_installed, database_reactivation_installed, quality_check, client_approval, launched
FulfillmentStatus: backlog, assigned, in_progress, waiting_for_access, waiting_for_client, ready_for_qa, changes_needed, complete
SOPCategory: sales, lead_scraping, cold_outreach, client_onboarding, website_setup, ghl_setup, review_automation, missed_call_textback, database_reactivation, quality_assurance, va_training, cancellation_handling, upsells
SOPStatus: draft, active, needs_update, retired
AutomationStatus: draft, active, testing, retired
TemplateStatus: draft, active, retired
PlaybookStatus: draft, active, retired
ChurnRisk: low, medium, high, critical
ImportSource: csv_upload, ghl_export, stripe_export, meta_ads_export, google_sheets_export, manual
ImportTarget: leads, prospects, clients, payments, campaigns, calls, appointments, tasks, reviews
ImportStatus: pending, processing, completed, failed
ImportRecordStatus: pending, mapped, imported, failed
IntegrationProvider: gohighlevel, stripe, meta_ads, google_sheets, gmail, google_business_profile
IntegrationStatus: planned, not_connected, connected, error
```
