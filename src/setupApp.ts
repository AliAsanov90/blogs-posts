import express, { Application } from 'express'
import {
  AUTH,
  BLOGS,
  HOME,
  POSTS,
  TESTING,
  USERS,
} from './common/constants/routes'
import { authRouter } from './features/auth/auth.router'
import { blogRouter } from './features/blogs/blog.router'
import { postRouter } from './features/posts/post.router'
import { testingRouter } from './features/testing/testing.router'
import { userRouter } from './features/users/user.router'

export const setupApp = (): Application => {
  const app = express()

  app.use(express.json())

  app.use(BLOGS, blogRouter)
  app.use(POSTS, postRouter)
  app.use(USERS, userRouter)
  app.use(AUTH, authRouter)
  app.use(TESTING, testingRouter)

  app.get(HOME, (req, res) => {
    res.status(200).send('Hello world!!!')
  })

  return app
}
