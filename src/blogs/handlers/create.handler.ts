import { Request, Response } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { blogInputDto } from '../dto/blog.dto'
import { blogRepository } from '../repository/blog.repository.mongo'
import { Blog, BlogInput } from '../types/blog'
import { mapToBlogViewModel } from '../utils/map-to-blog-view-model.util'

export const createBlog = async (req: Request, res: Response) => {
  const newBlog: Blog = {
    ...blogInputDto(req.body as BlogInput),
    isMembership: false,
    createdAt: new Date(),
  }

  const createdBlog = await blogRepository.create(newBlog)

  res.status(HttpStatus.Created).send(mapToBlogViewModel(createdBlog))
}
