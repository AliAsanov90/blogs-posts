import request from 'supertest'
import { setupApp } from '../../src/setupApp'

describe('GET home route; /', () => {
  const app = setupApp()

  it('Should return "Hello world!!!"', async () => {
    const res = await request(app).get('/')

    expect(res.status).toBe(200)
    expect(res.text).toBe('Hello world!!!')
  })
})
