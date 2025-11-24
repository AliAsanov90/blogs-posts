import { BlogViewModel } from '../features/blogs/types/blog'

type DB = {
  blogs: BlogViewModel[]
  posts: BlogViewModel[]
}

export const db: DB = {
  blogs: [],
  posts: [],
}
