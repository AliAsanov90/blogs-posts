import { Messages } from '../../../src/common/constants/messages'
import { HttpStatus } from '../../../src/common/types/http-statuses.types'
import { closeDb, runDb } from '../../../src/db/mongo.db'
import { BlogOutput } from '../../../src/features/blogs/types/blog.types'
import { PostOutput } from '../../../src/features/posts/types/post.types'
import { UserOutput } from '../../../src/features/users/types/user.types'
import { setupApp } from '../../../src/setupApp'
import { blogsTestManager } from '../../utils/blogs.util'
import { postsTestManager } from '../../utils/posts.util'
import { clearDb, createTestData } from '../../utils/test-helpers.util'


describe('Posts API', () => {
  const app = setupApp()
  const postHelper = postsTestManager(app)

  beforeAll(async () => {
    await runDb()
  })
  afterAll(async () => {
    closeDb()
  })

  // POST
  describe('POST endpoint; POST --> /posts', () => {
    let createdBlog: BlogOutput
    let createdPost: PostOutput

    afterAll(async () => {
      await clearDb(app)
    })

    it('Should create a post', async () => {
      const { blog, post } = await createTestData(app)

      createdBlog = blog
      createdPost = post
    })

    it('Should not create a post if blog does not exist', async () => {
      await postHelper.create({
        data: { blogId: '691fe02e62d2354296c74851' },
        status: HttpStatus.NotFound,
      })
    })

    it('Should not create a post if blogId is not passed in req.body', async () => {
      await postHelper.create({
        data: { blogId: undefined },
        status: HttpStatus.BadRequest,
      })
    })

    it('Should not create a post without auth header', async () => {
      await postHelper.create({
        token: '',
        // data: testPostData,
        status: HttpStatus.Unauthorized,
      })
    })

    it('Should not create a post with incorrect auth token', async () => {
      await postHelper.create({
        token: 'Basic sfsdfsdsdfsdsf',
        // data: testPostData,
        status: HttpStatus.Unauthorized,
      })
    })

    it('Should not create a post if body is incorrect', async () => {
      await postHelper.create({
        data: { ...createdPost, title: '         ' },
        status: HttpStatus.BadRequest,
      })
    })
  })

  // GET ALL
  describe('GET ALL endpoint; GET --> /posts', () => {
    beforeAll(async () => {
      await createTestData(app)
    })
    afterAll(async () => {
      await clearDb(app)
    })

    it('Should get all posts', async () => {
      const getAllPostsRes = await postHelper.getAll({})

      expect(getAllPostsRes.body.items).toBeInstanceOf(Array)
      expect(getAllPostsRes.body.items.length).toBe(1)
    })
  })

  // GET ONE
  describe('GET ONE endpoint; GET --> /posts/:id', () => {
    let createdPost: PostOutput

    beforeAll(async () => {
      const { post } = await createTestData(app)
      createdPost = post
    })
    afterAll(async () => {
      await clearDb(app)
    })

    it('Should get one post', async () => {
      const getCreatedPostRes = await postHelper.getOne({
        id: createdPost.id,
      })
      expect(getCreatedPostRes.body.id).toBe(createdPost.id)
    })
  })

  // UPDATE
  describe('UPDATE endpoint; PUT --> /posts/:id', () => {
    let createdPost: PostOutput

    beforeAll(async () => {
      const { post } = await createTestData(app)
      createdPost = post
    })
    afterAll(async () => {
      await clearDb(app)
    })

    it('Should update a post', async () => {
      await postHelper.update({
        id: createdPost.id,
        data: { ...createdPost, title: 'Test title 2' },
      })

      const updatedPostRes = await postHelper.getOne({
        id: createdPost.id,
      })
      expect(updatedPostRes.body.title).toBe('Test title 2')
    })

    it('Should not update a not found post', async () => {
      await postHelper.update({
        id: '691fe02e62d2354296c74851',
        data: { ...createdPost, title: 'Test title 3' },
        status: HttpStatus.NotFound,
      })
    })

    it('Should not update a post if given blogId is different from post.blogId', async () => {
      const otherBlogRes = await blogsTestManager(app).create({})

      const res = await postHelper.update({
        id: createdPost.id,
        data: {
          ...createdPost,
          title: 'Test title 4',
          blogId: otherBlogRes.body.id,
        },
        status: HttpStatus.BadRequest,
      })
      expect(res.body.message).toBe(Messages.post.blogNotCorrespondPost)
    })
  })

  // DELETE
  describe('DELETE endpoint; DELETE --> /posts/:id', () => {
    let createdPost: PostOutput

    beforeAll(async () => {
      const { post } = await createTestData(app)
      createdPost = post
    })
    afterAll(async () => {
      await clearDb(app)
    })

    it('Should delete a post', async () => {
      const postsResBefore = await postHelper.getAll({})
      expect(postsResBefore.body.items.length).toBe(1)

      await postHelper.getOne({
        id: createdPost.id,
      })

      await postHelper.delete({
        id: createdPost.id,
      })

      await postHelper.getOne({
        id: createdPost.id,
        status: HttpStatus.NotFound,
      })

      const postsResAfter = await postHelper.getAll({})
      expect(postsResAfter.body.items.length).toBe(0)
    })

    it('Should not delete a not found post', async () => {
      await postHelper.delete({
        id: '691fe02e62d2354296c74851',
        status: HttpStatus.NotFound,
      })
    })
  })

  // CREATE A COMMENT BY POST ID
  describe('CREATE COMMENT endpoint; POST --> /posts/:postId/comments', () => {
    let createdPost: PostOutput
    let createdUser: UserOutput
    let accessToken: string

    beforeAll(async () => {
      const { post, user, userAccessToken } = await createTestData(app)
      createdPost = post
      createdUser = user
      accessToken = userAccessToken
    })
    afterAll(async () => {
      await clearDb(app)
    })

    it('Should create a comment by post id', async () => {
      await postHelper.createComment({
        token: accessToken,
        postId: createdPost.id,
      })
    })

    it('Should throw error if comment content less than 20 chars', async () => {
      await postHelper.createComment({
        token: accessToken,
        postId: createdPost.id,
        data: { content: 'adasd' },
        status: HttpStatus.BadRequest
      })
    })
  })

  // GET ALL COMMENTS BY POST ID
  describe('GET ALL COMMENTS endpoint; GET --> /posts/:postId/comments', () => {
    let createdPost: PostOutput
    let accessToken: string

    beforeAll(async () => {
      const { post, userAccessToken } = await createTestData(app)
      createdPost = post
      accessToken = userAccessToken
    })
    afterAll(async () => {
      await clearDb(app)
    })

    it('Should find all comments by post id', async () => {
      const allCommentsBeforeRes = await postHelper.getAllComments({ postId: createdPost.id })
      expect(allCommentsBeforeRes.body.items).toHaveLength(1)

      await postHelper.createComment({
        token: accessToken,
        postId: createdPost.id,
        data: { content: 'adasdasdasdasdasdassdsdasd' }
      })

      const allCommentsAfterRes = await postHelper.getAllComments({ postId: createdPost.id })
      expect(allCommentsAfterRes.body.items).toHaveLength(2)
    })
  })
})
