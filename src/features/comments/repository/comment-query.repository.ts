import { Filter, ObjectId } from 'mongodb'
import { PaginatedOutput } from '../../../common/types/query-result-output.types'
import { commentsCollection } from '../../../db/mongo.db'
import { CommentOutput, CommentQueryInput, CommentType } from '../types/comment.types'
import { mapToCommentOutput, mapToCommentsPaginatedOutput } from '../utils/comment-output.mapper'

class CommentQueryRepository {
  public async findMany(
    query: CommentQueryInput,
    postId?: string,
  ): Promise<PaginatedOutput<CommentOutput>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query

    const skip = (pageNumber - 1) * pageSize
    const filter: Filter<CommentType> = {}

    if (postId) {
      filter.postId = postId
    }

    const items = await commentsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray()

    const totalCount = await commentsCollection.countDocuments(filter)

    return mapToCommentsPaginatedOutput(items, totalCount, query)
  }

  public async findManyByPostId(
    query: CommentQueryInput,
    postId: string,
  ): Promise<PaginatedOutput<CommentOutput>> {
    return await this.findMany(query, postId)
  }

  public async findById(id: string): Promise<CommentOutput | null> {
    const comment = await commentsCollection.findOne({ _id: new ObjectId(id) })
    return comment ? mapToCommentOutput(comment) : null
  }
}

export const commentQueryRepository = new CommentQueryRepository()
