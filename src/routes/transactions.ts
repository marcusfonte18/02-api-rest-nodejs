import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto from 'node:crypto'
import { z } from 'zod'

export async function transactionsRoutes(app: FastifyInstance) {
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
