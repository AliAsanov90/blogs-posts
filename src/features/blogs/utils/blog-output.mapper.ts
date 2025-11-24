import { WithId } from 'mongodb'
import { Blog, BlogViewModel } from '../types/blog.types'

export function mapToBlogOutput(blog: WithId<Blog>): BlogViewModel {
  const { _id, name, description, websiteUrl, isMembership, createdAt } = blog

  return {
    id: _id.toString(),
    name,
    description,
    websiteUrl,
    isMembership,
    createdAt,
  }
}
