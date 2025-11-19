import { Request, Response } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { db } from '../../db/in-memory.db'

export const deleteAllData = (req: Request, res: Response) => {
  db.blogs = []
  db.posts = []

  res.sendStatus(HttpStatus.NoContent)
}
