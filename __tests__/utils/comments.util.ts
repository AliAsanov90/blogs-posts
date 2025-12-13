import { Application } from 'express'
import request from 'supertest'
import { AUTH_HEADER_NAME } from '../../src/common/constants/common'
import { COMMENTS } from '../../src/common/constants/routes'
import { HttpStatus } from '../../src/common/types/http-statuses.types'
import { CommentInput } from '../../src/features/comments/types/comment.types'
import { formatBearerToken } from './test-helpers.util'

type GetOneParams = {
  id: string
  status?: HttpStatus
}

type UpdateParams = {
  token: string
  commentId: string
  data?: Partial<CommentInput>
  status?: HttpStatus
}

type DeleteParams = {
  commentId: string
  token: string
  status?: HttpStatus
}

const commentUpdatedContentData: CommentInput = {
  content: 'some updated comment content with random words'
}

export const commentsTestManager = (app: Application) => ({
  getOne: async ({ id, status = HttpStatus.Ok }: GetOneParams) => {
    return await request(app)
      .get(COMMENTS + `/${id}`)
      .expect(status)
  },

  update: async ({ token, commentId, data = {}, status = HttpStatus.NoContent }: UpdateParams) => {
    return await request(app)
      .put(COMMENTS + `/${commentId}`)
      .set(AUTH_HEADER_NAME, formatBearerToken(token))
      .send({ ...commentUpdatedContentData, ...data })
      .expect(status)
  },

  delete: async ({ token, commentId, status = HttpStatus.NoContent }: DeleteParams) => {
    return await request(app)
      .delete(COMMENTS + `/${commentId}`)
      .set(AUTH_HEADER_NAME, formatBearerToken(token))
      .expect(status)
  },
})
