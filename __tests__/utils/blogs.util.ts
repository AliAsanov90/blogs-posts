import { Application } from 'express'
import request from 'supertest'
import { AUTH_HEADER_NAME } from '../../src/common/constants/common'
import { BLOGS } from '../../src/common/constants/routes'
import { defaultSortPaginationValues, PaginationAndSorting } from '../../src/common/middleware/query-validation.middleware'
import { HttpStatus } from '../../src/common/types/http-statuses.types'
import { BlogInput, BlogQueryInput, BlogSortByFields } from '../../src/features/blogs/types/blog.types'
import { PostInput } from '../../src/features/posts/types/post.types'

type GetAllParams = {
  app: Application
  httpStatus?: HttpStatus
  query?: Partial<BlogQueryInput>
}

type GetOneParams = {
  app: Application
  id: string
  httpStatus?: HttpStatus
}

type DeleteParams = {
  app: Application
  id: string
  httpStatus?: HttpStatus
  token?: string
}

type CreateParams = {
  app: Application
  data: BlogInput
  token?: string
  httpStatus?: HttpStatus
}

type UpdateParams = {
  app: Application
  id: string
  data: BlogInput
  token?: string
  httpStatus?: HttpStatus
}

type GetPostsByBlogIdParams = {
  app: Application
  httpStatus?: HttpStatus
  query?: Partial<BlogQueryInput>
  blogId: string
}

type CreatePostByBlogIdParams = {
  app: Application
  blogId: string
  data: Omit<PostInput, 'blogId'>
  token?: string
  httpStatus?: HttpStatus
}

const defaultQuery = defaultSortPaginationValues as PaginationAndSorting<BlogSortByFields>

export const blogsTestManager = {
  getAll: async ({ app, query, httpStatus = HttpStatus.Ok }: GetAllParams) => {
    const queryParams = { ...defaultQuery, ...query }

    return await request(app)
      .get(BLOGS)
      .query(queryParams)
      .expect(httpStatus)
  },
  getOne: async ({ app, id, httpStatus = HttpStatus.Ok }: GetOneParams) => {
    return await request(app)
      .get(BLOGS + `/${id}`)
      .expect(httpStatus)
  },
  create: async ({ app, token = '', data, httpStatus = HttpStatus.Created }: CreateParams) => {
    return await request(app)
      .post(BLOGS)
      .set(AUTH_HEADER_NAME, token)
      .send(data)
      .expect(httpStatus)
  },
  update: async ({ app, token= '', data, id, httpStatus = HttpStatus.NoContent }: UpdateParams) => {
    return await request(app)
      .put(BLOGS + `/${id}`)
      .set(AUTH_HEADER_NAME, token)
      .send(data)
      .expect(httpStatus)
  },
  delete: async ({ app, token = '', id, httpStatus = HttpStatus.NoContent }: DeleteParams) => {
    return await request(app)
      .delete(BLOGS + `/${id}`)
      .set(AUTH_HEADER_NAME, token)
      .expect(httpStatus)
  },
  getPostsByBlogId: async ({ app, query, blogId, httpStatus = HttpStatus.Ok }: GetPostsByBlogIdParams) => {
    const queryParams = { ...defaultQuery, ...query }

    return await request(app)
      .get(BLOGS + `/${blogId}/posts`)
      .query(queryParams)
      .expect(httpStatus)
  },
  createPostByBlogId: async ({ app, token = '', blogId, data, httpStatus = HttpStatus.Created }: CreatePostByBlogIdParams) => {
    return await request(app)
      .post(BLOGS + `/${blogId}/posts`)
      .set(AUTH_HEADER_NAME, token)
      .send(data)
      .expect(httpStatus)
  },
}
