import { Application } from 'express'
import request from 'supertest'
import { AUTH_HEADER_NAME } from '../../src/common/constants/common'
import { USERS } from '../../src/common/constants/routes'
import {
  defaultSortPaginationValues,
  PaginationAndSorting,
} from '../../src/common/middleware/query-validation.middleware'
import { HttpStatus } from '../../src/common/types/http-statuses.types'
import {
  UserInput,
  UserQueryInput,
  UserSortByFields,
} from '../../src/features/users/types/user.types'

type UsersTestManagerParams = {
  app: Application
  authToken: string
}

type GetAllParams = {
  status?: HttpStatus
  query?: Partial<UserQueryInput>
  token?: string
}

type CreateParams = {
  data?: Partial<UserInput>
  token?: string
  status?: HttpStatus
}

type DeleteParams = {
  id: string
  status?: HttpStatus
  token?: string
}

const defaultQuery = defaultSortPaginationValues as PaginationAndSorting<UserSortByFields>

const defaultUserInputData: UserInput = {
  login: 'test-login',
  password: 'test_password',
  email: 'test@gmail.com',
}

export const usersTestManager = ({ app, authToken }: UsersTestManagerParams) => ({
  getAll: async ({ token, query, status = HttpStatus.Ok }: GetAllParams) => {
    const queryParams = { ...defaultQuery, ...query }

    return await request(app)
      .get(USERS)
      .set(AUTH_HEADER_NAME, token ?? authToken)
      .query(queryParams)
      .expect(status)
  },

  create: async ({ token, data = {}, status = HttpStatus.Created }: CreateParams) => {
    return await request(app)
      .post(USERS)
      .set(AUTH_HEADER_NAME, token ?? authToken)
      .send({ ...defaultUserInputData, ...data })
      .expect(status)
  },

  delete: async ({ token, id, status = HttpStatus.NoContent }: DeleteParams) => {
    return await request(app)
      .delete(USERS + `/${id}`)
      .set(AUTH_HEADER_NAME, token ?? authToken)
      .expect(status)
  },
})
