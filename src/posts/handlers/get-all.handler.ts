import { Request, Response } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { postRepository } from '../repository/post.repository'
import { mapToPostViewModel } from '../utils/map-to-post-view-model.util'

export const getAllPosts = async (req: Request, res: Response) => {
  const posts = await postRepository.getAll()

  res
    .status(HttpStatus.Ok)
    .send(posts.map(mapToPostViewModel))
}
