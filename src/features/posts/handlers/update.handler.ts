import { Request, Response } from 'express'
import { HttpStatus } from '../../../common/types/http-statuses'
import { postInputDto } from '../dto/blog.dto'
import { postRepository } from '../repository/post.repository'
import { Post, PostInput } from '../types/post'

export const updatePost = async (
  req: Request<{ id: string }>,
  res: Response<Post, { blogName: string }>,
) => {
  const id = req.params.id
  const post = await postRepository.getOne(id)

  if (!post) {
    return res.sendStatus(HttpStatus.NotFound)
  }

  const updatedPost: Post = {
    ...post,
    ...postInputDto(req.body as PostInput),
    blogName: res.locals.blogName,
  }

  await postRepository.update(id, updatedPost)

  res.sendStatus(HttpStatus.NoContent)
}
