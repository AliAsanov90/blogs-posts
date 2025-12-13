import { Response } from 'express'
import { HttpStatus } from '../../common/types/http-statuses.types'
import {
  RequestWithBody,
  RequestWithId,
  RequestWithQuery,
} from '../../common/types/request-response.types'
import { catchAsync } from '../../common/utils/catch-async.util'
import { setDefaultSortAndPagination } from '../../common/utils/set-default-sort-pagination.util'
import { userQueryRepository } from './repository/user-query.repository'
import { UserInput, UserQueryInput, UserSortByFields } from './types/user.types'
import { userService } from './user.service'

class UserController {
  public getAll = catchAsync(async (req: RequestWithQuery<UserSortByFields>, res: Response) => {
    const queryInput = setDefaultSortAndPagination<UserQueryInput>(req.sanitizedQuery)

    const result = await userQueryRepository.findMany(queryInput)

    res.status(HttpStatus.Ok).send(result)
  })

  public create = catchAsync(async (req: RequestWithBody<UserInput>, res: Response) => {
    const createdUserId = await userService.create(req.body)
    const user = await userQueryRepository.findById(createdUserId)

    res.status(HttpStatus.Created).send(user)
  })

  public delete = catchAsync(async (req: RequestWithId, res: Response) => {
    const isDeleted = await userService.delete(req.params.id)

    return isDeleted ? res.sendStatus(HttpStatus.NoContent) : res.sendStatus(HttpStatus.NotFound)
  })
}

export const userController = new UserController()
