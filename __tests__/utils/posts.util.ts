import { Application } from 'express'
import request from 'supertest'
import { AUTH_HEADER_NAME } from '../../src/common/constants/common'
import { POSTS } from '../../src/common/constants/routes'
import {
  defaultSortPaginationValues,
  PaginationAndSorting,
} from '../../src/common/middleware/query-validation.middleware'
import { HttpStatus } from '../../src/common/types/http-statuses.types'
import {
  PostInput,
  PostQueryInput,
  PostSortByFields,
} from '../../src/features/posts/types/post.types'

interface PostsTestManagerParams {
  app: Application
  authToken: string
}

type CommonParams = {
  status?: HttpStatus
}

type GetAllParams = CommonParams & {
  query?: Partial<PostQueryInput>
}

type GetOneParams = CommonParams & {
  id: string
  query?: Partial<PostQueryInput>
}

type DeleteParams = CommonParams & {
  id: string
  token?: string
}

type CreateParams = CommonParams & {
  token?: string
  query?: Partial<PostQueryInput>
  data: Partial<PostInput>
}

type UpdateParams = CommonParams & {
  id: string
  token?: string
  data: Partial<PostInput>
}

const defaultQuery = defaultSortPaginationValues as PaginationAndSorting<PostSortByFields>

export const postsTestManager = ({ app, authToken }: PostsTestManagerParams) => ({
  getAll: async ({ query, status = HttpStatus.Ok }: GetAllParams) => {
    const queryParams = { ...defaultQuery, ...query }
    return await request(app).get(POSTS).query(queryParams).expect(status)
  },

  getOne: async ({ id, status = HttpStatus.Ok }: GetOneParams) => {
    return await request(app)
      .get(POSTS + `/${id}`)
      .expect(status)
  },

  create: async ({ token = '', data, status = HttpStatus.Created }: CreateParams) => {
    return await request(app)
      .post(POSTS)
      .set(AUTH_HEADER_NAME, token ?? authToken)
      .send(data)
      .expect(status)
  },

  update: async ({ token = '', data, id, status = HttpStatus.NoContent }: UpdateParams) => {
    return await request(app)
      .put(POSTS + `/${id}`)
      .set(AUTH_HEADER_NAME, token ?? authToken)
      .send(data)
      .expect(status)
  },

  delete: async ({ token = '', id, status = HttpStatus.NoContent }: DeleteParams) => {
    return await request(app)
      .delete(POSTS + `/${id}`)
      .set(AUTH_HEADER_NAME, token ?? authToken)
      .expect(status)
  },
})
