import { BlogOutput } from '../features/blogs/types/blog.types'

type DB = {
  blogs: BlogOutput[]
  posts: BlogOutput[]
}

export const db: DB = {
  blogs: [],
  posts: [],
}
