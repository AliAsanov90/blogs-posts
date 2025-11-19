import { PostInput } from '../types/post'

export const postInputDto = (requestBody: PostInput): PostInput => ({
  title: requestBody.title,
  shortDescription: requestBody.shortDescription,
  content: requestBody.content,
  blogId: requestBody.blogId,
})
