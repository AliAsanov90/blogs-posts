import { Application } from 'express'
import request from 'supertest'
import { AUTH_HEADER_NAME } from '../../src/common/constants/common'
import { BLOGS } from '../../src/common/constants/routes'
import {
  defaultSortPaginationValues,
  PaginationAndSorting,
} from '../../src/common/middleware/query-validation.middleware'
import { HttpStatus } from '../../src/common/types/http-statuses.types'
import {
  BlogInput,
  BlogQueryInput,
  BlogSortByFields,
} from '../../src/features/blogs/types/blog.types'
import { PostInput } from '../../src/features/posts/types/post.types'

interface BlogsTestManagerParams {
  app: Application
  authToken: string
}

type CommonParams = {
  status?: HttpStatus
}

type GetAllParams = CommonParams & {
  query?: Partial<BlogQueryInput>
}

type GetOneParams = CommonParams & {
  id: string
}

type DeleteParams = CommonParams & {
  id: string
  token?: string
}

type CreateParams = CommonParams & {
  data: BlogInput
  token?: string
}

type UpdateParams = CommonParams & {
  id: string
  data: BlogInput
  token?: string
}

type GetPostsByBlogIdParams = CommonParams & {
  query?: Partial<BlogQueryInput>
  blogId: string
}

type CreatePostByBlogIdParams = CommonParams & {
  blogId: string
  data: Omit<PostInput, 'blogId'>
  token?: string
}

const defaultQuery = defaultSortPaginationValues as PaginationAndSorting<BlogSortByFields>

export const blogsTestManager = ({ app, authToken }: BlogsTestManagerParams) => ({
  getAll: async ({ query, status = HttpStatus.Ok }: GetAllParams) => {
    const queryParams = { ...defaultQuery, ...query }
    return await request(app).get(BLOGS).query(queryParams).expect(status)
  },

  getOne: async ({ id, status = HttpStatus.Ok }: GetOneParams) => {
    return await request(app)
      .get(BLOGS + `/${id}`)
      .expect(status)
  },

  create: async ({ token = '', data, status = HttpStatus.Created }: CreateParams) => {
    return await request(app)
      .post(BLOGS)
      .set(AUTH_HEADER_NAME, token ?? authToken)
      .send(data)
      .expect(status)
  },

  update: async ({ token = '', data, id, status = HttpStatus.NoContent }: UpdateParams) => {
    return await request(app)
      .put(BLOGS + `/${id}`)
      .set(AUTH_HEADER_NAME, token ?? authToken)
      .send(data)
      .expect(status)
  },

  delete: async ({ token = '', id, status = HttpStatus.NoContent }: DeleteParams) => {
    return await request(app)
      .delete(BLOGS + `/${id}`)
      .set(AUTH_HEADER_NAME, token ?? authToken)
      .expect(status)
  },

  getPostsByBlogId: async ({ query, blogId, status = HttpStatus.Ok }: GetPostsByBlogIdParams) => {
    const queryParams = { ...defaultQuery, ...query }

    return await request(app)
      .get(BLOGS + `/${blogId}/posts`)
      .query(queryParams)
      .expect(status)
  },

  createPostByBlogId: async ({
    token = '',
    blogId,
    data,
    status = HttpStatus.Created,
  }: CreatePostByBlogIdParams) => {
    return await request(app)
      .post(BLOGS + `/${blogId}/posts`)
      .set(AUTH_HEADER_NAME, token ?? authToken)
      .send(data)
      .expect(status)
  },
})
