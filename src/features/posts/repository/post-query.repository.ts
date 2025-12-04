import { Filter, ObjectId, WithId } from 'mongodb'
import { QueryResult } from '../../../common/types/query-result-output.types'
import { postsCollection } from '../../../db/mongo.db'
import { Post, PostQueryInput } from '../types/post.types'

class PostQueryRepository {
  public async findMany(
    query: PostQueryInput,
    blogId?: string,
  ): Promise<QueryResult<Post>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query

    const skip = (pageNumber - 1) * pageSize
    const filter: Filter<Post> = {}

    if (blogId) {
      filter.blogId = blogId
    }

    const items = await postsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray()

    const totalCount = await postsCollection.countDocuments(filter)

    return { items, totalCount }
  }

  public async findManyByBlogId(
    query: PostQueryInput,
    blogId: string,
  ): Promise<QueryResult<Post>> {
    return await this.findMany(query, blogId)
  }

  public async findById(id: string): Promise<WithId<Post> | null> {
    return postsCollection.findOne({ _id: new ObjectId(id) })
  }
}

export const postQueryRepository = new PostQueryRepository()
