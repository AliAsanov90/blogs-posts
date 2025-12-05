import { HttpStatus } from '../../../src/common/types/http-statuses.types'
import { generateAuthToken } from '../../../src/common/utils/generate-auth-token'
import { closeDb, runDb } from '../../../src/db/mongo.db'
import { BlogInput, BlogOutput } from '../../../src/features/blogs/types/blog.types'
import { PostInput } from '../../../src/features/posts/types/post.types'
import { setupApp } from '../../../src/setupApp'
import { blogsTestManager } from '../../utils/blogs.util'
import { clearDb } from '../../utils/clearDb.util'
import { postsTestManager } from '../../utils/posts.util'

const testBlogData: BlogInput = {
  name: 'Test name',
  description: 'Test description',
  websiteUrl: 'https://website-url.com',
}

const updatedTestBlogData: BlogInput = {
  ...testBlogData,
  name: 'Test name 2',
}

const incorrectTestBlogData: BlogInput = {
  name: '         ',
  description: 'Test short description',
  websiteUrl: 'websiteUrl',
}

const testPostData: PostInput = {
  title: 'Test title',
  shortDescription: 'Test short description',
  content: 'Test content',
  blogId: '691fe02e62d2354296c74857',
}

let createdBlog: BlogOutput

describe('Blogs API', () => {
  const app = setupApp()
  const { authToken } = generateAuthToken()

  beforeAll(async () => {
    await runDb()
  })
  afterAll(async () => {
    await clearDb(app)
    closeDb()
  })

  // CREATE

  it('Should create a blog; POST /blogs', async () => {
    const createdBlogRes = await blogsTestManager.create({
      app,
      token: authToken,
      data: testBlogData,
    })

    const blogsRes = await blogsTestManager.getAll({ app })

    expect(createdBlogRes.body.name).toBe(testBlogData.name)
    expect(blogsRes.body.items).toBeInstanceOf(Array)
    expect(blogsRes.body.items.length).toBe(1)

    createdBlog = createdBlogRes.body
  })

  it('Should not create a blog without auth header; POST /blogs', async () => {
    await blogsTestManager.create({
      app,
      token: undefined,
      data: testBlogData,
      httpStatus: HttpStatus.Unauthorized,
    })
  })

  it('Should not create a blog with incorrect auth token; POST /blogs', async () => {
    await blogsTestManager.create({
      app,
      token: 'Basic sfsdfsdsdfsdsf',
      data: testBlogData,
      httpStatus: HttpStatus.Unauthorized,
    })
  })

  it('Should not create a blog if body is incorrect; POST /blogs', async () => {
    await blogsTestManager.create({
      app,
      token: authToken,
      data: incorrectTestBlogData,
      httpStatus: HttpStatus.BadRequest,
    })
  })

  // GET ALL

  it('Should get all blogs; GET /blogs', async () => {
    const getAllBlogsRes = await blogsTestManager.getAll({ app })

    expect(getAllBlogsRes.body.items).toBeInstanceOf(Array)
    expect(getAllBlogsRes.body.items.length).toBe(1)
  })

  it('Should get blogs that match "searchNameTerm" query param; GET /blogs?searchNameTerm={MATCH}', async () => {
    const getBlogsRes = await blogsTestManager.getAll({
      app,
      query: { searchNameTerm: 'test' },
    })
    expect(getBlogsRes.body.items.length).toBe(1)
  })

  it('Shouldn\'t get any blogs if "searchNameTerm" query does not match; GET /blogs?searchNameTerm={NOT_MATCH}', async () => {
    const getBlogsRes = await blogsTestManager.getAll({
      app,
      query: { searchNameTerm: 'blog' },
    })
    expect(getBlogsRes.body.items.length).toBe(0)
  })

  // GET ONE

  it('Should get one blog; GET /blogs/:id', async () => {
    const getOneRes = await blogsTestManager.getOne({
      app,
      id: createdBlog.id,
    })
    expect(getOneRes.body.id).toBe(createdBlog.id)
  })

  it('Should return NotFound if blog not existing; GET /blogs/:id', async () => {
    await blogsTestManager.getOne({
      app,
      id: '691fe02e62d2354296c74851',
      httpStatus: HttpStatus.NotFound,
    })
  })

  // GET POSTS BY BLOG ID

  it('Should get posts of specific blog; GET /blogs/:blogId/posts', async () => {
    const getBlogPostsResBefore = await blogsTestManager.getPostsByBlogId({
      app,
      blogId: createdBlog.id,
    })
    expect(getBlogPostsResBefore.body.items.length).toBe(0)

    await postsTestManager.create({
      app,
      token: authToken,
      data: { ...testPostData, blogId: createdBlog.id },
    })

    const getBlogPostsResAfter = await blogsTestManager.getPostsByBlogId({
      app,
      blogId: createdBlog.id,
    })
    expect(getBlogPostsResAfter.body.items.length).toBe(1)
  })

  // CREATE A POST BY BLOG ID

  it('Should create a post for specific blog; POST /blogs/:blogId/posts', async () => {
    const getBlogPostsResBefore = await blogsTestManager.getPostsByBlogId({
      app,
      blogId: createdBlog.id,
    })
    expect(getBlogPostsResBefore.body.items.length).toBe(1)

    const { blogId, ...restData } = testPostData

    await blogsTestManager.createPostByBlogId({
      app,
      token: authToken,
      blogId: createdBlog.id,
      data: restData,
    })

    const getBlogPostsResAfter = await blogsTestManager.getPostsByBlogId({
      app,
      blogId: createdBlog.id,
    })
    expect(getBlogPostsResAfter.body.items.length).toBe(2)
  })

  // UPDATE

  it('Should update a blog; PUT /blogs/:id', async () => {
    await blogsTestManager.update({
      app,
      id: createdBlog.id,
      token: authToken,
      data: updatedTestBlogData,
    })

    const updatedPostRes = await blogsTestManager.getOne({
      app,
      id: createdBlog.id,
    })

    expect(updatedPostRes.body).toEqual({
      ...updatedPostRes.body,
      ...updatedTestBlogData,
      id: createdBlog.id,
    })
  })

  it('Should not update blog if blog not found; PUT /blogs/:id', async () => {
    await blogsTestManager.update({
      app,
      id: '691fe02e62d2354296c74851',
      token: authToken,
      data: testBlogData,
      httpStatus: HttpStatus.NotFound,
    })
  })

  // DELETE

  it('Should delete a blog; DELETE /blogs/:id', async () => {
    await blogsTestManager.getOne({
      app,
      id: createdBlog.id,
    })

    const blogsResBefore = await blogsTestManager.getAll({ app })
    expect(blogsResBefore.body.items.length).toBe(1)

    await blogsTestManager.delete({
      app,
      id: createdBlog.id,
      token: authToken,
    })

    await blogsTestManager.getOne({
      app,
      id: createdBlog.id,
      httpStatus: HttpStatus.NotFound,
    })

    const blogsResAfter = await blogsTestManager.getAll({ app })
    expect(blogsResAfter.body.items.length).toBe(0)
  })

  it('Should not delete a not found blog; DELETE /blogs/:id', async () => {
    await blogsTestManager.delete({
      app,
      id: '691fe02e62d2354296c74851',
      token: authToken,
      httpStatus: HttpStatus.NotFound,
    })
  })
})
