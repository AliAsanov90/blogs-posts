import { Router } from 'express'
import { HOME, ID } from '../../core/constants/routes'
import { authGuardMiddleware } from '../../core/middleware/auth.middleware'
import { idValidation } from '../../core/middleware/id-validation.middleware'
import { validationResultMiddleware } from '../../core/middleware/validation-result.middleware'
import { createPost } from '../handlers/create.handler'
import { deletePost } from '../handlers/delete.handler'
import { getAllPosts } from '../handlers/get-all.handler'
import { getOnePost } from '../handlers/get-one.handler'
import { updatePost } from '../handlers/update.handler'
import { isBlogExisting } from '../middleware/isBlogExisting.middleware'
import { postInputDtoValidation } from '../validation/post-input-dto.validation'

export const postRouter: Router = Router()

postRouter
  .get(HOME, getAllPosts)

  .get(ID, idValidation, validationResultMiddleware, getOnePost)

  .post(
    HOME,
    authGuardMiddleware,
    postInputDtoValidation,
    validationResultMiddleware,
    isBlogExisting,
    createPost,
  )

  .put(
    ID,
    authGuardMiddleware,
    idValidation,
    postInputDtoValidation,
    validationResultMiddleware,
    isBlogExisting,
    updatePost,
  )

  .delete(
    ID,
    authGuardMiddleware,
    idValidation,
    validationResultMiddleware,
    isBlogExisting,
    deletePost,
  )
