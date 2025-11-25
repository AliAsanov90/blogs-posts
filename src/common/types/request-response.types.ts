import { Request } from 'express'
import {
  BlogInput,
  BlogSortByFields,
  SearchQueryFields,
} from '../../features/blogs/types/blog.types'
import {
  PostInput,
  PostSortByFields,
} from '../../features/posts/types/post.types'
import { PaginationAndSorting } from '../middleware/query-validation.middleware'

// COMMON types

export type RequestWithId = Request<{ id: string }>
export type RequestWithSanitizedQuery = Request & {
  sanitizedQuery?: Record<string, unknown>
}

// POST types

export type RequestWithPostInput = Request<unknown, unknown, PostInput>

export type RequestWithIdAndPostInput = Request<
  { id: string },
  unknown,
  PostInput
>

export type RequestWithPostQuery = Request<
  unknown,
  unknown,
  unknown,
  PaginationAndSorting<PostSortByFields>
> & {
  sanitizedQuery: PaginationAndSorting<PostSortByFields>
}

// BLOG types

export type RequestWithBlogInput = Request<unknown, unknown, BlogInput>

export type RequestWithIdAndBlogInput = Request<
  { id: string },
  unknown,
  BlogInput
>

export type RequestWithBlogQuery = Request<
  unknown,
  unknown,
  unknown,
  PaginationAndSorting<BlogSortByFields> & SearchQueryFields
> & {
  sanitizedQuery: PaginationAndSorting<BlogSortByFields> & SearchQueryFields
}

export type RequestWithBlogIdAndPostQuery = Request<
  { blogId: string },
  unknown,
  unknown,
  PaginationAndSorting<PostSortByFields>
> & {
  sanitizedQuery: PaginationAndSorting<PostSortByFields>
}

export type RequestWithBlogIdAndPostInput = Request<
  { blogId: string },
  unknown,
  Omit<PostInput, 'blogId'>
>
