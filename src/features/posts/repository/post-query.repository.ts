import { Filter, ObjectId } from 'mongodb'
import { PaginatedOutput } from '../../../common/types/query-result-output.types'
import { postsCollection } from '../../../db/mongo.db'
import { Post, PostOutput, PostQueryInput } from '../types/post.types'
import { mapToPostOutput, mapToPostsPaginatedOutput } from '../utils/post-output.mapper'

class PostQueryRepository {
  public async findMany(
    query: PostQueryInput,
    blogId?: string,
  ): Promise<PaginatedOutput<PostOutput>> {
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

    return mapToPostsPaginatedOutput(items, totalCount, query)
  }

  public async findManyByBlogId(
    query: PostQueryInput,
    blogId: string,
  ): Promise<PaginatedOutput<PostOutput>> {
    return await this.findMany(query, blogId)
  }

  public async findById(id: string): Promise<PostOutput | null> {
    const post = await postsCollection.findOne({ _id: new ObjectId(id) })
    return post ? mapToPostOutput(post) : null
  }
}

export const postQueryRepository = new PostQueryRepository()
