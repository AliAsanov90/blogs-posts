import { Router } from 'express'
import { COMMENT_ID, ID } from '../../common/constants/routes'
import { bearerAuthGuardMiddleware } from '../../common/middleware/bearer-auth.middleware'
import { idValidation } from '../../common/middleware/id-validation.middleware'
import { validationResultMiddleware } from '../../common/middleware/validation-result.middleware'
import { commentController } from './comment.controller'
import { commentIdValidation } from './utils/comment-id.validation'
import { commentInputValidation } from './utils/comment-input.validation'

export const commentRouter: Router = Router()

commentRouter
  .get(ID, idValidation, validationResultMiddleware, commentController.getOne)

  .put(
    COMMENT_ID,
    bearerAuthGuardMiddleware,
    commentIdValidation,
    commentInputValidation,
    validationResultMiddleware,
    commentController.update,
  )

  .delete(
    COMMENT_ID,
    bearerAuthGuardMiddleware,
    commentIdValidation,
    validationResultMiddleware,
    commentController.delete,
  )
