import request from 'supertest'
import { AUTH_HEADER_NAME } from '../../../src/common/constants/common'
import { BLOGS, POSTS, TESTING_ALL_DATA, USERS } from '../../../src/common/constants/routes'
import { HttpStatus } from '../../../src/common/types/http-statuses.types'
import { generateAuthToken } from '../../../src/common/utils/generate-auth-token'
import { closeDb, runDb } from '../../../src/db/mongo.db'
import { PostOutput } from '../../../src/features/posts/types/post.types'
import { setupApp } from '../../../src/setupApp'
import { getCommentsRoute } from '../../utils/test-helpers.util'

describe('Testing API', () => {
  const app = setupApp()

  beforeAll(async () => {
    await runDb()
  })

  afterAll(async () => {
    closeDb()
  })

  it('Should delete all blogs and posts', async () => {
    await request(app).delete(TESTING_ALL_DATA).expect(HttpStatus.NoContent)

    const blogsRes = await request(app).get(BLOGS)

    const postsRes = await request(app).get(POSTS)

    const usersRes = await request(app)
      .get(USERS)
      .set(AUTH_HEADER_NAME, generateAuthToken().authToken)

    await Promise.all(
      postsRes.body.items.map(async (post: PostOutput) => {
        const commentsRes = await request(app).get(getCommentsRoute(post.id))
        expect(commentsRes.body.items).toHaveLength(0)
      }),
    )

    expect(blogsRes.body.items).toHaveLength(0)
    expect(postsRes.body.items).toHaveLength(0)
    expect(usersRes.body.items).toHaveLength(0)
  })
})
