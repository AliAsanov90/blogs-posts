import { Request, Response } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { postRepository } from '../repository/post.repository'

export const deletePost = (req: Request, res: Response) => {
  const id = req.params.id ?? ''
  const post = postRepository.getOne(id)

  if (!post) {
    return res.sendStatus(HttpStatus.NotFound)
  }

  postRepository.deleteOne(id)

  res.sendStatus(HttpStatus.NoContent)
}
