import { Application } from 'express'
import request from 'supertest'
import { COMMENTS, POSTS, TESTING_ALL_DATA } from '../../src/common/constants/routes'
import { HttpStatus } from '../../src/common/types/http-statuses.types'
import { BlogOutput } from '../../src/features/blogs/types/blog.types'
import { CommentOutput } from '../../src/features/comments/types/comment.types'
import { PostOutput } from '../../src/features/posts/types/post.types'
import { UserInput, UserOutput } from '../../src/features/users/types/user.types'
import { authTestManager } from './auth.util'
import { blogsTestManager } from './blogs.util'
import { postsTestManager } from './posts.util'
import { usersTestManager } from './users.util'

export const clearDb = async (app: Application) => {
  await request(app).delete(TESTING_ALL_DATA).expect(HttpStatus.NoContent)
}

export function getCommentsRoute(postId: string) {
  return POSTS + `/${postId}` + COMMENTS
}

export function formatBearerToken(token: string) {
  return `Bearer ${token}`
}

export async function createTestData(app: Application, userInputData?: Partial<UserInput>) {
  const USER_PASSWORD = 'test_password'

  const postHelper = postsTestManager(app)
  const blogHelper = blogsTestManager(app)
  const userHelper = usersTestManager(app)
  const authHelper = authTestManager(app)

  // create blog
  const createdBlogRes = await blogHelper.create({})
  const createdBlog: BlogOutput = createdBlogRes.body

  // create post
  const createdPostRes = await postHelper.create({
    data: { blogId: createdBlogRes.body.id },
  })
  const createdPost: PostOutput = createdPostRes.body

  // create user
  const createdUserRes = await userHelper.create({
    data: { password: USER_PASSWORD, ...userInputData },
  })
  const createdUser: UserOutput = createdUserRes.body

  // login
  const loginRes = await authHelper.login({
    data: {
      loginOrEmail: createdUserRes.body.login,
      password: USER_PASSWORD,
    },
  })
  const accessToken: string = loginRes.body.accessToken

  // create comment
  const createdCommentRes = await postHelper.createComment({
    token: accessToken,
    postId: createdPost.id,
  })
  const createdComment: CommentOutput = createdCommentRes.body

  return {
    blog: createdBlog,
    post: createdPost,
    user: createdUser,
    userAccessToken: accessToken,
    comment: createdComment,
  }
}
