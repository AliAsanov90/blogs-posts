import { Request, Response } from 'express'
import { HttpStatus } from '../../common/types/http-statuses.types'
import { RequestWithBody } from '../../common/types/request-response.types'
import { catchAsync } from '../../common/utils/catch-async.util'
import { userQueryRepository } from '../users/repository/user-query.repository'
import { authService } from './auth.service'
import { LoginInput } from './types/auth.types'

class AuthController {
  public login = catchAsync(async (req: RequestWithBody<LoginInput>, res: Response) => {
    const token = await authService.login(req.body)

    token
      ? res.status(HttpStatus.Ok).send({ accessToken: token })
      : res.sendStatus(HttpStatus.Unauthorized)
  })

  public getMe = catchAsync(async (req: Request, res: Response) => {
    const user = await userQueryRepository.getMe(req.userId)
    user ? res.status(HttpStatus.Ok).send(user) : res.sendStatus(HttpStatus.NotFound)
  })
}

export const authController = new AuthController()
