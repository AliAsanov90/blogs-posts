import { Request, Response } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { db } from '../../db/in-memory.db'
import { postInputDto } from '../dto/blog.dto'
import { postRepository } from '../repository/post.repository'
import { Post, PostInput } from '../types/post'

export const createPost = (
  req: Request,
  res: Response<Post, { blogName: string }>,
) => {
  const newPost: Post = {
    id: String(db.posts.length + 1),
    blogName: res.locals.blogName,
    ...postInputDto(req.body as PostInput),
  }

  const createdPost = postRepository.create(newPost)

  res.status(HttpStatus.Created).send(createdPost)
}
