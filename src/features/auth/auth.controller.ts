import { Response } from 'express'
import { HttpStatus } from '../../common/types/http-statuses.types'
import { RequestWithBody } from '../../common/types/request-response.types'
import { catchAsync } from '../../common/utils/catch-async.util'
import { authService } from './auth.service'
import { LoginInput } from './types/auth.types'

class AuthController {
  public login = catchAsync(async (req: RequestWithBody<LoginInput>, res: Response) => {
    const isCorrectCredentials = await authService.login(req.body)

    res.sendStatus(isCorrectCredentials ? HttpStatus.NoContent : HttpStatus.Unauthorized)
  })
}

export const authController = new AuthController()
