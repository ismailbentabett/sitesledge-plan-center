import { z } from 'zod'

export const loginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

export const createBoardSchema = z.object({
  title: z.string().min(1).max(200).optional(),
})

export const updateBoardSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  stateJson: z.string().optional(),
  isPublic: z.boolean().optional(),
})

export const createClientSchema = z.object({
  businessName: z.string().min(1).max(200),
  contactName: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().min(1).max(50),
  businessType: z.string().min(1).max(100),
  status: z.enum(['prospect', 'active', 'churned', 'paused']).optional(),
  monthlyPrice: z.number().int().min(0).max(10000),
  startDate: z.string().datetime().optional(),
  notes: z.string().max(2000).optional(),
  nicheId: z.string().cuid().optional().nullable(),
  packageName: z.string().max(100).optional(),
  websiteUrl: z.string().max(500).optional(),
  ghlSubaccountUrl: z.string().max(500).optional(),
  googleBusinessProfileUrl: z.string().max(500).optional(),
  accessNotes: z.string().max(2000).optional(),
  churnRisk: z.enum(['low', 'medium', 'high']).optional(),
  renewalDate: z.string().datetime().optional().nullable(),
})

export const updateClientSchema = z.object({
  businessName: z.string().min(1).max(200).optional(),
  contactName: z.string().min(1).max(200).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).max(50).optional(),
  businessType: z.string().min(1).max(100).optional(),
  status: z.enum(['prospect', 'active', 'churned', 'paused']).optional(),
  monthlyPrice: z.number().int().min(0).max(10000).optional(),
  startDate: z.string().datetime().optional().nullable(),
  churnDate: z.string().datetime().optional().nullable(),
  notes: z.string().max(2000).optional(),
  nicheId: z.string().cuid().optional().nullable(),
  packageName: z.string().max(100).optional(),
  websiteUrl: z.string().max(500).optional(),
  ghlSubaccountUrl: z.string().max(500).optional(),
  googleBusinessProfileUrl: z.string().max(500).optional(),
  accessNotes: z.string().max(2000).optional(),
  churnRisk: z.enum(['low', 'medium', 'high']).optional(),
  renewalDate: z.string().datetime().optional().nullable(),
})

export const updatePillarSchema = z.object({
  status: z.enum(['not_started', 'in_progress', 'active', 'paused']).optional(),
  notes: z.string().max(2000).optional(),
  setupDate: z.string().datetime().optional().nullable(),
  lastReview: z.string().datetime().optional().nullable(),
})

export const createFinancialRecordSchema = z.object({
  year: z.number().int().min(2020).max(2099),
  month: z.number().int().min(1).max(12),
  mrr: z.number().int().min(0),
  newClients: z.number().int().min(0).optional(),
  churnedClients: z.number().int().min(0).optional(),
  churnedMrr: z.number().int().min(0).optional(),
  targetMrr: z.number().int().min(0).optional().nullable(),
  notes: z.string().max(2000).optional(),
})

export const createVATaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  assignedTo: z.string().max(100).optional(),
  status: z.enum(['todo', 'in_progress', 'done', 'archived']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  clientId: z.string().cuid().optional().nullable(),
  assignedVAName: z.string().max(100).optional(),
  checklist: z.string().max(5000).optional(),
  files: z.string().max(5000).optional(),
  qaStatus: z.enum(['not_reviewed', 'passed', 'failed', 'needs_revision']).optional(),
})

export const updateVATaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  assignedTo: z.string().max(100).optional(),
  status: z.enum(['todo', 'in_progress', 'done', 'archived']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  clientId: z.string().cuid().optional().nullable(),
  assignedVAName: z.string().max(100).optional(),
  checklist: z.string().max(5000).optional(),
  files: z.string().max(5000).optional(),
  qaStatus: z.enum(['not_reviewed', 'passed', 'failed', 'needs_revision']).optional(),
})

export const businessModelSchema = z.object({
  name: z.string().min(1).max(200),
  targetCustomer: z.string().min(1).max(500),
  coreProblem: z.string().min(1).max(500),
  mainPromise: z.string().min(1).max(500),
  mechanism: z.string().min(1).max(500),
  priceMin: z.number().int().min(0).max(10000),
  priceMax: z.number().int().min(0).max(10000),
  setupFee: z.number().int().min(0).max(10000).optional().nullable(),
  fulfillmentCostMin: z.number().int().min(0).max(10000).optional().nullable(),
  fulfillmentCostMax: z.number().int().min(0).max(10000).optional().nullable(),
  corePillars: z.string().max(2000).optional(),
  acquisitionChannels: z.string().max(2000).optional(),
  fulfillmentProcess: z.string().max(2000).optional(),
  retentionMechanism: z.string().max(2000).optional(),
  notes: z.string().max(2000).optional(),
})

export const nicheSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  averageTicketValue: z.number().int().min(0).max(100000).optional().nullable(),
  repeatPurchasePotentialScore: z.number().int().min(1).max(5).optional(),
  callVolumeScore: z.number().int().min(1).max(5).optional(),
  reviewImportanceScore: z.number().int().min(1).max(5).optional(),
  websiteQualityGapScore: z.number().int().min(1).max(5).optional(),
  competitionLevelScore: z.number().int().min(1).max(5).optional(),
  ownerSophisticationScore: z.number().int().min(1).max(5).optional(),
  urgencyScore: z.number().int().min(1).max(5).optional(),
  easeOfFindingLeadsScore: z.number().int().min(1).max(5).optional(),
  easeOfFulfillmentScore: z.number().int().min(1).max(5).optional(),
  retentionPotentialScore: z.number().int().min(1).max(5).optional(),
  affordabilityScore: z.number().int().min(1).max(5).optional(),
  offerAngle: z.string().max(1000).optional(),
  outreachAngle: z.string().max(1000).optional(),
  objections: z.string().max(1000).optional(),
  notes: z.string().max(2000).optional(),
  status: z.enum(['researching', 'testing', 'active', 'paused', 'rejected']).optional(),
})

export const offerSchema = z.object({
  name: z.string().min(1).max(200),
  targetNicheId: z.string().cuid().optional().nullable(),
  status: z.enum(['draft', 'testing', 'active', 'paused', 'retired']).optional(),
  priceMonthly: z.number().int().min(0).max(10000),
  setupFee: z.number().int().min(0).max(10000).optional().nullable(),
  mainPromise: z.string().max(500).optional(),
  mechanism: z.string().max(500).optional(),
  includedAssets: z.string().max(2000).optional(),
  bonuses: z.string().max(2000).optional(),
  guarantee: z.string().max(500).optional(),
  riskReversal: z.string().max(500).optional(),
  urgencyAngle: z.string().max(500).optional(),
  scarcityAngle: z.string().max(500).optional(),
  primaryObjection: z.string().max(500).optional(),
  objectionResponse: z.string().max(500).optional(),
  coldEmailVersion: z.string().max(2000).optional(),
  coldCallVersion: z.string().max(2000).optional(),
  landingPageHeadline: z.string().max(200).optional(),
  metaAdAngle: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
})

export const financialScenarioSchema = z.object({
  name: z.string().min(1).max(200),
  averageMonthlyPrice: z.number().int().min(0).max(10000),
  setupFee: z.number().int().min(0).max(10000).optional().nullable(),
  currentClients: z.number().int().min(0).max(10000),
  newClientsPerMonth: z.number().int().min(0).max(1000),
  monthlyChurnRate: z.number().min(0).max(1),
  vaSetupCost: z.number().int().min(0).max(10000).optional().nullable(),
  softwareCostPerClient: z.number().int().min(0).max(1000).optional().nullable(),
  monthlyFixedCosts: z.number().int().min(0).max(100000),
  adSpend: z.number().int().min(0).max(100000),
  bookedCallCost: z.number().int().min(0).max(10000).optional().nullable(),
  closeRate: z.number().min(0).max(1),
  monthsToProject: z.number().int().min(1).max(60),
  notes: z.string().max(2000).optional(),
})

export const weeklyPlanSchema = z.object({
  weekStartDate: z.string().datetime(),
  weekEndDate: z.string().datetime(),
  previousWeekReview: z.string().max(2000).optional(),
  whatWorked: z.string().max(2000).optional(),
  whatDidNotWork: z.string().max(2000).optional(),
  mainBottleneck: z.string().max(500).optional(),
  mainMetric: z.string().max(200).optional(),
  weeklyGoal: z.string().max(500).optional(),
  topPriorities: z.string().max(2000).optional(),
  salesActions: z.string().max(2000).optional(),
  fulfillmentActions: z.string().max(2000).optional(),
  systemActions: z.string().max(2000).optional(),
  delegatedTasks: z.string().max(2000).optional(),
  stoppedTasks: z.string().max(2000).optional(),
  notes: z.string().max(2000).optional(),
})

export const noteSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().max(5000).optional(),
  tags: z.string().max(500).optional(),
  pinned: z.boolean().optional(),
  linkedType: z.string().max(100).optional().nullable(),
  linkedId: z.string().cuid().optional().nullable(),
})

export const decisionSchema = z.object({
  title: z.string().min(1).max(200),
  context: z.string().max(2000).optional(),
  optionsConsidered: z.string().max(2000).optional(),
  chosenOption: z.string().max(1000).optional(),
  reason: z.string().max(1000).optional(),
  expectedResult: z.string().max(500).optional(),
  reviewDate: z.string().datetime().optional().nullable(),
  outcome: z.string().max(1000).optional(),
  status: z.enum(['open', 'decided', 'reviewing', 'validated', 'reversed']).optional(),
})

export const outreachCampaignSchema = z.object({
  name: z.string().min(1).max(200),
  targetNicheId: z.string().cuid().optional().nullable(),
  offerId: z.string().cuid().optional().nullable(),
  channel: z.string().max(100).optional(),
  status: z.enum(['draft', 'active', 'paused', 'completed']).optional(),
  leadSource: z.string().max(200).optional(),
  messageVersion: z.string().max(200).optional(),
  callToAction: z.string().max(500).optional(),
  dailyVolume: z.number().int().min(0).max(10000).optional(),
  sentCount: z.number().int().min(0).optional(),
  replyCount: z.number().int().min(0).optional(),
  positiveReplyCount: z.number().int().min(0).optional(),
  bookedCallCount: z.number().int().min(0).optional(),
  closedWonCount: z.number().int().min(0).optional(),
  notes: z.string().max(2000).optional(),
})

export const scriptSchema = z.object({
  title: z.string().min(1).max(200),
  type: z.enum(['cold_email', 'cold_call', 'voicemail', 'follow_up', 'linkedin_message', 'sms']).optional(),
  channel: z.enum(['email', 'phone', 'linkedin', 'sms', 'in_person']).optional(),
  targetNicheId: z.string().cuid().optional().nullable(),
  offerId: z.string().cuid().optional().nullable(),
  body: z.string().max(5000).optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
  notes: z.string().max(2000).optional(),
})

export const prospectSchema = z.object({
  businessName: z.string().min(1).max(200),
  ownerName: z.string().max(200).optional(),
  nicheId: z.string().cuid().optional().nullable(),
  phone: z.string().max(50).optional(),
  email: z.string().email().or(z.literal('')).optional(),
  website: z.string().max(500).optional(),
  googleRating: z.number().min(0).max(5).optional().nullable(),
  reviewCount: z.number().int().min(0).optional().nullable(),
  currentWebsiteQualityScore: z.number().int().min(0).max(10).optional(),
  painPoint: z.string().max(1000).optional(),
  offerAngle: z.string().max(500).optional(),
  status: z.enum(['new', 'contacted', 'interested', 'proposal_sent', 'won', 'lost']).optional(),
  lastContactedAt: z.string().datetime().optional().nullable(),
  nextFollowUpAt: z.string().datetime().optional().nullable(),
  expectedMonthlyValue: z.number().int().min(0).optional(),
  closeProbability: z.number().min(0).max(1).optional(),
  notes: z.string().max(2000).optional(),
})

export const experimentSchema = z.object({
  name: z.string().min(1).max(200),
  hypothesis: z.string().max(2000).optional(),
  area: z.enum(['outreach', 'offer', 'pricing', 'channel', 'funnel', 'ad_creative']).optional(),
  targetNicheId: z.string().cuid().optional().nullable(),
  offerId: z.string().cuid().optional().nullable(),
  outreachCampaignId: z.string().cuid().optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  metricToImprove: z.string().max(200).optional(),
  baseline: z.string().max(1000).optional(),
  result: z.string().max(2000).optional(),
  decision: z.enum(['scale', 'keep', 'kill', 'inconclusive']).optional(),
  status: z.enum(['planned', 'running', 'completed', 'archived']).optional(),
  notes: z.string().max(2000).optional(),
})

export const funnelSchema = z.object({
  name: z.string().min(1).max(200),
  targetNicheId: z.string().cuid().optional().nullable(),
  offerId: z.string().cuid().optional().nullable(),
  trafficSource: z.string().max(200).optional(),
  landingPageUrl: z.string().max(500).optional(),
  calendarUrl: z.string().max(500).optional(),
  followUpSequence: z.string().max(5000).optional(),
  conversionRate: z.number().min(0).max(1).optional(),
  costPerBookedCall: z.number().int().min(0).optional(),
  closeRate: z.number().min(0).max(1).optional(),
  status: z.enum(['draft', 'testing', 'active', 'paused', 'retired']).optional(),
  notes: z.string().max(2000).optional(),
})

export const fulfillmentTaskSchema = z.object({
  clientId: z.string().cuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  stage: z.enum(['onboarding', 'setup', 'active', 'review', 'complete']).optional(),
  status: z.enum(['not_started', 'in_progress', 'done', 'blocked']).optional(),
  assignedTo: z.string().max(100).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  checklist: z.string().max(5000).optional(),
  qaStatus: z.enum(['not_reviewed', 'passed', 'failed', 'needs_revision']).optional(),
  notes: z.string().max(2000).optional(),
})

export const sopSchema = z.object({
  title: z.string().min(1).max(200),
  category: z.string().max(100).optional(),
  purpose: z.string().max(1000).optional(),
  steps: z.string().max(5000).optional(),
  requiredTools: z.string().max(1000).optional(),
  inputs: z.string().max(1000).optional(),
  outputs: z.string().max(1000).optional(),
  owner: z.string().max(100).optional(),
  estimatedMinutes: z.number().int().min(0).optional(),
  checklist: z.string().max(5000).optional(),
  loomUrl: z.string().max(500).optional(),
  status: z.enum(['draft', 'active', 'under_review', 'archived']).optional(),
  notes: z.string().max(2000).optional(),
})

export const automationTemplateSchema = z.object({
  name: z.string().min(1).max(200),
  purpose: z.string().max(1000).optional(),
  trigger: z.string().max(1000).optional(),
  action: z.string().max(1000).optional(),
  packageLevel: z.string().max(100).optional(),
  ghlWorkflowName: z.string().max(200).optional(),
  requiredInputs: z.string().max(2000).optional(),
  setupSteps: z.string().max(5000).optional(),
  testingSteps: z.string().max(5000).optional(),
  failureCases: z.string().max(5000).optional(),
  status: z.enum(['draft', 'tested', 'active', 'deprecated']).optional(),
  notes: z.string().max(2000).optional(),
})

export const websiteTemplateSchema = z.object({
  name: z.string().min(1).max(200),
  nicheId: z.string().cuid().optional().nullable(),
  pagesIncluded: z.string().max(2000).optional(),
  heroHeadline: z.string().max(500).optional(),
  sections: z.string().max(5000).optional(),
  cta: z.string().max(500).optional(),
  seoKeywords: z.string().max(1000).optional(),
  exampleUrl: z.string().max(500).optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
  conversionNotes: z.string().max(2000).optional(),
  notes: z.string().max(2000).optional(),
})

export const reviewTrackerSchema = z.object({
  clientId: z.string().cuid(),
  currentGoogleRating: z.number().min(0).max(5).optional(),
  currentReviewCount: z.number().int().min(0).optional(),
  targetReviewCount: z.number().int().min(0).optional(),
  reviewRequestAutomationStatus: z.string().max(100).optional(),
  reviewRequestMessage: z.string().max(2000).optional(),
  reviewLink: z.string().max(500).optional(),
  newReviewsThisMonth: z.number().int().min(0).optional(),
  negativeReviews: z.string().max(2000).optional(),
  responseNeeded: z.boolean().optional(),
  notes: z.string().max(2000).optional(),
})

export const retentionPlaybookSchema = z.object({
  name: z.string().min(1).max(200),
  trigger: z.string().max(500).optional(),
  timing: z.string().max(200).optional(),
  message: z.string().max(2000).optional(),
  actionSteps: z.string().max(5000).optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
  notes: z.string().max(2000).optional(),
})

export const importBatchSchema = z.object({
  name: z.string().min(1).max(200),
  source: z.string().max(100).optional(),
  recordCount: z.number().int().min(0).optional(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
  fileName: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
})

export const importedRecordSchema = z.object({
  importBatchId: z.string().cuid(),
  data: z.string().max(10000).optional(),
  status: z.enum(['pending', 'processed', 'error', 'skipped']).optional(),
  notes: z.string().max(2000).optional(),
})

export const integrationConnectionSchema = z.object({
  name: z.string().min(1).max(200),
  provider: z.string().max(100).optional(),
  apiKey: z.string().max(500).optional(),
  webhookUrl: z.string().max(500).optional(),
  status: z.enum(['disabled', 'active', 'error']).optional(),
  lastSyncAt: z.string().datetime().optional().nullable(),
  syncNotes: z.string().max(2000).optional(),
  notes: z.string().max(2000).optional(),
})
