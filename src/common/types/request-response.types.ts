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

export type RequestWithId = Request<{ id: string }>

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
>

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
>
