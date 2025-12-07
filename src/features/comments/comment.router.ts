import { Router } from 'express'
import { ID } from '../../common/constants/routes'
import { bearerAuthGuardMiddleware } from '../../common/middleware/bearer-auth.middleware'
import { idValidation } from '../../common/middleware/id-validation.middleware'
import { validationResultMiddleware } from '../../common/middleware/validation-result.middleware'
import { commentController } from './comment.controller'
import { commentInputValidation } from './utils/comment-input.validation'

export const commentRouter: Router = Router()

commentRouter
  .get(ID, idValidation, validationResultMiddleware, commentController.getOne)

  .put(
    ID,
    bearerAuthGuardMiddleware,
    idValidation,
    commentInputValidation,
    validationResultMiddleware,
    commentController.update,
  )

  .delete(
    ID,
    bearerAuthGuardMiddleware,
    idValidation,
    validationResultMiddleware,
    commentController.delete,
  )
