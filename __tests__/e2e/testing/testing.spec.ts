import request from 'supertest'
import { BLOGS, POSTS, TESTING_ALL_DATA } from '../../../src/common/constants/routes'
import { HttpStatus } from '../../../src/common/types/http-statuses.types'
import { closeDb, runDb } from '../../../src/db/mongo.db'
import { setupApp } from '../../../src/setupApp'

describe('Testing API', () => {
  const app = setupApp()

  beforeAll(async () => {
    await runDb()
  })

  afterAll(async () => {
    closeDb()
  })

  it('Should delete all blogs and posts', async () => {
    await request(app)
      .delete(TESTING_ALL_DATA)
      .expect(HttpStatus.NoContent)

    const blogsRes = await request(app).get(BLOGS)
    const postsRes = await request(app).get(POSTS)

    expect(blogsRes.body.items).toHaveLength(0)
    expect(postsRes.body).toHaveLength(0)
  })
})
