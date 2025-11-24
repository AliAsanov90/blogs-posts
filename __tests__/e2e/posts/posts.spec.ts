import request from 'supertest'
import { AUTH_HEADER_NAME } from '../../../src/common/constants/common'
import { Messages } from '../../../src/common/constants/messages'
import { POSTS } from '../../../src/common/constants/routes'
import { HttpStatus } from '../../../src/common/types/http-statuses.types'
import { generateAuthToken } from '../../../src/common/utils/generate-auth-token'
import { closeDb, runDb } from '../../../src/db/mongo.db'
import { BlogInput, BlogOutput } from '../../../src/features/blogs/types/blog.types'
import { PostInput, PostViewModel } from '../../../src/features/posts/types/post.types'
import { setupApp } from '../../../src/setupApp'
import { blogsTestManager } from '../../utils/blogs.util'
import { clearDb } from '../../utils/clearDb.util'

const testBlogData: BlogInput = {
  name: 'Test name',
  description: 'Test description',
  websiteUrl: 'https://website-url.com',
}

const testPostData: PostInput = {
  title: 'Test title',
  shortDescription: 'Test short description',
  content: 'Test content',
  blogId: '691fe02e62d2354296c74857'
}

const incorrectTestPostData: PostInput = {
  title: '         ',
  shortDescription: 'Test short description',
  content: '',
  blogId: 'blogId'
}

let createdBlog: BlogOutput
let createdPost: PostViewModel

describe('Posts API', () => {
  const app = setupApp()
  const { authToken } = generateAuthToken()

  beforeAll(async () => {
    await runDb()
  })

  afterAll(async () => {
    await clearDb(app)
    closeDb()
  })

  it('Should create a post; POST /posts', async () => {
    const createdBlogRes = await blogsTestManager.create({
      app,
      token: authToken,
      data: testBlogData,
    })

    testPostData.blogId = createdBlogRes.body.id

    const createdRes = await request(app)
      .post(POSTS)
      .set(AUTH_HEADER_NAME, authToken)
      .send(testPostData)
      .expect(HttpStatus.Created)

    createdBlog = createdBlogRes.body
    createdPost = createdRes.body
  })

  it('Should not create a post if blog does not exist; POST /posts', async () => {
    await request(app)
      .post(POSTS)
      .set(AUTH_HEADER_NAME, authToken)
      .send({ ...testPostData, blogId: '691fe02e62d2354296c74851' })
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
      .put(POSTS + '/691fe02e62d2354296c74851')
      .set(AUTH_HEADER_NAME, authToken)
      .send({ ...testPostData, title: 'Test title 3' })
      .expect(HttpStatus.NotFound)
  })

  it('Should not update a post if given blogId is different from post.blogId; UPDATE /posts/:id', async () => {
    const differentBlogRes = await blogsTestManager.create({
      app,
      token: authToken,
      data: testBlogData,
    })

    const res = await request(app)
      .put(POSTS + `/${createdPost.id}`)
      .set(AUTH_HEADER_NAME, authToken)
      .send({
        ...testPostData,
        title: 'Test title 4',
        blogId: differentBlogRes.body.id
      })
      .expect(HttpStatus.BadRequest)

    expect(res.body.message).toBe(Messages.BlogNotCorrespondPost)
  })

  it('Should delete a post; DELETE /posts/:id', async () => {
    const postsResBefore = await request(app)
      .get(POSTS)
      .expect(HttpStatus.Ok)

    expect(postsResBefore.body.length).toBe(1)

    await request(app)
      .get(POSTS + `/${createdPost.id}`)
      .expect(HttpStatus.Ok)

    await request(app)
      .delete(POSTS + `/${createdPost.id}`)
      .set(AUTH_HEADER_NAME, authToken)
      .expect(HttpStatus.NoContent)

    await request(app)
      .get(POSTS + `/${createdPost.id}`)
      .expect(HttpStatus.NotFound)

    const postsResAfter = await request(app)
      .get(POSTS)
      .expect(HttpStatus.Ok)

    expect(postsResAfter.body.length).toBe(0)
  })

  it('Should not delete a not found post; DELETE /posts/:id', async () => {
    await request(app)
      .delete(POSTS + '/691fe02e62d2354296c74851')
      .set(AUTH_HEADER_NAME, authToken)
      .expect(HttpStatus.NotFound)
  })
})
