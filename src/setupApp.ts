import express, { Application } from 'express'
import { BLOGS, HOME, POSTS, TESTING } from './common/constants/routes'
import { blogRouter } from './features/blogs/routers/blog.router'
import { postRouter } from './features/posts/routers/post.router'
import { testingRouter } from './features/testing/routers/testing.router'

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
