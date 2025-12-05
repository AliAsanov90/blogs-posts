import { Request } from 'express'
import { BlogSearchQueryFields } from '../../features/blogs/types/blog.types'
import { UserSearchQueryFields } from '../../features/users/types/user.types'
import { PaginationAndSorting } from '../middleware/query-validation.middleware'

export type RequestWithId = Request<{ id: string }>

export type RequestWithSanitizedQuery = Request & {
  sanitizedQuery?: Record<string, unknown>
}

export type RequestWithQuery<TSortByFields, TSearchQueryFields = never> = Request<
  unknown,
  unknown,
  unknown,
  PaginationAndSorting<TSortByFields> & TSearchQueryFields
> & {
  sanitizedQuery: PaginationAndSorting<TSortByFields> & TSearchQueryFields
}

export const SearchQueryFields = {
  ...BlogSearchQueryFields,
  ...UserSearchQueryFields,
} as const

export type TSearchQueryFieldKeys = keyof typeof SearchQueryFields

export type RequestWithBody<TBody> = Request<unknown, unknown, TBody>

export type RequestWithIdAndBody<TBody> = Request<{ id: string }, unknown, TBody>

export type RequestWithBlogIdAndQuery<TSortByFields> = Request<
  { blogId: string },
  unknown,
  unknown,
  PaginationAndSorting<TSortByFields>
> & {
  sanitizedQuery: PaginationAndSorting<TSortByFields>
}

export type RequestWithBlogIdAndBody<TBody> = Request<{ blogId: string }, unknown, TBody>
