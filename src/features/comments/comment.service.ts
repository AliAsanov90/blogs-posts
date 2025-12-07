import { Messages } from '../../common/constants/messages'
import { ForbiddenError, NotFoundError } from '../../common/types/errors.types'
import { commentRepository } from './repository/comment.repository'
import { CommentInput, CommentType } from './types/comment.types'

class CommentService {
  public async update(commentId: string, { content }: CommentInput, userId: string) {
    const comment = await this._checkUserIsAuthorized(userId, commentId, 'forbiddenUpdate')

    const updatedComment = {
      ...comment,
      content,
    } satisfies CommentType

    return await commentRepository.update(commentId, updatedComment)
  }

  public async delete(commentId: string, userId: string) {
    await this._checkUserIsAuthorized(userId, commentId, 'forbiddenDelete')
    return await commentRepository.delete(commentId)
  }

  private async _checkUserIsAuthorized(
    userId: string,
    commentId: string,
    message: 'forbiddenUpdate' | 'forbiddenDelete',
  ) {
    const comment = await this._getExistingCommentOrThrow(commentId)

    if (userId !== comment.commentatorInfo.userId) {
      throw new ForbiddenError(Messages.comment[message])
    }
    return comment
  }

  private async _getExistingCommentOrThrow(id: string) {
    const comment = await commentRepository.findById(id)

    if (!comment) {
      throw new NotFoundError(Messages.comment.notFound)
    }
    return comment
  }
}

export const commentService = new CommentService()
