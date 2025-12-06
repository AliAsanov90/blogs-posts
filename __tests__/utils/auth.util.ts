import { Application } from 'express'
import request from 'supertest'
import { AUTH, LOGIN } from '../../src/common/constants/routes'
import { HttpStatus } from '../../src/common/types/http-statuses.types'
import { LoginInput } from '../../src/features/auth/types/auth.types'

type LoginParams = {
  data: LoginInput
  status?: HttpStatus
}

interface AuthTestManagerParams {
  app: Application
}

export const authTestManager = ({ app }: AuthTestManagerParams) => ({
  login: async ({ data, status = HttpStatus.Ok }: LoginParams) => {
    return await request(app)
      .post(AUTH + LOGIN)
      .send(data)
      .expect(status)
  },
})
