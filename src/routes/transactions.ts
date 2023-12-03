import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'
import { z } from 'zod'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select()

    // retornar dentro de um objeto para ser mais fácil
    //  adicionar informacoes no futuro
    return { transactions }
  })

  app.get('/:id', async (req) => {
    const getTransactionsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionsParamsSchema.parse(req.params)

    const transaction = await knex('transactions').where('id', id).first()

    return { transaction }
  })

  app.post('/', async (request, reply) => {
    const createTransactionsBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionsBodySchema.parse(
      request.body,
    )

    const amountWithType = type === 'credit' ? amount : amount * 1

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: amountWithType,
    })

    return reply.status(201).send()
  })
}
