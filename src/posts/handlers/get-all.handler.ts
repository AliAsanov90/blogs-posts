import { Request, Response } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { postRepository } from '../repository/post.repository'

export const getAllPosts = (req: Request, res: Response) => {
  const posts = postRepository.getAll()
  res.status(HttpStatus.Ok).send(posts)
}
