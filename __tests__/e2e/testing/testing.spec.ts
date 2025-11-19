import request from 'supertest'
import { BLOGS, POSTS, TESTING_ALL_DATA } from '../../../src/core/constants/routes'
import { HttpStatus } from '../../../src/core/types/http-statuses'
import { setupApp } from '../../../src/setupApp'

describe('Testing API', () => {
  const app = setupApp()

  it('Should delete all blogs and posts', async () => {
    const res = await request(app).delete(TESTING_ALL_DATA)
    const blogsRes = await request(app).get(BLOGS)
    const postsRes = await request(app).get(POSTS)

    expect(res.status).toBe(HttpStatus.NoContent)
    expect(blogsRes.body).toHaveLength(0)
    expect(postsRes.body).toHaveLength(0)
  });
});
