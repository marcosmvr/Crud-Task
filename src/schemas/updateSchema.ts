import { z } from 'zod'

export const updateTaskSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().max(200).optional(),
  completed: z.boolean().optional(),
})
