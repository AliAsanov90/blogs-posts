import { Router } from 'express'
import { HOME, ID } from '../../common/constants/routes'
import { authGuardMiddleware } from '../../common/middleware/auth.middleware'
import { idValidation } from '../../common/middleware/id-validation.middleware'
import { getQueryValidation } from '../../common/middleware/query-validation.middleware'
import { validationResultMiddleware } from '../../common/middleware/validation-result.middleware'
import { blogController } from './blog.controller'
import { BlogSortByFields } from './types/blog.types'
import { blogInputValidation } from './utils/blog-input.validation'

export const blogRouter: Router = Router()

blogRouter
  .get(
    HOME,
    getQueryValidation(BlogSortByFields),
    validationResultMiddleware,
    blogController.getAll,
  )

  .get(ID, idValidation, validationResultMiddleware, blogController.getOne)

  .post(
    HOME,
    authGuardMiddleware,
    blogInputValidation,
    validationResultMiddleware,
    blogController.create,
  )

  .put(
    ID,
    authGuardMiddleware,
    idValidation,
    blogInputValidation,
    validationResultMiddleware,
    blogController.update,
  )

  .delete(
    ID,
    authGuardMiddleware,
    idValidation,
    validationResultMiddleware,
    blogController.delete,
  )
