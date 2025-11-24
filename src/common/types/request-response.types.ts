import { Request } from 'express'
import { BlogInput } from '../../features/blogs/types/blog.types'
import { PostInput } from '../../features/posts/types/post.types'

export type RequestWithId = Request<{ id: string }>

export type RequestWithPostInput = Request<unknown, unknown, PostInput>

export type RequestWithIdAndPostInput = Request<
  { id: string },
  unknown,
  PostInput
>

export type RequestWithBlogInput = Request<unknown, unknown, BlogInput>

export type RequestWithIdAndBlogInput = Request<
  { id: string },
  unknown,
  BlogInput
>
