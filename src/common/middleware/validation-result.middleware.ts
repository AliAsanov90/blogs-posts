import { NextFunction, Request, Response } from 'express'
import { ValidationError, validationResult } from 'express-validator'
import { HttpStatus } from '../types/http-statuses.types'
import { ValidationAppError } from '../types/validation-error.types'
import { createErrorMessages } from '../utils/handle-errors.util'

const formatErrors = (e: ValidationError): ValidationAppError =>
  e.type === 'field'
    ? { field: e.path, message: e.msg as string }
    : { message: e.msg as string }

export const validationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
    .formatWith(formatErrors)
    .array({ onlyFirstError: true })

  if (errors[0]) {
    return res.status(HttpStatus.BadRequest).send(createErrorMessages(errors))
  }

  next()
}
