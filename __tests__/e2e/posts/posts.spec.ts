import request from 'supertest'
import { POSTS, TESTING_ALL_DATA } from '../../../src/core/constants/routes'
import { HttpStatus } from '../../../src/core/types/http-statuses'
import { generateAuthToken } from '../../../src/core/utils/generate-auth-token'
import { Post, PostInput } from '../../../src/posts/types/post'
import { setupApp } from '../../../src/setupApp'
import { blogsTestManager } from '../../utils/blogs.util'

describe('Posts API', () => {
  const app = setupApp()

  const { authToken } = generateAuthToken()

  const testPostData: PostInput = {
    title: 'Test title',
    shortDescription: 'Test short description',
    content: 'Test content',
    blogId: '1'
  }

  let createdPost: Post

  beforeAll(async () => {
    await request(app).delete(TESTING_ALL_DATA).expect(HttpStatus.NoContent)
  })

  it('Should create a post; POST /posts', async () => {
    const createdBlogRes = await blogsTestManager.create(app)

    expect(createdBlogRes.body.id).toBe(testPostData.blogId)

    const createdRes = await request(app)
      .post(POSTS)
      .set('Authorization', authToken)
      .send(testPostData)
      .expect(HttpStatus.Created)

    createdPost = createdRes.body
  })

  it('Should get all posts; GET /posts', async () => {
    const getAllPostsRes = await request(app)
      .get(POSTS)
      .expect(HttpStatus.Ok)

    expect(getAllPostsRes.body).toBeInstanceOf(Array)
    expect(getAllPostsRes.body.length).toBe(1)
  })

  it('Should get one post; GET /posts/:id', async () => {
    const getCreatedPostRes = await request(app)
      .get(POSTS + `/${createdPost.id}`)
      .expect(HttpStatus.Ok)

    expect(getCreatedPostRes.body.id).toBe(createdPost.id)
  })

  it('Should update a post; PUT /posts/:id', async () => {
    await request(app)
      .put(`${POSTS}/${createdPost.id}`)
      .set('Authorization', authToken)
      .send({ ...testPostData, title: 'Test title 2' })
      .expect(HttpStatus.NoContent)

    const updatedPostRes = await request(app)
      .get(POSTS + `/${createdPost.id}`)
      .expect(HttpStatus.Ok)

    expect(updatedPostRes.body.title).toBe('Test title 2')
  })

  it('Should delete a post; DELETE /posts/:id', async () => {
    await request(app)
      .delete(POSTS + `/${createdPost.id}`)
      .set('Authorization', authToken)
      .expect(HttpStatus.NoContent)

    await request(app)
      .get(POSTS + `/${createdPost.id}`)
      .expect(HttpStatus.NotFound)

    const postsRes = await request(app)
      .get(POSTS)
      .expect(HttpStatus.Ok)

    expect(postsRes.body.length).toBe(0)
  })
})
