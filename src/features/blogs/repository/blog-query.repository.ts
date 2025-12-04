import { Filter, ObjectId, WithId } from 'mongodb'
import { QueryResult } from '../../../common/types/query-result-output.types'
import { blogsCollection } from '../../../db/mongo.db'
import { Blog, BlogQueryInput } from '../types/blog.types'

class BlogQueryRepository {
  public async findMany(
    queryInput: BlogQueryInput,
  ): Promise<QueryResult<Blog>> {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      queryInput

    const skip = (pageNumber - 1) * pageSize
    const filter: Filter<Blog> = {}

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' }
    }

    const items = await blogsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray()

    const totalCount = await blogsCollection.countDocuments(filter)

    return { items, totalCount }
  }

  public async findById(id: string): Promise<WithId<Blog> | null> {
    return blogsCollection.findOne({ _id: new ObjectId(id) })
  }
}

export const blogQueryRepository = new BlogQueryRepository()
