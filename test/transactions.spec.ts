import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'

describe('Transactions Route', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('user can creat a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transactions',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    const createTransactionsResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transactions',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionsResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    // 2 jeitos de resolver o problema de esperar o ID mas ele é dinamico

    // desse jeito
    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New Transactions',
        amount: 5000,
      }),
    ])

    // Ou desse jeito
    // expect(listTransactionsResponse.body.transactions).toEqual([
    //   {
    //     id: expect.any(String),
    //   },
    // ])
  })
})
