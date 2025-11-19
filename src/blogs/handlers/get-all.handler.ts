import { Request, Response } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { blogRepository } from '../repository/blog.repository'

export const getAllBlogs = (req: Request, res: Response) => {
  const blogs = blogRepository.getAll()
  res.status(HttpStatus.Ok).send(blogs)
}
