import { BlogInput } from '../types/blog'

export const blogInputDto = (requestBody: BlogInput): BlogInput => ({
  name: requestBody.name,
  description: requestBody.description,
  websiteUrl: requestBody.websiteUrl,
})
