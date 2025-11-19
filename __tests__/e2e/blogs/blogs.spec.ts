import request from 'supertest'
import { Blog, BlogInput } from '../../../src/blogs/types/blog'
import { TESTING_ALL_DATA } from '../../../src/core/constants/routes'
import { HttpStatus } from '../../../src/core/types/http-statuses'
import { generateAuthToken } from '../../../src/core/utils/generate-auth-token'
import { setupApp } from '../../../src/setupApp'
import { blogsTestManager } from '../../utils/blogs.util'

export const testBlogData: BlogInput = {
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
  websiteUrl: 'websiteUrl'
}

let createdBlog: Blog

describe('Blogs API', () => {
  const app = setupApp()
  const { authToken } = generateAuthToken()

  beforeAll(async () => {
    await request(app).delete(TESTING_ALL_DATA).expect(HttpStatus.NoContent)
  })

  it('Should create a blog; POST /blogs', async () => {
    const createdBlogRes = await blogsTestManager.create({
      app,
      token: authToken,
      data: testBlogData
    })

    const blogsRes = await blogsTestManager.getAll({ app })

    expect(createdBlogRes.body.name).toBe(testBlogData.name)
    expect(blogsRes.body).toBeInstanceOf(Array)
    expect(blogsRes.body.length).toBe(1)

    createdBlog = createdBlogRes.body
  })

  it('Should not create a blog without auth header; POST /blogs', async () => {
    await blogsTestManager.create({
      app,
      token: undefined,
      data: testBlogData,
      httpStatus: HttpStatus.Unauthorized
    })
  })

  it('Should not create a blog with incorrect auth token; POST /blogs', async () => {
    await blogsTestManager.create({
      app,
      token: 'Basic sfsdfsdsdfsdsf',
      data: testBlogData,
      httpStatus: HttpStatus.Unauthorized
    })
  })

  it('Should not create a blog if body is incorrect; POST /blogs', async () => {
     await blogsTestManager.create({
      app,
      token: authToken,
      data: incorrectTestBlogData,
      httpStatus: HttpStatus.BadRequest
    })
  })

  it('Should get all blogs; GET /blogs', async () => {
    const getAllPostsRes = await blogsTestManager.getAll({ app })

    expect(getAllPostsRes.body).toBeInstanceOf(Array)
    expect(getAllPostsRes.body.length).toBe(1)
  })

  it('Should get one blog; GET /blogs/:id', async () => {
    const getOneRes = await blogsTestManager.getOne({
      app,
      id: createdBlog.id
    })

    expect(getOneRes.body.id).toBe(createdBlog.id)
  })

  it('Should update a blog; PUT /blogs/:id', async () => {
    await blogsTestManager.update({
      app,
      id: createdBlog.id,
      token: authToken,
      data: updatedTestBlogData,
    })

    const updatedPostRes = await blogsTestManager.getOne({
      app,
      id: createdBlog.id
    })

    expect(updatedPostRes.body).toEqual({
      ...updatedTestBlogData,
      id: createdBlog.id
    })
  })

  it('Should not update blog if blog not found; UPDATE /blogs/:id', async () => {
    await blogsTestManager.update({
      app,
      id: '2',
      token: authToken,
      data: testBlogData,
      httpStatus: HttpStatus.NotFound
    })
  })

  it('Should delete a blog; DELETE /blogs/:id', async () => {
    await blogsTestManager.deleteOne({
      app,
      id: createdBlog.id,
      token: authToken,
    })

    await blogsTestManager.getOne({
      app,
      id: createdBlog.id,
      httpStatus: HttpStatus.NotFound
    })

    const blogsRes = await blogsTestManager.getAll({ app })

    expect(blogsRes.body.length).toBe(0)
  })

  it('Should not delete a not found blog; DELETE /blogs/:id', async () => {
    await blogsTestManager.deleteOne({
      app,
      id: '2',
      token: authToken,
      httpStatus: HttpStatus.NotFound
    })
  })
})
