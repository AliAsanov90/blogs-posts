import { Application } from 'express'
import request from 'supertest'
import { AUTH_HEADER_NAME } from '../../src/common/constants/common'
import { USERS } from '../../src/common/constants/routes'
import { defaultSortPaginationValues, PaginationAndSorting } from '../../src/common/middleware/query-validation.middleware'
import { HttpStatus } from '../../src/common/types/http-statuses.types'
import { UserInput, UserQueryInput, UserSortByFields } from '../../src/features/users/types/user.types'

type GetAllParams = {
  app: Application
  httpStatus?: HttpStatus
  query?: Partial<UserQueryInput>
  token?: string
}

type CreateParams = {
  app: Application
  data: UserInput
  token?: string
  httpStatus?: HttpStatus
}

type DeleteParams = {
  app: Application
  id: string
  httpStatus?: HttpStatus
  token?: string
}

const defaultQuery = defaultSortPaginationValues as PaginationAndSorting<UserSortByFields>

export const usersTestManager = {
  getAll: async ({ app, token = '', query, httpStatus = HttpStatus.Ok }: GetAllParams) => {
    const queryParams = { ...defaultQuery, ...query }

    return await request(app)
      .get(USERS)
      .set(AUTH_HEADER_NAME, token)
      .query(queryParams)
      .expect(httpStatus)
  },

  create: async ({ app, token = '', data, httpStatus = HttpStatus.Created }: CreateParams) => {
    return await request(app)
      .post(USERS)
      .set(AUTH_HEADER_NAME, token)
      .send(data)
      .expect(httpStatus)
  },

  delete: async ({ app, token = '', id, httpStatus = HttpStatus.NoContent }: DeleteParams) => {
    return await request(app)
      .delete(USERS + `/${id}`)
      .set(AUTH_HEADER_NAME, token)
      .expect(httpStatus)
  },
}
