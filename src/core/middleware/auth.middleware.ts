import { NextFunction, Request, Response } from 'express'
import { HttpStatus } from '../types/http-statuses'
import { generateAuthToken } from '../utils/generate-auth-token'

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export const authGuardMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { token: generatedToken } = generateAuthToken()

  const auth = req.headers['authorization'] as string

  if (!auth) {
    return res.sendStatus(HttpStatus.Unauthorized)
  }

  const [type, token] = auth.split(' ')

  if (type !== 'Basic' || token !== generatedToken) {
    return res.sendStatus(HttpStatus.Unauthorized)
  }

  next()
}
