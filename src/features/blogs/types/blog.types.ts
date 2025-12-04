import { PaginationAndSorting } from '../../../common/middleware/query-validation.middleware'

export type BlogInput = {
  name: string
  description: string
  websiteUrl: string
}

export type Blog = BlogInput & {
  createdAt: Date
  isMembership: boolean
}

export type BlogOutput = Blog & {
  id: string
}

export enum BlogSortByFields {
  CreatedAt = 'createdAt',
  Name = 'name',
}

export enum BlogSearchQueryFields {
  searchNameTerm = 'searchNameTerm',
}

export type BlogQueryInput = PaginationAndSorting<BlogSortByFields> & {
  searchNameTerm?: string
}
