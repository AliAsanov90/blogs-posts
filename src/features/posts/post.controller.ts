import { Request, Response } from 'express'
import { HttpStatus } from '../../common/types/http-statuses.types'
import {
  RequestWithId,
  RequestWithIdAndPostInput,
  RequestWithPostInput,
} from '../../common/types/request-response.types'
import { catchAsync } from '../../common/utils/catch-async.util'
import { postService } from './post.service'
import { mapToPostOutput } from './utils/post-output.mapper'

class PostController {
  public getAll = catchAsync(async (req: Request, res: Response) => {
    const posts = await postService.getAll()
    res.status(HttpStatus.Ok).send(posts.map(mapToPostOutput))
  })

  public getOne = catchAsync(async (req: RequestWithId, res: Response) => {
    const post = await postService.getOne(req.params.id)

    return post
      ? res.status(HttpStatus.Ok).send(mapToPostOutput(post))
      : res.sendStatus(HttpStatus.NotFound)
  })

  public create = catchAsync(
    async (req: RequestWithPostInput, res: Response) => {
      const createdPost = await postService.create(req.body)
      res.status(HttpStatus.Created).send(mapToPostOutput(createdPost))
    },
  )

  public update = catchAsync(
    async (req: RequestWithIdAndPostInput, res: Response) => {
      const isUpdated = await postService.update(req.params.id, req.body)

      return isUpdated
        ? res.sendStatus(HttpStatus.NoContent)
        : res.sendStatus(HttpStatus.NotFound)
    },
  )

  public delete = catchAsync(async (req: RequestWithId, res: Response) => {
    const isDeleted = await postService.delete(req.params.id)

    return isDeleted
      ? res.sendStatus(HttpStatus.NoContent)
      : res.sendStatus(HttpStatus.NotFound)
  })
}

export const postController = new PostController()
