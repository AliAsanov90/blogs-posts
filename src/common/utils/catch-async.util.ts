import { Handler, Request, Response } from 'express'
import { handleErrors } from './handle-errors.util'

export const catchAsync = <T = Request, K = Response, U = void>(
  fn: (req: T, res: K) => Promise<U>,
): Handler => {
  return async (req: Request, res: Response) => {
    try {
      return await fn(req as T, res as K)
    } catch (error) {
      handleErrors(error, res)
    }
  }
}
