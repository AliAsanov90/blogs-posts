import { Request, Response } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { blogInputDto } from '../dto/blog.dto'
import { blogRepository } from '../repository/blog.repository.mongo'
import { BlogInput } from '../types/blog'

export const updateBlog = async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id
  const blog = await blogRepository.getOne(id)

  if (!blog) {
    return res.sendStatus(HttpStatus.NotFound)
  }

  const updatedBlog = {
    ...blog,
    ...blogInputDto(req.body as BlogInput),
  }

  await blogRepository.update(id, updatedBlog)

  res.sendStatus(HttpStatus.NoContent)
}
