import { Messages } from '../../../src/common/constants/messages'
import { HttpStatus } from '../../../src/common/types/http-statuses.types'
import { generateAuthToken } from '../../../src/common/utils/generate-auth-token'
import { closeDb, runDb } from '../../../src/db/mongo.db'
import { BlogInput, BlogOutput } from '../../../src/features/blogs/types/blog.types'
import { PostInput, PostOutput } from '../../../src/features/posts/types/post.types'
import { setupApp } from '../../../src/setupApp'
import { blogsTestManager } from '../../utils/blogs.util'
import { clearDb } from '../../utils/clearDb.util'
import { postsTestManager } from '../../utils/posts.util'

const testBlogData: BlogInput = {
  name: 'Test name',
  description: 'Test description',
  websiteUrl: 'https://website-url.com',
}

const testPostData: PostInput = {
  title: 'Test title',
  shortDescription: 'Test short description',
  content: 'Test content',
  blogId: '691fe02e62d2354296c74857',
}

const incorrectTestPostData: PostInput = {
  title: '         ',
  shortDescription: 'Test short description',
  content: '',
  blogId: 'blogId',
}

let createdBlog: BlogOutput
let createdPost: PostOutput

describe('Posts API', () => {
  const app = setupApp()
  const { authToken } = generateAuthToken()
  const postHelper = postsTestManager({ app, authToken })
  const blogHelper = blogsTestManager({ app, authToken })

  beforeAll(async () => {
    await runDb()
  })

  afterAll(async () => {
    await clearDb(app)
    closeDb()
  })

  // POST

  it('Should create a post; POST /posts', async () => {
    const createdBlogRes = await blogHelper.create({
      token: authToken,
      data: testBlogData,
    })

    testPostData.blogId = createdBlogRes.body.id

    const createdRes = await postHelper.create({
      token: authToken,
      data: testPostData,
    })

    createdBlog = createdBlogRes.body
    createdPost = createdRes.body
  })

  it('Should not create a post if blog does not exist; POST /posts', async () => {
    await postHelper.create({
      token: authToken,
      data: { ...testPostData, blogId: '691fe02e62d2354296c74851' },
      status: HttpStatus.NotFound,
    })
  })

  it('Should not create a post if blogId is not passed in req.body; POST /posts', async () => {
    const { blogId, ...restTestPostData } = testPostData

    await postHelper.create({
      token: authToken,
      data: restTestPostData,
      status: HttpStatus.BadRequest,
    })
  })

  it('Should not create a post without auth header; POST /posts', async () => {
    await postHelper.create({
      data: testPostData,
      status: HttpStatus.Unauthorized,
    })
  })

  it('Should not create a post with incorrect auth token; POST /posts', async () => {
    await postHelper.create({
      token: 'Basic sfsdfsdsdfsdsf',
      data: testPostData,
      status: HttpStatus.Unauthorized,
    })
  })

  it('Should not create a post if body is incorrect; POST /posts', async () => {
    await postHelper.create({
      token: authToken,
      data: incorrectTestPostData,
      status: HttpStatus.BadRequest,
    })
  })

  // GET ALL

  it('Should get all posts; GET /posts', async () => {
    const getAllPostsRes = await postHelper.getAll({})

    expect(getAllPostsRes.body.items).toBeInstanceOf(Array)
    expect(getAllPostsRes.body.items.length).toBe(1)
  })

  // GET ONE

  it('Should get one post; GET /posts/:id', async () => {
    const getCreatedPostRes = await postHelper.getOne({
      id: createdPost.id,
    })
    expect(getCreatedPostRes.body.id).toBe(createdPost.id)
  })

  // UPDATE

  it('Should update a post; PUT /posts/:id', async () => {
    await postHelper.update({
      id: createdPost.id,
      token: authToken,
      data: { ...testPostData, title: 'Test title 2' },
    })

    const updatedPostRes = await postHelper.getOne({
      id: createdPost.id,
    })
    expect(updatedPostRes.body.title).toBe('Test title 2')
  })

  it('Should not update a not found post; UPDATE /posts/:id', async () => {
    await postHelper.update({
      id: '691fe02e62d2354296c74851',
      token: authToken,
      data: { ...testPostData, title: 'Test title 3' },
      status: HttpStatus.NotFound,
    })
  })

  it('Should not update a post if given blogId is different from post.blogId; UPDATE /posts/:id', async () => {
    const differentBlogRes = await blogHelper.create({
      token: authToken,
      data: testBlogData,
    })

    const res = await postHelper.update({
      id: createdPost.id,
      token: authToken,
      data: {
        ...testPostData,
        title: 'Test title 4',
        blogId: differentBlogRes.body.id,
      },
      status: HttpStatus.BadRequest,
    })
    expect(res.body.message).toBe(Messages.post.blogNotCorrespondPost)
  })

  // DELETE

  it('Should delete a post; DELETE /posts/:id', async () => {
    const postsResBefore = await postHelper.getAll({})
    expect(postsResBefore.body.items.length).toBe(1)

    await postHelper.getOne({
      id: createdPost.id,
    })

    await postHelper.delete({
      id: createdPost.id,
      token: authToken,
    })

    await postHelper.getOne({
      id: createdPost.id,
      status: HttpStatus.NotFound,
    })

    const postsResAfter = await postHelper.getAll({})
    expect(postsResAfter.body.items.length).toBe(0)
  })

  it('Should not delete a not found post; DELETE /posts/:id', async () => {
    await postHelper.delete({
      id: '691fe02e62d2354296c74851',
      token: authToken,
      status: HttpStatus.NotFound,
    })
  })
})
