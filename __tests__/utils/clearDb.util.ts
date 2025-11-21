import { Application } from 'express'
import request from 'supertest'
import { TESTING_ALL_DATA } from "../../src/core/constants/routes"
import { HttpStatus } from "../../src/core/types/http-statuses"

export const clearDb = async (app: Application) => {
    await request(app).delete(TESTING_ALL_DATA).expect(HttpStatus.NoContent)
}
