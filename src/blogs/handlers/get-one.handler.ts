import { Request, Response } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { blogRepository } from '../repository/blog.repository'

export const getOneBlog = (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id
  const blog = blogRepository.getOne(id)

  if (!blog) {
    return res.sendStatus(HttpStatus.NotFound)
  }

  return res.status(HttpStatus.Ok).send(blog)
}
