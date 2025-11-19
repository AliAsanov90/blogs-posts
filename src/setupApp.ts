import 'dotenv/config'
import express, { Application } from 'express'
import { blogRouter } from './blogs/routers/blog.router'
import { BLOGS, HOME, POSTS, TESTING } from './core/constants/routes'
import { postRouter } from './posts/routers/post.router'
import { testingRouter } from './testing/routers/testing.router'

export const setupApp = (): Application => {
  const app = express()

  app.use(express.json())

  app.use(BLOGS, blogRouter)
  app.use(POSTS, postRouter)
  app.use(TESTING, testingRouter)

  app.get(HOME, (req, res) => {
    res.status(200).send('Hello world!!!')
  })

  return app
}
