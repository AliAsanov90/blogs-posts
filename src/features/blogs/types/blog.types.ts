import { PaginationAndSorting } from '../../../common/middleware/query-validation.middleware'
import { Meta } from '../../../common/types/query-result-output.types'

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

export type SearchQueryFields = Partial<{
  searchNameTerm: string
}>

export type BlogQueryInput = PaginationAndSorting<BlogSortByFields> &
  SearchQueryFields

export type BlogsPaginatedOutput = Meta & {
  items: BlogOutput[]
}
