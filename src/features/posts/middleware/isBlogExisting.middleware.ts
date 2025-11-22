import { NextFunction, Request, Response } from 'express'
import { blogRepository } from '../../blogs/repository/blog.repository.mongo'
import { HttpStatus } from '../../core/types/http-statuses'
import { postInputDto } from '../dto/blog.dto'
import { PostInput } from '../types/post'

export const isBlogExisting = async (
  req: Request<unknown, unknown, PostInput>,
  res: Response,
  next: NextFunction,
) => {
  const { blogId } = postInputDto(req.body)

  if (!blogId) {
    return res.sendStatus(HttpStatus.BadRequest)
  }

  const blog = await blogRepository.getOne(blogId)

  if (!blog) {
    return res.sendStatus(HttpStatus.NotFound)
  }

  res.locals.blogName = blog.name

  next()
}
