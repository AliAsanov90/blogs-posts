import 'dotenv/config'
import express, { Application } from 'express'
import { HOME, TESTING } from './core/constants/routes'
import { testingRouter } from './testing/routers/testing.router'

export const setupApp = (): Application => {
  const app = express()

  app.use(express.json())

  app.use(TESTING, testingRouter)

  app.get(HOME, (req, res) => {
    res.status(200).send('Hello world!!!')
  })

  return app
}
