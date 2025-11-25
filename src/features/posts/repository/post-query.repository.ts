import { Filter } from 'mongodb'
import { QueryResult } from '../../../common/types/query-result-output.types'
import { postsCollection } from '../../../db/mongo.db'
import { Post, PostQueryInput } from '../types/post.types'

class PostQueryRepository {
  public async findMany(query: PostQueryInput): Promise<QueryResult<Post>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query

    const skip = (pageNumber - 1) * pageSize
    const filter: Filter<Post> = {}

    const items = await postsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray()

    const totalCount = await postsCollection.countDocuments(filter)

    return { items, totalCount }
  }
}

export const postQueryRepository = new PostQueryRepository()
