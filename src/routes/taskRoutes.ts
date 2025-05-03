import { PrismaClient } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { taskSchema } from '../schemas/taskSchema'
import { z } from 'zod'
import { updateTaskSchema } from '../schemas/updateSchema'

export async function taskRoutes(app: FastifyInstance) {
  const prisma = new PrismaClient()

  app.post('/task', async (req, reply) => {
    const parsed = taskSchema.safeParse(req.body)

    if (!parsed.success) {
      return reply
        .status(400)
        .send({ error: 'Dados inválidos', details: parsed.error.format() })
    }

    const task = await prisma.task.create({
      data: {
        ...parsed.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    return reply.status(201).send(task)
  })

  app.get('/tasks', async (req, reply) => {
    const tasks = await prisma.task.findMany()
    return reply.send(tasks)
  })

  app.get('/tasks/:id', async (req, reply) => {
    const paramsSchema = z.object({
      id: z.coerce.number().int().positive('ID Inválido'),
    })

    const parsed = paramsSchema.safeParse(req.params)

    if (!parsed.success) {
      return reply
        .status(400)
        .send({ error: 'Dados inválidos', details: parsed.error.format() })
    }

    const task = await prisma.task.findUnique({ where: { id: parsed.data.id } })

    if (!task) {
      return reply.status(404).send({ error: 'Task não encontrada' })
    }
    return reply.status(200).send(task)
  })

  app.put('/tasks/:id', async (req, reply) => {
    const paramsSchema = z.object({
      id: z.coerce.number().int().positive('ID Inválido'),
    })

    const parsedParams = paramsSchema.safeParse(req.params)
    const parsedBody = updateTaskSchema.safeParse(req.body)

    if (!parsedParams.success || !parsedBody.success) {
      return reply.status(400).send({
        error: 'Dados inválidos',
        details: {
          params: parsedParams.error?.format(),
          body: parsedBody.error?.format(),
        },
      })
    }

    const task = await prisma.task
      .update({
        where: { id: parsedParams.data.id },
        data: { ...parsedBody.data, updatedAt: new Date() },
      })
      .catch(() => null)

    if (!task) {
      return reply.status(404).send({ error: 'Task não encontrada' })
    }
    return reply.send(task)
  })

  app.delete('/tasks/:id', async (req, reply) => {
    const paramsSchema = z.object({
      id: z.coerce.number().int().positive('ID Inválido'),
    })

    const parsed = paramsSchema.safeParse(req.params)

    if (!parsed.success) {
      return reply
        .status(400)
        .send({ error: 'Dados inválidos', details: parsed.error.format() })
    }

    const deleted = await prisma.task
      .delete({
        where: { id: parsed.data.id },
      })
      .catch(() => null)

    if (!deleted) {
      return reply.status(404).send({ error: 'Task não encontrada' })
    }

    return reply.status(204).send()
  })
}
