import { ObjectId, WithId } from 'mongodb'
import { blogsCollection } from '../../../db/mongo.db'
import { Blog } from '../types/blog.types'

class BlogRepository {
  public async getOne(id: string): Promise<WithId<Blog> | null> {
    return blogsCollection.findOne({ _id: new ObjectId(id) })
  }

  public async create(blog: Blog): Promise<WithId<Blog>> {
    const { insertedId } = await blogsCollection.insertOne(blog)
    return { ...blog, _id: insertedId }
  }

  public async update(id: string, blog: Blog): Promise<boolean> {
    const { matchedCount } = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: blog.name,
          description: blog.description,
          websiteUrl: blog.websiteUrl,
        },
      },
    )
    return !!matchedCount
  }

  public async delete(id: string): Promise<boolean> {
    const { deletedCount } = await blogsCollection.deleteOne({
      _id: new ObjectId(id),
    })
    return !!deletedCount
  }
}

export const blogRepository = new BlogRepository()
