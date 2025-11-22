import { Router } from 'express'
import { HOME, ID } from '../../core/constants/routes'
import { authGuardMiddleware } from '../../core/middleware/auth.middleware'
import { idValidation } from '../../core/middleware/id-validation.middleware'
import { validationResultMiddleware } from '../../core/middleware/validation-result.middleware'
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
