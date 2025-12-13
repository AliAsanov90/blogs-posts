import { Filter, ObjectId } from 'mongodb'
import { PaginatedOutput } from '../../../common/types/query-result-output.types'
import { blogsCollection } from '../../../db/mongo.db'
import { Blog, BlogOutput, BlogQueryInput } from '../types/blog.types'
import { mapToBlogOutput, mapToBlogsPaginatedOutput } from '../utils/blog-output.mapper'

class BlogQueryRepository {
  public async findMany(queryInput: BlogQueryInput): Promise<PaginatedOutput<BlogOutput>> {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = queryInput

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

    return mapToBlogsPaginatedOutput(items, totalCount, queryInput)
  }

  public async findById(id: string): Promise<BlogOutput | null> {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) })
    return blog ? mapToBlogOutput(blog) : null
  }
}

export const blogQueryRepository = new BlogQueryRepository()
