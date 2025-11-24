import { Router } from 'express'
import { HOME, ID } from '../../../common/constants/routes'
import { authGuardMiddleware } from '../../../common/middleware/auth.middleware'
import { idValidation } from '../../../common/middleware/id-validation.middleware'
import { validationResultMiddleware } from '../../../common/middleware/validation-result.middleware'
import { createBlog } from '../handlers/create.handler'
import { deleteBlog } from '../handlers/delete.handler'
import { getAllBlogs } from '../handlers/get-all.handler'
import { getOneBlog } from '../handlers/get-one.handler'
import { updateBlog } from '../handlers/update.handler'
import { blogInputDtoValidation } from '../validation/blog-input-dto.validation'

export const blogRouter: Router = Router()

blogRouter
  .get(HOME, getAllBlogs)

  .get(ID, idValidation, validationResultMiddleware, getOneBlog)

  .post(
    HOME,
    authGuardMiddleware,
    blogInputDtoValidation,
    validationResultMiddleware,
    createBlog,
  )

  .put(
    ID,
    authGuardMiddleware,
    idValidation,
    blogInputDtoValidation,
    validationResultMiddleware,
    updateBlog,
  )

  .delete(
    ID,
    authGuardMiddleware,
    idValidation,
    validationResultMiddleware,
    deleteBlog,
  )
