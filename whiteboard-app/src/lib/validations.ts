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
