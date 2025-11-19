import { NextFunction, Request, Response } from 'express'
import { blogRepository } from '../../blogs/repository/blog.repository'
import { HttpStatus } from '../../core/types/http-statuses'
import { postInputDto } from '../dto/blog.dto'
import { PostInput } from '../types/post'

export const isBlogExisting = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { blogId } = postInputDto(req.body as PostInput)
  const blog = blogRepository.getOne(blogId)

  if (!blog) {
    return res.sendStatus(HttpStatus.NotFound)
  }

  res.locals.blogName = blog.name

  next()
}
