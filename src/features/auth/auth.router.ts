import { Router } from 'express'
import { LOGIN } from '../../common/constants/routes'
import { validationResultMiddleware } from '../../common/middleware/validation-result.middleware'
import { authController } from './auth.controller'
import { loginInputValidation } from './utils/login-input.validation'

export const authRouter: Router = Router()

authRouter.post(
  LOGIN,
  loginInputValidation,
  validationResultMiddleware,
  authController.login,
)
