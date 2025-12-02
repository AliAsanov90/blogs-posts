import { Router } from 'express'
import { HOME, ID, POSTS_BY_BLOG_ID } from '../../common/constants/routes'
import { authGuardMiddleware } from '../../common/middleware/auth.middleware'
import { idValidation } from '../../common/middleware/id-validation.middleware'
import { getQueryValidation } from '../../common/middleware/query-validation.middleware'
import { validationResultMiddleware } from '../../common/middleware/validation-result.middleware'
import { PostSortByFields } from '../posts/types/post.types'
import { postInputByBlogValidation } from '../posts/utils/post-input.validation'
import { blogController } from './blog.controller'
import { BlogSearchQueryFields, BlogSortByFields } from './types/blog.types'
import { blogIdValidation } from './utils/blog-id.validation'
import { blogInputValidation } from './utils/blog-input.validation'

export const blogRouter: Router = Router()

blogRouter
  .get(
    HOME,
    getQueryValidation(BlogSortByFields, BlogSearchQueryFields),
    validationResultMiddleware,
    blogController.getAll,
  )

  .get(ID, idValidation, validationResultMiddleware, blogController.getOne)

  .get(
    POSTS_BY_BLOG_ID,
    blogIdValidation,
    getQueryValidation(PostSortByFields),
    validationResultMiddleware,
    blogController.getPostsByBlogId,
  )

  .post(
    POSTS_BY_BLOG_ID,
    authGuardMiddleware,
    blogIdValidation,
    postInputByBlogValidation,
    validationResultMiddleware,
    blogController.createPostByBlogId,
  )

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
