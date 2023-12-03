import { afterAll, beforeAll, test } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

test('user can creat a new transaction', async () => {
  await request(app.server)
    .post('/transactions')
    .send({
      title: 'New Transactions',
      amount: 5000,
      type: 'credit',
    })
    .expect(201)
})