import { Application } from 'express'
import request from 'supertest'
import { AUTH_HEADER_NAME } from '../../src/common/constants/common'
import { AUTH, LOGIN, ME } from '../../src/common/constants/routes'
import { HttpStatus } from '../../src/common/types/http-statuses.types'
import { LoginInput } from '../../src/features/auth/types/auth.types'
import { formatBearerToken } from './test-helpers.util'

type LoginParams = {
  data: LoginInput
  status?: HttpStatus
}

type GetMeParams = {
  token: string
  status?: HttpStatus
  withAuthHeader?: boolean
  withAuthBearer?: boolean
}

export const authTestManager = (app: Application) => ({
  login: async ({ data, status = HttpStatus.Ok }: LoginParams) => {
    return await request(app)
      .post(AUTH + LOGIN)
      .send(data)
      .expect(status)
  },

  getMe: async ({
    token,
    status = HttpStatus.Ok,
    withAuthHeader = true,
    withAuthBearer = true,
  }: GetMeParams) => {
    if (!withAuthHeader) {
      return await request(app)
        .get(AUTH + ME)
        .expect(status)
    }

    return await request(app)
      .get(AUTH + ME)
      .set(AUTH_HEADER_NAME, withAuthBearer ? formatBearerToken(token) : token)
      .expect(status)
  },
})
