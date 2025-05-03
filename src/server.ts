import fastify from 'fastify'
import { taskRoutes } from './routes/taskRoutes'

export const app = fastify()

app.register(taskRoutes)

app.listen({ port: 3000 }, () => {
  console.log('Servidor Rodando na porta 3000')
})
