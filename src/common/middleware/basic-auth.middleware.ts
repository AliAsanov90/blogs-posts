import { NextFunction, Request, Response } from 'express'
import { AUTH_HEADER_NAME } from '../constants/common'
import { HttpStatus } from '../types/http-statuses.types'
import { generateAuthToken } from '../utils/generate-auth-token'

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export const basicAuthGuardMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { token: generatedToken } = generateAuthToken()

  const auth = req.headers[AUTH_HEADER_NAME.toLowerCase()] as string

  if (!auth) {
    return res.sendStatus(HttpStatus.Unauthorized)
  }

  const [type, token] = auth.split(' ')

  if (type !== 'Basic' || token !== generatedToken) {
    return res.sendStatus(HttpStatus.Unauthorized)
  }

  next()
}
