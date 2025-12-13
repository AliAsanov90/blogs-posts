import { BlogInput } from '../types/blog.types'

export const getBlogInputFields = ({ name, description, websiteUrl }: BlogInput): BlogInput => ({
  name,
  description,
  websiteUrl,
})
