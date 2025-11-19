import { Application } from 'express'
import request from 'supertest'
import { BlogInput } from '../../src/blogs/types/blog'
import { BLOGS } from '../../src/core/constants/routes'
import { HttpStatus } from '../../src/core/types/http-statuses'
import { generateAuthToken } from '../../src/core/utils/generate-auth-token'

const testBlogData: BlogInput = {
  name: 'Test name',
  description: 'Test description',
  websiteUrl: 'https://website-url.com',
}

const create = async (app: Application) => {
  const { authToken } = generateAuthToken()

  const res = await request(app)
    .post(BLOGS)
    .set('Authorization', authToken)
    .send(testBlogData)
    .expect(HttpStatus.Created)

  return res
}

export const blogsTestManager = {
  create
}
