import { ObjectId, WithId } from 'mongodb'
import { postsCollection } from '../../db/mongo.db'
import { Post } from '../types/post'

const getAll = async (): Promise<WithId<Post>[]> => {
  return postsCollection.find().toArray()
}

const getOne = async (id: string): Promise<WithId<Post> | null> => {
  return postsCollection.findOne({ _id: new ObjectId(id) })
}

const create = async (post: Post): Promise<WithId<Post>> => {
  const { insertedId } = await postsCollection.insertOne(post)
  return { ...post, _id: insertedId }
}

const update = async (id: string, post: Post): Promise<void> => {
  const { matchedCount } = await postsCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogName: post.blogName,
        blogId: post.blogId,
        createdAt: post.createdAt,
      }
    }
  )

  if (matchedCount < 1) {
    throw new Error('Post does not exist')
  }
}

const deleteOne = async (id: string): Promise<void> => {
  const { deletedCount } = await postsCollection.deleteOne({ _id: new ObjectId(id) })

  if (deletedCount < 1) {
    throw new Error('Post does not exist')
  }
}

export const postRepository = {
  getAll,
  getOne,
  create,
  update,
  deleteOne,
}
