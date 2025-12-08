import { Response } from 'express'
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken'
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../types/errors.types'
import { HttpStatus } from '../types/http-statuses.types'
import { ErrorMessages, ValidationAppError } from '../types/validation-error.types'

export const createErrorMessages = (errors: ValidationAppError[]): ErrorMessages => {
  return { errorsMessages: errors }
}

const getErrorResponseObj = <T extends Error, K extends Response>(
  err: T,
  errStatus: HttpStatus,
  res: K,
) => {
  return res.status(errStatus).json({
    message: err.message,
    name: err.name,
    status: errStatus,
  })
}

interface ErrorConstructorWithStatus {
  new (...args: any[]): Error
  httpStatus?: HttpStatus
}

const expectedErrorClasses = new Map<ErrorConstructorWithStatus, HttpStatus>([
  // Custom errors
  [NotFoundError, NotFoundError.httpStatus],
  [BadRequestError, BadRequestError.httpStatus],
  [UnauthorizedError, UnauthorizedError.httpStatus],
  [ForbiddenError, ForbiddenError.httpStatus],
  // JWT errors
  [TokenExpiredError, HttpStatus.Unauthorized],
  [JsonWebTokenError, HttpStatus.Unauthorized],
  [NotBeforeError, HttpStatus.Unauthorized],
])

export const handleErrors = <K extends Response>(error: unknown, res: K) => {
  console.error(error)

  for (const [ErrorClass, status] of expectedErrorClasses.entries()) {
    if (error instanceof ErrorClass) {
      return getErrorResponseObj(error, status, res)
    }
  }

  if (error instanceof Error) {
    return getErrorResponseObj(error, HttpStatus.InternalServerError, res)
  }

  return res.status(HttpStatus.InternalServerError).json({
    message: 'Something went wrong...',
    status: HttpStatus.InternalServerError,
    error,
  })
}
