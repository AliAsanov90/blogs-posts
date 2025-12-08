import { HttpStatus } from '../../../src/common/types/http-statuses.types'
import { closeDb, runDb } from '../../../src/db/mongo.db'
import { CommentOutput } from '../../../src/features/comments/types/comment.types'
import { UserOutput } from '../../../src/features/users/types/user.types'
import { setupApp } from '../../../src/setupApp'
import { commentsTestManager } from '../../utils/comments.util'
import { clearDb, createTestData } from '../../utils/test-helpers.util'

describe('Comments API', () => {
  const app = setupApp()
  const commentHelper = commentsTestManager(app)

  beforeAll(async () => {
    await runDb()
  })

  afterAll(async () => {
    await closeDb()
  })

  // GET ONE
  describe('GET ONE endpoint; GET -> /comments/:id', () => {
    let createdComment: CommentOutput
    let createdUser: UserOutput

    beforeAll(async () => {
      const { user, comment } = await createTestData(app)
      createdUser = user
      createdComment = comment
    })
    afterAll(async () => {
      await clearDb(app)
    })

    it('Should return comment by id', async () => {
      const commentRes = await commentHelper.getOne({ id: createdComment.id })
      const receivedComment: CommentOutput = commentRes.body

      expect(commentRes.body.content).toBe(createdComment.content)
      expect(receivedComment.commentatorInfo.userId).toBe(createdUser.id)
    })

    it('Should throw "NotFound" if comment not existing', async () => {
      await commentHelper.getOne({
        id: '692f5c9b8322691d748b0b82', // must be valid MongoId
        status: HttpStatus.NotFound
      })
    })

    it('Should throw "BadRequest" if commentId not valid MongoId', async () => {
      await commentHelper.getOne({
        id: '692f5c9b8322691d748b0b8',
        status: HttpStatus.BadRequest
      })
    })
  })

  // UPDATE
  describe('UPDATE endpoint; PUT -> /comments/:commentId', () => {
    let createdComment: CommentOutput
    let accessToken: string

    beforeAll(async () => {
      const { user, comment, userAccessToken } = await createTestData(app)
      createdComment = comment
      accessToken = userAccessToken
    })
    afterAll(async () => {
      await clearDb(app)
    })

    it('Should update a comment', async () => {
      await commentHelper.update({
        token: accessToken,
        commentId: createdComment.id,
      })
    })
  })

  // DELETE
  describe('DELETE endpoint; DELETE -> /comments/:commentId', () => {
    let createdComment: CommentOutput
    let createdUser: UserOutput
    let accessToken: string

    beforeAll(async () => {
      const { user, comment, userAccessToken } = await createTestData(app)
      createdUser = user
      createdComment = comment
      accessToken = userAccessToken
    })
    afterAll(async () => {
      await clearDb(app)
    })

    it('Should delete a comment', async () => {
      await commentHelper.delete({
        token: accessToken,
        commentId: createdComment.id
      })
      await commentHelper.getOne({
        id: createdComment.id,
        status: HttpStatus.NotFound
      })
    })

    it('Should throw "NotFound" when attempting to delete not existing comment', async () => {
      await commentHelper.delete({
        token: accessToken,
        commentId: '692f5c9b8322691d748b0b82', // must be valid MongoId
        status: HttpStatus.NotFound
      })
    })

    it('Should throw "Forbidden" if comment not yours', async () => {
      const otherUserData = {
        login: 'some-user',
        email: 'someuseremail@gmail.com'
      }
      const { comment } = await createTestData(app, otherUserData)

      await commentHelper.delete({
        token: accessToken, // first user's token
        commentId: comment.id, // second user's comment
        status: HttpStatus.Forbidden
      })
    })
  })
})
