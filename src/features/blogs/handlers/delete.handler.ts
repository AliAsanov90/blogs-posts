import { Request, Response } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { blogRepository } from '../repository/blog.repository.mongo'

export const deleteBlog = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const id = req.params.id
  const blog = await blogRepository.getOne(id)

  if (!blog) {
    return res.sendStatus(HttpStatus.NotFound)
  }

  await blogRepository.deleteOne(id)

  res.sendStatus(HttpStatus.NoContent)
}
