import { Response } from 'express'
import { HttpStatus } from '../../common/types/http-statuses.types'
import {
  RequestWithBody,
  RequestWithId,
  RequestWithIdAndBody,
  RequestWithQuery,
} from '../../common/types/request-response.types'
import { catchAsync } from '../../common/utils/catch-async.util'
import { setDefaultSortAndPagination } from '../../common/utils/set-default-sort-pagination.util'
import { postService } from './post.service'
import { postQueryRepository } from './repository/post-query.repository'
import { PostInput, PostQueryInput, PostSortByFields } from './types/post.types'

class PostController {
  public getAll = catchAsync(async (req: RequestWithQuery<PostSortByFields>, res: Response) => {
    const queryInput = setDefaultSortAndPagination<PostQueryInput>(req.sanitizedQuery)

    const result = await postService.getAll(queryInput)

    res.status(HttpStatus.Ok).send(result)
  })

  public getOne = catchAsync(async (req: RequestWithId, res: Response) => {
    const post = await postQueryRepository.findById(req.params.id)

    return post ? res.status(HttpStatus.Ok).send(post) : res.sendStatus(HttpStatus.NotFound)
  })

  public create = catchAsync(async (req: RequestWithBody<PostInput>, res: Response) => {
    const createdPostId = await postService.create(req.body)
    const post = await postQueryRepository.findById(createdPostId)

    res.status(HttpStatus.Created).send(post)
  })

  public update = catchAsync(async (req: RequestWithIdAndBody<PostInput>, res: Response) => {
    const isUpdated = await postService.update(req.params.id, req.body)

    return isUpdated ? res.sendStatus(HttpStatus.NoContent) : res.sendStatus(HttpStatus.NotFound)
  })

  public delete = catchAsync(async (req: RequestWithId, res: Response) => {
    const isDeleted = await postService.delete(req.params.id)

    return isDeleted ? res.sendStatus(HttpStatus.NoContent) : res.sendStatus(HttpStatus.NotFound)
  })
}

export const postController = new PostController()
