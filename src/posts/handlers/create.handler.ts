import { Request, Response } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { postInputDto } from '../dto/blog.dto'
import { postRepository } from '../repository/post.repository'
import { Post, PostInput } from '../types/post'
import { mapToPostViewModel } from '../utils/map-to-post-view-model.util'

export const createPost = async (
  req: Request,
  res: Response<Post, { blogName: string }>,
) => {
  const newPost: Post = {
    ...postInputDto(req.body as PostInput),
    blogName: res.locals.blogName,
    createdAt: new Date(),
  }

  const createdPost = await postRepository.create(newPost)

  res.status(HttpStatus.Created).send(mapToPostViewModel(createdPost))
}
