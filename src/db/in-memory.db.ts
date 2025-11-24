import { BlogViewModel } from '../features/blogs/types/blog.types'

type DB = {
  blogs: BlogViewModel[]
  posts: BlogViewModel[]
}

export const db: DB = {
  blogs: [],
  posts: [],
}
