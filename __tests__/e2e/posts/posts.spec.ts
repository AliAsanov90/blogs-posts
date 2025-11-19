import request from 'supertest'
import { AUTH_HEADER_NAME } from '../../../src/core/constants/common'
import { POSTS, TESTING_ALL_DATA } from '../../../src/core/constants/routes'
import { HttpStatus } from '../../../src/core/types/http-statuses'
import { generateAuthToken } from '../../../src/core/utils/generate-auth-token'
import { Post, PostInput } from '../../../src/posts/types/post'
import { setupApp } from '../../../src/setupApp'
import { blogsTestManager } from '../../utils/blogs.util'
import { testBlogData } from '../blogs/blogs.spec'

const testPostData: PostInput = {
  title: 'Test title',
  shortDescription: 'Test short description',
  content: 'Test content',
  blogId: '1'
}

const incorrectTestPostData: PostInput = {
  title: '         ',
  shortDescription: 'Test short description',
  content: '',
  blogId: 'blogId'
}

let createdPost: Post

describe('Posts API', () => {
  const app = setupApp()
  const { authToken } = generateAuthToken()

  beforeAll(async () => {
    await request(app).delete(TESTING_ALL_DATA).expect(HttpStatus.NoContent)
  })

  it('Should create a post; POST /posts', async () => {
    const createdBlogRes = await blogsTestManager.create({
      app,
      token: authToken,
      data: testBlogData,
    })

    expect(createdBlogRes.body.id).toBe(testPostData.blogId)

    const createdRes = await request(app)
      .post(POSTS)
      .set(AUTH_HEADER_NAME, authToken)
      .send(testPostData)
      .expect(HttpStatus.Created)

    createdPost = createdRes.body
  })

  it('Should not create a post if blog does not exist; POST /posts', async () => {
    await request(app)
      .post(POSTS)
      .set(AUTH_HEADER_NAME, authToken)
      .send({ ...testPostData, blogId: '2' })
      .expect(HttpStatus.NotFound)
  })

  it('Should not create a post if blogId is not passed in req.body; POST /posts', async () => {
    const { blogId, ...restTestPostData } = testPostData

    await request(app)
      .post(POSTS)
      .set(AUTH_HEADER_NAME, authToken)
      .send(restTestPostData)
      .expect(HttpStatus.BadRequest)
  })

  it('Should not create a post without auth header; POST /posts', async () => {
    await request(app)
      .post(POSTS)
      .send(testPostData)
      .expect(HttpStatus.Unauthorized)
  })

  it('Should not create a post with incorrect auth token; POST /posts', async () => {
    await request(app)
      .post(POSTS)
      .set(AUTH_HEADER_NAME, 'Basic sfsdfsdsdfsdsf')
      .send(testPostData)
      .expect(HttpStatus.Unauthorized)
  })

  it('Should not create a post if body is incorrect; POST /posts', async () => {
    await request(app)
      .post(POSTS)
      .set(AUTH_HEADER_NAME, authToken)
      .send(incorrectTestPostData)
      .expect(HttpStatus.BadRequest)
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
      .set(AUTH_HEADER_NAME, authToken)
      .send({ ...testPostData, title: 'Test title 2' })
      .expect(HttpStatus.NoContent)

    const updatedPostRes = await request(app)
      .get(POSTS + `/${createdPost.id}`)
      .expect(HttpStatus.Ok)

    expect(updatedPostRes.body.title).toBe('Test title 2')
  })

  it('Should not update a not found post; UPDATE /posts/:id', async () => {
    await request(app)
      .put(POSTS + '/2')
      .set(AUTH_HEADER_NAME, authToken)
      .send({ ...testPostData, title: 'Test title 3' })
      .expect(HttpStatus.NotFound)
  })

  it('Should delete a post; DELETE /posts/:id', async () => {
    await request(app)
      .delete(POSTS + `/${createdPost.id}`)
      .set(AUTH_HEADER_NAME, authToken)
      .expect(HttpStatus.NoContent)

    await request(app)
      .get(POSTS + `/${createdPost.id}`)
      .expect(HttpStatus.NotFound)

    const postsRes = await request(app)
      .get(POSTS)
      .expect(HttpStatus.Ok)

    expect(postsRes.body.length).toBe(0)
  })

  it('Should not delete a not found post; DELETE /posts/:id', async () => {
    await request(app)
      .delete(POSTS + '/2')
      .set(AUTH_HEADER_NAME, authToken)
      .expect(HttpStatus.NotFound)
  })
})
