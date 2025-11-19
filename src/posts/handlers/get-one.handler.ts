import { Request, Response } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { postRepository } from '../repository/post.repository'

export const getOnePost = (req: Request, res: Response) => {
  const id = req.params.id ?? '' // TODO: ask about this

  const post = postRepository.getOne(id)

  if (!post) {
    return res.sendStatus(HttpStatus.NotFound)
  }

  return res.status(HttpStatus.Ok).send(post)
}
