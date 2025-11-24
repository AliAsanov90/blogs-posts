import { Response } from 'express'
import { BadRequestError, NotFoundError } from '../types/errors.types'
import { HttpStatus } from '../types/http-statuses.types'
import {
  ErrorMessages,
  ValidationAppError,
} from '../types/validation-error.types'

export const createErrorMessages = (
  errors: ValidationAppError[],
): ErrorMessages => {
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

export const handleErrors = <K extends Response>(error: unknown, res: K) => {
  if (error instanceof NotFoundError) {
    return getErrorResponseObj(error, NotFoundError.httpStatus, res)
  }

  if (error instanceof BadRequestError) {
    return getErrorResponseObj(error, BadRequestError.httpStatus, res)
  }

  res.status(HttpStatus.InternalServerError).json({
    message: 'Something went wrong...',
    status: HttpStatus.InternalServerError,
  })
}
