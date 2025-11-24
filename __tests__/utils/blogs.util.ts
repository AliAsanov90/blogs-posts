import { Application } from 'express'
import request from 'supertest'
import { AUTH_HEADER_NAME } from '../../src/common/constants/common'
import { BLOGS } from '../../src/common/constants/routes'
import { HttpStatus } from '../../src/common/types/http-statuses.types'
import { BlogInput } from '../../src/features/blogs/types/blog.types'

type GetAllParams = {
  app: Application
  httpStatus?: HttpStatus
}

type GetOneParams = GetAllParams & {
  id: string
}

type DeleteParams = GetOneParams & {
  token?: string
}

type CreateParams = GetAllParams & {
  data: BlogInput
  token?: string
}

type UpdateParams = CreateParams & {
  id: string
}

const create = async ({ app, token = '', data, httpStatus = HttpStatus.Created }: CreateParams) => {
  return await request(app)
    .post(BLOGS)
    .set(AUTH_HEADER_NAME, token)
    .send(data)
    .expect(httpStatus)
}

const update = async ({ app, token= '', data, id, httpStatus = HttpStatus.NoContent }: UpdateParams) => {
  return await request(app)
    .put(BLOGS + `/${id}`)
    .set(AUTH_HEADER_NAME, token)
    .send(data)
    .expect(httpStatus)
}

const deleteOne = async ({ app, token = '', id, httpStatus = HttpStatus.NoContent }: DeleteParams) => {
  return await request(app)
    .delete(BLOGS + `/${id}`)
    .set(AUTH_HEADER_NAME, token)
    .expect(httpStatus)
}

const getAll = async ({ app, httpStatus = HttpStatus.Ok }: GetAllParams) => {
  return await request(app)
    .get(BLOGS)
    .expect(httpStatus)
}

const getOne = async ({ app, id, httpStatus = HttpStatus.Ok }: GetOneParams) => {
  return await request(app)
    .get(BLOGS + `/${id}`)
    .expect(httpStatus)
}

export const blogsTestManager = {
  create,
  update,
  deleteOne,
  getAll,
  getOne
}
