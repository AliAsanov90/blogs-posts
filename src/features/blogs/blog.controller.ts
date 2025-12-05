import { Response } from 'express'
import { HttpStatus } from '../../common/types/http-statuses.types'
import {
  RequestWithBlogIdAndBody,
  RequestWithBlogIdAndQuery,
  RequestWithBody,
  RequestWithId,
  RequestWithIdAndBody,
  RequestWithQuery,
} from '../../common/types/request-response.types'
import { catchAsync } from '../../common/utils/catch-async.util'
import { setDefaultSortAndPagination } from '../../common/utils/set-default-sort-pagination.util'
import { postQueryRepository } from '../posts/repository/post-query.repository'
import { PostInput, PostQueryInput, PostSortByFields } from '../posts/types/post.types'
import { blogService } from './blog.service'
import { blogQueryRepository } from './repository/blog-query.repository'
import {
  BlogInput,
  BlogQueryInput,
  BlogSearchQueryFields,
  BlogSortByFields,
} from './types/blog.types'

class BlogController {
  public getAll = catchAsync(
    async (req: RequestWithQuery<BlogSortByFields, BlogSearchQueryFields>, res: Response) => {
      const queryInput = setDefaultSortAndPagination<BlogQueryInput>(req.sanitizedQuery)

      const result = await blogQueryRepository.findMany(queryInput)

      res.status(HttpStatus.Ok).send(result)
    },
  )

  public getOne = catchAsync(async (req: RequestWithId, res: Response) => {
    const blog = await blogQueryRepository.findById(req.params.id)

    return blog ? res.status(HttpStatus.Ok).send(blog) : res.sendStatus(HttpStatus.NotFound)
  })

  public getPostsByBlogId = catchAsync(
    async (req: RequestWithBlogIdAndQuery<PostSortByFields>, res: Response) => {
      const queryInput = setDefaultSortAndPagination<PostQueryInput>(req.sanitizedQuery)

      const result = await blogService.getPostsByBlogId(queryInput, req.params.blogId)

      res.status(HttpStatus.Ok).send(result)
    },
  )

  public createPostByBlogId = catchAsync(
    async (req: RequestWithBlogIdAndBody<Omit<PostInput, 'blogId'>>, res: Response) => {
      const inputData: PostInput = { ...req.body, blogId: req.params.blogId }

      const createdPostId = await blogService.createPostByBlogId(inputData)
      const post = await postQueryRepository.findById(createdPostId)

      res.status(HttpStatus.Created).send(post)
    },
  )

  public create = catchAsync(async (req: RequestWithBody<BlogInput>, res: Response) => {
    const createdBlogId = await blogService.create(req.body)
    const blog = await blogQueryRepository.findById(createdBlogId)

    res.status(HttpStatus.Created).send(blog)
  })

  public update = catchAsync(async (req: RequestWithIdAndBody<BlogInput>, res: Response) => {
    const isUpdated = await blogService.update(req.params.id, req.body)

    return isUpdated ? res.sendStatus(HttpStatus.NoContent) : res.sendStatus(HttpStatus.NotFound)
  })

  public delete = catchAsync(async (req: RequestWithId, res: Response) => {
    const isDeleted = await blogService.delete(req.params.id)

    return isDeleted ? res.sendStatus(HttpStatus.NoContent) : res.sendStatus(HttpStatus.NotFound)
  })
}

export const blogController = new BlogController()
