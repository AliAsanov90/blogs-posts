import { Router } from 'express'
import { HOME, ID } from '../../common/constants/routes'
import { basicAuthGuardMiddleware } from '../../common/middleware/basic-auth.middleware'
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
    basicAuthGuardMiddleware,
    getQueryValidation(UserSortByFields, UserSearchQueryFields),
    validationResultMiddleware,
    userController.getAll,
  )

  .post(
    HOME,
    basicAuthGuardMiddleware,
    userInputValidation,
    validationResultMiddleware,
    userController.create,
  )

  .delete(
    ID,
    basicAuthGuardMiddleware,
    idValidation,
    validationResultMiddleware,
    userController.delete,
  )
