import { Request, Response } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { blogRepository } from '../repository/blog.repository.mongo'
import { mapToBlogViewModel } from '../utils/map-to-blog-view-model.util'

export const getOneBlog = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const id = req.params.id
  const blog = await blogRepository.getOne(id)

  if (!blog) {
    return res.sendStatus(HttpStatus.NotFound)
  }

  return res.status(HttpStatus.Ok).send(mapToBlogViewModel(blog))
}
