import { Request, Response } from 'express'
import { HttpStatus } from '../../../common/types/http-statuses'
import { postRepository } from '../repository/post.repository'

export const deletePost = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const id = req.params.id
  const post = await postRepository.getOne(id)

  if (!post) {
    return res.sendStatus(HttpStatus.NotFound)
  }

  await postRepository.deleteOne(id)

  res.sendStatus(HttpStatus.NoContent)
}
