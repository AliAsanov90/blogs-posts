import { Response } from 'express'
import { NotFoundError } from '../errors/not-found.error'
import { HttpStatus } from '../types/http-statuses'
import { ErrorMessages, ValidationAppError } from '../types/validation-error'

export const createErrorMessages = (
  errors: ValidationAppError[],
): ErrorMessages => {
  return { errorsMessages: errors }
}

export const handleErrors = <K extends Response>(error: unknown, res: K) => {
  if (error instanceof NotFoundError) {
    return res.status(HttpStatus.NotFound).json({
      message: error.message,
      name: error.name,
      status: HttpStatus.NotFound,
    })
  }

  res.status(HttpStatus.InternalServerError).json({
    message: 'Something went wrong...',
    status: HttpStatus.InternalServerError,
  })
}
