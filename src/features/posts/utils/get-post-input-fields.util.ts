import { PostInput } from '../types/post.types'

export const getPostInputFields = ({
  title,
  shortDescription,
  content,
  blogId,
}: PostInput): PostInput => {
  return {
    title,
    shortDescription,
    content,
    blogId,
  }
}
