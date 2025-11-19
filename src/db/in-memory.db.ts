import { Blog } from '../blogs/types/blog'
import { Post } from '../posts/types/post'

type DB = {
  blogs: Blog[]
  posts: Post[]
}

export const db: DB = {
  blogs: [],
  posts: [],
}
