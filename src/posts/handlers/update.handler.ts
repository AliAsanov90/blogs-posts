import { Request, Response } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { postInputDto } from '../dto/blog.dto'
import { postRepository } from '../repository/post.repository'
import { Post, PostInput } from '../types/post'

export const updatePost = (
  req: Request<{ id: string }>,
  res: Response<Post, { blogName: string }>,
) => {
  const id = req.params.id
  const post = postRepository.getOne(id)

  if (!post) {
    return res.sendStatus(HttpStatus.NotFound)
  }

  const updatedPost: Post = {
    id,
    blogName: res.locals.blogName,
    ...postInputDto(req.body as PostInput),
  }

  postRepository.update(id, updatedPost)

  res.sendStatus(HttpStatus.NoContent)
}
