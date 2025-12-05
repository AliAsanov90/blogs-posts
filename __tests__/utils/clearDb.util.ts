import { Application } from 'express'
import request from 'supertest'
import { TESTING_ALL_DATA } from '../../src/common/constants/routes'
import { HttpStatus } from '../../src/common/types/http-statuses.types'

export const clearDb = async (app: Application) => {
  await request(app).delete(TESTING_ALL_DATA).expect(HttpStatus.NoContent)
}
