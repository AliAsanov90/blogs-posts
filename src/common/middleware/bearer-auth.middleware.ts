import { NextFunction, Request, Response } from 'express'
import { AUTH_HEADER_NAME } from '../constants/common'
import { jwtService } from '../services/jwt/jwt.service'
import { HttpStatus } from '../types/http-statuses.types'
import { handleErrors } from '../utils/handle-errors.util'

export const bearerAuthGuardMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers[AUTH_HEADER_NAME.toLowerCase()] as string

  if (!authHeader) {
    return res.sendStatus(HttpStatus.Unauthorized)
  }

  const [type, token] = authHeader.split(' ')

  if (type !== 'Bearer' || typeof token !== 'string') {
    return res.sendStatus(HttpStatus.Unauthorized)
  }

  const jwtPayload = verifyJwtToken(token, res)

  if (jwtPayload) {
    req.userId = jwtPayload.userId
  }

  next()
}

function verifyJwtToken(token: string, res: Response) {
  try {
    return jwtService.verifyToken(token)
  } catch (error) {
    handleErrors(error, res)
  }
}
