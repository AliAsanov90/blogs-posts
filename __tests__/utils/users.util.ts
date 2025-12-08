import { Application } from 'express'
import request from 'supertest'
import { AUTH_HEADER_NAME } from '../../src/common/constants/common'
import { USERS } from '../../src/common/constants/routes'
import {
  defaultSortPaginationValues,
  PaginationAndSorting,
} from '../../src/common/middleware/query-validation.middleware'
import { HttpStatus } from '../../src/common/types/http-statuses.types'
import { generateAuthToken } from '../../src/common/utils/generate-auth-token'
import {
  UserInput,
  UserQueryInput,
  UserSortByFields,
} from '../../src/features/users/types/user.types'

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

const { authToken } = generateAuthToken()

export const usersTestManager = (app: Application) => ({
  getAll: async ({ token, query, status = HttpStatus.Ok }: GetAllParams) => {
    const queryParams = { ...defaultQuery, ...query }

    return await request(app)
      .get(USERS)
      .set(AUTH_HEADER_NAME, token ?? authToken)
      .query(queryParams)
      .expect(status)
  },

  create: async ({ token, data = {}, status = HttpStatus.Created }: CreateParams) => {
    const resultData = { ...defaultUserInputData, ...data }
    return await request(app)
      .post(USERS)
      .set(AUTH_HEADER_NAME, token ?? authToken)
      .send(resultData)
      .expect(status)
  },

  delete: async ({ token, id, status = HttpStatus.NoContent }: DeleteParams) => {
    return await request(app)
      .delete(USERS + `/${id}`)
      .set(AUTH_HEADER_NAME, token ?? authToken)
      .expect(status)
  },
})
