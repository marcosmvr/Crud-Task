import { z } from 'zod'

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, 'O titulo deve ter pelo menos 3 caracteres')
    .max(100, 'O titulo deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .max(200, 'A descrição não pode passar de 200 caracteres')
    .optional(),
  completed: z.boolean().default(false),
})
