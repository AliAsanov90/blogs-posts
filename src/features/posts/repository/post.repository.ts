import { ObjectId, WithId } from 'mongodb'
import { postsCollection } from '../../../db/mongo.db'
import { Post } from '../types/post.types'

class PostRepository {
  public async getAll(): Promise<WithId<Post>[]> {
    return postsCollection.find().toArray()
  }

  public async getOne(id: string): Promise<WithId<Post> | null> {
    return postsCollection.findOne({ _id: new ObjectId(id) })
  }

  public async create(post: Post): Promise<WithId<Post>> {
    const { insertedId } = await postsCollection.insertOne(post)
    return { ...post, _id: insertedId }
  }

  public async update(id: string, post: Post): Promise<boolean> {
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
        },
      },
    )
    return !!matchedCount
  }

  public async delete(id: string): Promise<boolean> {
    const { deletedCount } = await postsCollection.deleteOne({
      _id: new ObjectId(id),
    })
    return !!deletedCount
  }
}

export const postRepository = new PostRepository()
