import { Request, Response, Router } from 'express'
import { ALL_DATA } from '../../common/constants/routes'
import { HttpStatus } from '../../common/types/http-statuses.types'
import { blogsCollection, postsCollection } from '../../db/mongo.db'

const deleteAllData = async (req: Request, res: Response) => {
  await Promise.all([
    blogsCollection.deleteMany(),
    postsCollection.deleteMany(),
  ])
  res.sendStatus(HttpStatus.NoContent)
}

export const testingRouter: Router = Router()

testingRouter.delete(ALL_DATA, deleteAllData)
