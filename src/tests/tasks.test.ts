import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { app } from '../server'
import request from 'supertest'

let createdTaskId = ''

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('POST /task', () => {
  it('deve criar uma task', async () => {
    const res = await request(app.server).post('/task').send({
      title: 'Estudar alemão',
      description: 'Estudar alemão por 2 horas',
    })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.title).toBe('Estudar alemão')

    console.log('ID CRIADO', res.body)

    createdTaskId = res.body.id
  })

  it('deve dar erro com título curto', async () => {
    const res = await request(app.server).post('/task').send({ title: 'Oi' })

    expect(res.status).toBe(400)
  })

  it('deve buscar uma task por ID', async () => {
    const res = await request(app.server).get(`/tasks/${createdTaskId}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('id', createdTaskId)
  })

  it('deve atualizar uma task', async () => {
    const res = await request(app.server)
      .put(`/tasks/${createdTaskId}`)
      .send({ completed: true })

    expect(res.status).toBe(200)
    expect(res.body.completed).toBe(true)
  })

  it('deve deletar uma task', async () => {
    const res = await request(app.server).delete(`/tasks/${createdTaskId}`)

    expect(res.status).toBe(204)
  })
})
