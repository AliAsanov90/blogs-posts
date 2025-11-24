import { Response } from 'express'
import { HttpStatus } from '../../common/types/http-statuses.types'
import {
  RequestWithBlogInput,
  RequestWithBlogQuery,
  RequestWithId,
  RequestWithIdAndBlogInput,
} from '../../common/types/request-response.types'
import { catchAsync } from '../../common/utils/catch-async.util'
import { setDefaultSortAndPagination } from '../../common/utils/set-default-sort-pagination.util'
import { blogService } from './blog.service'
import { BlogSortByFields } from './types/blog.types'
import {
  mapToBlogOutput,
  mapToBlogsPaginatedOutput,
} from './utils/blog-output.mapper'

class BlogController {
  public getAll = catchAsync(
    async (req: RequestWithBlogQuery, res: Response) => {
      const queryInput = setDefaultSortAndPagination<BlogSortByFields>(
        req.query,
      )

      const { items, totalCount } = await blogService.getAll(queryInput)

      res
        .status(HttpStatus.Ok)
        .send(mapToBlogsPaginatedOutput(items, totalCount, queryInput))
    },
  )

  public getOne = catchAsync(async (req: RequestWithId, res: Response) => {
    const blog = await blogService.getOne(req.params.id)

    return blog
      ? res.status(HttpStatus.Ok).send(mapToBlogOutput(blog))
      : res.sendStatus(HttpStatus.NotFound)
  })

  public create = catchAsync(
    async (req: RequestWithBlogInput, res: Response) => {
      const createdBlog = await blogService.create(req.body)
      res.status(HttpStatus.Created).send(mapToBlogOutput(createdBlog))
    },
  )

  public update = catchAsync(
    async (req: RequestWithIdAndBlogInput, res: Response) => {
      const isUpdated = await blogService.update(req.params.id, req.body)

      return isUpdated
        ? res.sendStatus(HttpStatus.NoContent)
        : res.sendStatus(HttpStatus.NotFound)
    },
  )

  public delete = catchAsync(async (req: RequestWithId, res: Response) => {
    const isDeleted = await blogService.delete(req.params.id)

    return isDeleted
      ? res.sendStatus(HttpStatus.NoContent)
      : res.sendStatus(HttpStatus.NotFound)
  })
}

export const blogController = new BlogController()
