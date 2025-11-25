import { WithId } from 'mongodb'
import { postsCollection } from '../../../db/mongo.db'
import { Post } from '../types/post.types'

class PostRepository {
  public async getAll(): Promise<WithId<Post>[]> {
    return postsCollection.find().toArray()
  }
}

export const postRepository = new PostRepository()
