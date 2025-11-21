import { ObjectId, WithId } from 'mongodb'
import { blogsCollection } from '../../db/mongo.db'
import { Blog } from '../types/blog'


const getAll = async (): Promise<WithId<Blog>[]> => {
  return blogsCollection.find().toArray()
}

const getOne = async (id: string): Promise<WithId<Blog> | null> => {
  return blogsCollection.findOne({ _id: new ObjectId(id) })
}

const create = async (blog: Blog): Promise<WithId<Blog>> => {
  const { insertedId } = await blogsCollection.insertOne(blog)
  return { ...blog, _id: insertedId }
}

const update = async (id: string, blog: Blog): Promise<void> => {
  const { matchedCount } = await blogsCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
      }
    }
  )

  if (matchedCount < 1) {
    throw new Error('Blog does not exist')
  }
}

const deleteOne = async (id: string): Promise<void> => {
  const { deletedCount } = await blogsCollection.deleteOne({ _id: new ObjectId(id) })

  if (deletedCount < 1) {
    throw new Error('Blog does not exist')
  }
}

export const blogRepository = {
  getAll,
  getOne,
  create,
  update,
  deleteOne,
}
