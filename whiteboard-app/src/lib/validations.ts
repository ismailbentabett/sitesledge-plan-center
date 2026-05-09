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
})

export const updateVATaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  assignedTo: z.string().max(100).optional(),
  status: z.enum(['todo', 'in_progress', 'done', 'archived']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  clientId: z.string().cuid().optional().nullable(),
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
