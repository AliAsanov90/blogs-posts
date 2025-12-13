import { Request } from 'express'
import { BlogSearchQueryFields } from '../../features/blogs/types/blog.types'
import { UserSearchQueryFields } from '../../features/users/types/user.types'
import { PaginationAndSorting } from '../middleware/query-validation.middleware'

// Id params
type IdParam = 'id' | 'postId' | 'blogId' | 'commentId'

// Query search fields
export const SearchQueryFields = {
  ...BlogSearchQueryFields,
  ...UserSearchQueryFields,
} as const

export type TSearchQueryFieldKeys = keyof typeof SearchQueryFields

// Request with id param
export type RequestWithId<TParamKey extends IdParam = 'id'> = Request<{ [K in TParamKey]: string }>

// Request with id param and body
export type RequestWithIdAndBody<TBody, TParamKey extends IdParam = 'id'> = Request<
  { [K in TParamKey]: string },
  unknown,
  TBody
>

// Request with id param and query
export type RequestWithIdAndQuery<TSortByFields, TParamKey extends IdParam = 'id'> = Request<
  { [K in TParamKey]: string },
  unknown,
  unknown,
  PaginationAndSorting<TSortByFields>
> & {
  sanitizedQuery: PaginationAndSorting<TSortByFields>
}

// Request with query
export type RequestWithQuery<TSortByFields, TSearchQueryFields = never> = Request<
  unknown,
  unknown,
  unknown,
  PaginationAndSorting<TSortByFields> & TSearchQueryFields
> & {
  sanitizedQuery: PaginationAndSorting<TSortByFields> & TSearchQueryFields
}

export type RequestWithSanitizedQuery = Request & {
  sanitizedQuery?: Record<string, unknown>
}

// Request with body
export type RequestWithBody<TBody> = Request<unknown, unknown, TBody>
