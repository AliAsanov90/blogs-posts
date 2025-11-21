import { Request, Response } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { blogRepository } from '../repository/blog.repository.mongo'
import { mapToBlogViewModel } from '../utils/map-to-blog-view-model.util'

export const getAllBlogs = async (req: Request, res: Response) => {
  const blogs = await blogRepository.getAll()

  res
    .status(HttpStatus.Ok)
    .send(blogs.map(mapToBlogViewModel))
}
