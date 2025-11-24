import { WithId } from 'mongodb'
import { Post, PostViewModel } from '../types/post.types'

export function mapToPostOutput(post: WithId<Post>): PostViewModel {
  const { _id, title, shortDescription, content, blogId, blogName, createdAt } =
    post

  return {
    id: _id.toString(),
    title,
    shortDescription,
    content,
    blogId,
    blogName,
    createdAt,
  }
}
