import { Router } from 'express'
import { LOGIN, ME } from '../../common/constants/routes'
import { bearerAuthGuardMiddleware } from '../../common/middleware/bearer-auth.middleware'
import { validationResultMiddleware } from '../../common/middleware/validation-result.middleware'
import { authController } from './auth.controller'
import { loginInputValidation } from './utils/login-input.validation'

export const authRouter: Router = Router()

authRouter.post(LOGIN, loginInputValidation, validationResultMiddleware, authController.login)

authRouter.get(ME, bearerAuthGuardMiddleware, authController.getMe)
