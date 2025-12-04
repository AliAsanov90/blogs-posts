import { Application } from 'express'
import request from 'supertest'
import { AUTH, LOGIN } from '../../src/common/constants/routes'
import { HttpStatus } from '../../src/common/types/http-statuses.types'
import { LoginInput } from '../../src/features/auth/types/auth.types'

type LoginParams = {
  app: Application
  data: LoginInput
  httpStatus?: HttpStatus
}

export const authTestManager = {
  login: async ({ app, data, httpStatus = HttpStatus.NoContent }: LoginParams) => {
    return await request(app)
      .post(AUTH + LOGIN)
      .send(data)
      .expect(httpStatus)
  },
}
