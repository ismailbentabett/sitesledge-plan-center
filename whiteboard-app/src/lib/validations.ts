import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
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
