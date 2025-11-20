import { Request, Response } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { blogInputDto } from '../dto/blog.dto'
import { blogRepository } from '../repository/blog.repository'
import { Blog, BlogInput } from '../types/blog'

export const createBlog = (req: Request, res: Response) => {
  const newBlog: Blog = {
    id: String(Date.now()),
    ...blogInputDto(req.body as BlogInput),
  }

  const createdBlog = blogRepository.create(newBlog)

  res.status(HttpStatus.Created).send(createdBlog)
}
