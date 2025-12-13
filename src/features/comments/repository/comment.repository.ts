import { ObjectId } from 'mongodb'
import { commentsCollection } from '../../../db/mongo.db'
import { CommentType } from '../types/comment.types'

class CommentRepository {
  public async create(comment: CommentType): Promise<string> {
    const { insertedId } = await commentsCollection.insertOne(comment)
    return insertedId.toString()
  }

  public async update(id: string, comment: CommentType): Promise<boolean> {
    const { matchedCount } = await commentsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          content: comment.content,
          commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin,
          },
          postId: comment.postId,
          createdAt: comment.createdAt,
        },
      },
    )
    return !!matchedCount
  }

  public async delete(id: string): Promise<boolean> {
    const { deletedCount } = await commentsCollection.deleteOne({
      _id: new ObjectId(id),
    })
    return !!deletedCount
  }

  public async findById(id: string): Promise<CommentType | null> {
    return await commentsCollection.findOne({ _id: new ObjectId(id) })
  }
}

export const commentRepository = new CommentRepository()
