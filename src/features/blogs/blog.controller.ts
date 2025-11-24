import { Request, Response } from 'express'
import { HttpStatus } from '../../common/types/http-statuses.types'
import {
  RequestWithBlogInput,
  RequestWithId,
  RequestWithIdAndBlogInput,
} from '../../common/types/request-response.types'
import { catchAsync } from '../../common/utils/catch-async.util'
import { blogService } from './blog.service'
import { mapToBlogOutput } from './utils/blog-output.mapper'

class BlogController {
  public getAll = catchAsync(async (req: Request, res: Response) => {
    const blogs = await blogService.getAll()
    res.status(HttpStatus.Ok).send(blogs.map(mapToBlogOutput))
  })

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
