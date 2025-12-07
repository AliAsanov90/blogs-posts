import { HttpStatus } from './http-statuses.types'

export class NotFoundError extends Error {
  static httpStatus = HttpStatus.NotFound
}

export class BadRequestError extends Error {
  static httpStatus = HttpStatus.BadRequest
}

export class UnauthorizedError extends Error {
  static httpStatus = HttpStatus.Unauthorized
}

export class ForbiddenError extends Error {
  static httpStatus = HttpStatus.Forbidden
}
