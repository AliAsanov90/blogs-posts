import { PostInput } from '../types/post'

export const postInputDto = (requestBody: PostInput): PostInput => {
  const { title, shortDescription, content, blogId } = requestBody

  return {
    title,
    shortDescription,
    content,
    blogId,
  }
}
