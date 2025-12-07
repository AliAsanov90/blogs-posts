import { Router } from 'express'
import { COMMENTS_BY_POST_ID, HOME, ID } from '../../common/constants/routes'
import { basicAuthGuardMiddleware } from '../../common/middleware/basic-auth.middleware'
import { bearerAuthGuardMiddleware } from '../../common/middleware/bearer-auth.middleware'
import { idValidation } from '../../common/middleware/id-validation.middleware'
import { getQueryValidation } from '../../common/middleware/query-validation.middleware'
import { validationResultMiddleware } from '../../common/middleware/validation-result.middleware'
import { CommentSortByFields } from '../comments/types/comment.types'
import { commentInputValidation } from '../comments/utils/comment-input.validation'
import { postController } from './post.controller'
import { PostSortByFields } from './types/post.types'
import { postIdValidation } from './utils/post-id.validation'
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
    basicAuthGuardMiddleware,
    postInputDtoValidation,
    validationResultMiddleware,
    postController.create,
  )

  .put(
    ID,
    basicAuthGuardMiddleware,
    idValidation,
    postInputDtoValidation,
    validationResultMiddleware,
    postController.update,
  )

  .delete(
    ID,
    basicAuthGuardMiddleware,
    idValidation,
    validationResultMiddleware,
    postController.delete,
  )

  .get(
    COMMENTS_BY_POST_ID,
    postIdValidation,
    getQueryValidation(CommentSortByFields),
    validationResultMiddleware,
    postController.getCommentsByPostId,
  )

  .post(
    COMMENTS_BY_POST_ID,
    bearerAuthGuardMiddleware,
    postIdValidation,
    commentInputValidation,
    validationResultMiddleware,
    postController.createCommentByPostId,
  )
