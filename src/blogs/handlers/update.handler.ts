import { Request, Response } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { blogInputDto } from '../dto/blog.dto'
import { blogRepository } from '../repository/blog.repository'
import { BlogInput } from '../types/blog'

export const updateBlog = (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id
  const blog = blogRepository.getOne(id)

  if (!blog) {
    return res.sendStatus(HttpStatus.NotFound)
  }

  const updatedBlog = {
    id,
    ...blogInputDto(req.body as BlogInput),
  }

  blogRepository.update(id, updatedBlog)

  res.sendStatus(HttpStatus.NoContent)
}
