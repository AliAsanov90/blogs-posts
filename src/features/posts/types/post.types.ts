import { PaginationAndSorting } from '../../../common/middleware/query-validation.middleware'
import { Meta } from '../../../common/types/query-result-output.types'

export type PostInput = {
  title: string
  shortDescription: string
  content: string
  blogId: string
}

export type Post = PostInput & {
  blogName: string
  createdAt: Date
}

export type PostOutput = Post & {
  id: string
}

export enum PostSortByFields {
  CreatedAt = 'createdAt',
  Title = 'title',
}

export type PostQueryInput = PaginationAndSorting<PostSortByFields>

export type PostsPaginatedOutput = Meta & {
  items: PostOutput[]
}
