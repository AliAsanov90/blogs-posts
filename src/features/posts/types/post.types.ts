import { PaginationAndSorting } from '../../../common/middleware/query-validation.middleware'

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
  BlogName = 'blogName',
}

export type PostQueryInput = PaginationAndSorting<PostSortByFields>
