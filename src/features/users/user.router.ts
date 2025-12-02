import { Router } from 'express'
import { HOME, ID } from '../../common/constants/routes'
import { authGuardMiddleware } from '../../common/middleware/auth.middleware'
import { idValidation } from '../../common/middleware/id-validation.middleware'
import { getQueryValidation } from '../../common/middleware/query-validation.middleware'
import { validationResultMiddleware } from '../../common/middleware/validation-result.middleware'
import { UserSearchQueryFields, UserSortByFields } from './types/user.types'
import { userController } from './user.controller'
import { userInputValidation } from './utils/user-input.validation'

export const userRouter: Router = Router()

userRouter
  .get(
    HOME,
    authGuardMiddleware,
    getQueryValidation(UserSortByFields, UserSearchQueryFields),
    validationResultMiddleware,
    userController.getAll,
  )

  .post(
    HOME,
    authGuardMiddleware,
    userInputValidation,
    validationResultMiddleware,
    userController.create,
  )

  .delete(
    ID,
    authGuardMiddleware,
    idValidation,
    validationResultMiddleware,
    userController.delete,
  )
