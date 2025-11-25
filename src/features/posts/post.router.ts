import { Router } from 'express'
import { HOME, ID } from '../../common/constants/routes'
import { authGuardMiddleware } from '../../common/middleware/auth.middleware'
import { idValidation } from '../../common/middleware/id-validation.middleware'
import { getQueryValidation } from '../../common/middleware/query-validation.middleware'
import { validationResultMiddleware } from '../../common/middleware/validation-result.middleware'
import { postController } from './post.controller'
import { PostSortByFields } from './types/post.types'
import { postInputDtoValidation } from './utils/post-input.validation'

export const postRouter: Router = Router()

postRouter
  .get(
    HOME,
    getQueryValidation(PostSortByFields),
    validationResultMiddleware,
    postController.getAll,
  )

  .get(ID, idValidation, validationResultMiddleware, postController.getOne)

  .post(
    HOME,
    authGuardMiddleware,
    postInputDtoValidation,
    validationResultMiddleware,
    postController.create,
  )

  .put(
    ID,
    authGuardMiddleware,
    idValidation,
    postInputDtoValidation,
    validationResultMiddleware,
    postController.update,
  )

  .delete(
    ID,
    authGuardMiddleware,
    idValidation,
    validationResultMiddleware,
    postController.delete,
  )
