import { Application } from 'express'
import request from 'supertest'
import { AUTH_HEADER_NAME } from '../../src/common/constants/common'
import { POSTS } from '../../src/common/constants/routes'
import { defaultSortPaginationValues } from '../../src/common/middleware/query-validation.middleware'
import { HttpStatus } from '../../src/common/types/http-statuses.types'
import { generateAuthToken } from '../../src/common/utils/generate-auth-token'
import { CommentInput } from '../../src/features/comments/types/comment.types'
import { PostInput, PostQueryInput } from '../../src/features/posts/types/post.types'
import { formatBearerToken, getCommentsRoute } from './test-helpers.util'

type CommonParams = {
  status?: HttpStatus
}

type GetAllParams = CommonParams & {
  query?: Partial<PostQueryInput>
}

type GetOneParams = CommonParams & {
  id: string
  query?: Partial<PostQueryInput>
}

type CreateParams = CommonParams & {
  token?: string
  query?: Partial<PostQueryInput>
  data?: Partial<PostInput>
}

type UpdateParams = CommonParams & {
  id: string
  token?: string
  data: Partial<PostInput>
}

type DeleteParams = CommonParams & {
  id: string
  token?: string
}

type GetAllCommentsParams = CommonParams & {
  postId: string
  query?: Partial<PostQueryInput>
}

type CreateCommentParams = CommonParams & {
  token: string
  postId: string
  data?: Partial<CommentInput>
}

const defaultTestData: PostInput = {
  title: 'Test title',
  shortDescription: 'Test short description',
  content: 'Test content',
  blogId: '691fe02e62d2354296c74857',
}

const defaultCommentInputData: CommentInput = {
  content: 'some comment that must be at least 20 chars long',
}

const { authToken } = generateAuthToken()

export const postsTestManager = (app: Application) => ({
  getAll: async ({ query, status = HttpStatus.Ok }: GetAllParams) => {
    const queryParams = { ...defaultSortPaginationValues, ...query }
    return await request(app).get(POSTS).query(queryParams).expect(status)
  },

  getOne: async ({ id, status = HttpStatus.Ok }: GetOneParams) => {
    return await request(app)
      .get(POSTS + `/${id}`)
      .expect(status)
  },

  create: async ({ token, data = {}, status = HttpStatus.Created }: CreateParams) => {
    return await request(app)
      .post(POSTS)
      .set(AUTH_HEADER_NAME, token ?? authToken)
      .send({ ...defaultTestData, ...data })
      .expect(status)
  },

  update: async ({ token, data, id, status = HttpStatus.NoContent }: UpdateParams) => {
    return await request(app)
      .put(POSTS + `/${id}`)
      .set(AUTH_HEADER_NAME, token ?? authToken)
      .send(data)
      .expect(status)
  },

  delete: async ({ token, id, status = HttpStatus.NoContent }: DeleteParams) => {
    return await request(app)
      .delete(POSTS + `/${id}`)
      .set(AUTH_HEADER_NAME, token ?? authToken)
      .expect(status)
  },

  getAllComments: async ({ postId, query, status = HttpStatus.Ok }: GetAllCommentsParams) => {
    const queryParams = { ...defaultSortPaginationValues, ...query }
    return await request(app).get(getCommentsRoute(postId)).query(queryParams).expect(status)
  },

  createComment: async ({
    token,
    postId,
    data = {},
    status = HttpStatus.Created,
  }: CreateCommentParams) => {
    return await request(app)
      .post(getCommentsRoute(postId))
      .set(AUTH_HEADER_NAME, formatBearerToken(token))
      .send({ ...defaultCommentInputData, ...data })
      .expect(status)
  },
})
