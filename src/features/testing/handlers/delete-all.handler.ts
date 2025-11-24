import { Request, Response } from 'express'
import { HttpStatus } from '../../../common/types/http-statuses.types'
import { blogsCollection, postsCollection } from '../../../db/mongo.db'

export const deleteAllData = async (req: Request, res: Response) => {
  await Promise.all([
    blogsCollection.deleteMany(),
    postsCollection.deleteMany(),
  ])

  res.sendStatus(HttpStatus.NoContent)
}
