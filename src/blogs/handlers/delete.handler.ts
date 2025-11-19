import { Request, Response } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { blogRepository } from '../repository/blog.repository'

export const deleteBlog = (req: Request, res: Response) => {
  const id = req.params.id ?? ''
  const blog = blogRepository.getOne(id)

  if (!blog) {
    return res.sendStatus(HttpStatus.NotFound)
  }

  blogRepository.deleteOne(id)

  res.sendStatus(HttpStatus.NoContent)
}
