import { Response } from 'express'
import { HttpStatus } from '../../common/types/http-statuses.types'
import { RequestWithId, RequestWithIdAndBody } from '../../common/types/request-response.types'
import { catchAsync } from '../../common/utils/catch-async.util'
import { commentService } from './comment.service'
import { commentQueryRepository } from './repository/comment-query.repository'
import { CommentInput } from './types/comment.types'

class CommentController {
  public getOne = catchAsync(async (req: RequestWithId, res: Response) => {
    const comment = await commentQueryRepository.findById(req.params.id)

    return comment ? res.status(HttpStatus.Ok).send(comment) : res.sendStatus(HttpStatus.NotFound)
  })

  public update = catchAsync(async (req: RequestWithIdAndBody<CommentInput>, res: Response) => {
    const isUpdated = await commentService.update(req.params.id, req.body, req.userId)

    return isUpdated ? res.sendStatus(HttpStatus.NoContent) : res.sendStatus(HttpStatus.NotFound)
  })

  public delete = catchAsync(async (req: RequestWithId, res: Response) => {
    const isDeleted = await commentService.delete(req.params.id, req.userId)

    return isDeleted ? res.sendStatus(HttpStatus.NoContent) : res.sendStatus(HttpStatus.NotFound)
  })
}

export const commentController = new CommentController()
