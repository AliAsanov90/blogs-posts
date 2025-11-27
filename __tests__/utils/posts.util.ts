import { Application } from 'express'
import request from 'supertest'
import { AUTH_HEADER_NAME } from '../../src/common/constants/common'
import { POSTS } from '../../src/common/constants/routes'
import { defaultSortPaginationValues, PaginationAndSorting } from '../../src/common/middleware/query-validation.middleware'
import { HttpStatus } from '../../src/common/types/http-statuses.types'
import { PostInput, PostQueryInput, PostSortByFields } from '../../src/features/posts/types/post.types'

type GetAllParams = {
  app: Application
  httpStatus?: HttpStatus
  query?: Partial<PostQueryInput>
}

type GetOneParams = GetAllParams & {
  id: string
}

type DeleteParams = GetOneParams & {
  token?: string
}

type CreateParams = GetAllParams & {
  data: Partial<PostInput>
  token?: string
}

type UpdateParams = CreateParams & {
  id: string
}

const defaultQuery = defaultSortPaginationValues as PaginationAndSorting<PostSortByFields>

export const postsTestManager = {
  getAll: async ({ app, query, httpStatus = HttpStatus.Ok }: GetAllParams) => {
    const queryParams = { ...defaultQuery, ...query }

    return await request(app)
      .get(POSTS)
      .query(queryParams)
      .expect(httpStatus)
  },
  getOne: async ({ app, id, httpStatus = HttpStatus.Ok }: GetOneParams) => {
    return await request(app)
      .get(POSTS + `/${id}`)
      .expect(httpStatus)
  },
  create: async ({ app, token = '', data, httpStatus = HttpStatus.Created }: CreateParams) => {
    return await request(app)
      .post(POSTS)
      .set(AUTH_HEADER_NAME, token)
      .send(data)
      .expect(httpStatus)
  },
  update: async ({ app, token= '', data, id, httpStatus = HttpStatus.NoContent }: UpdateParams) => {
    return await request(app)
      .put(POSTS + `/${id}`)
      .set(AUTH_HEADER_NAME, token)
      .send(data)
      .expect(httpStatus)
  },
  delete: async ({ app, token = '', id, httpStatus = HttpStatus.NoContent }: DeleteParams) => {
    return await request(app)
      .delete(POSTS + `/${id}`)
      .set(AUTH_HEADER_NAME, token)
      .expect(httpStatus)
  },
}
