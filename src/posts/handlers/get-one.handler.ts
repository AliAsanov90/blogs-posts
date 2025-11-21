import { Request, Response } from 'express'
import { HttpStatus } from '../../core/types/http-statuses'
import { postRepository } from '../repository/post.repository'
import { mapToPostViewModel } from '../utils/map-to-post-view-model.util'

export const getOnePost = async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id
  const post = await postRepository.getOne(id)

  if (!post) {
    return res.sendStatus(HttpStatus.NotFound)
  }

  return res.status(HttpStatus.Ok).send(mapToPostViewModel(post))
}
