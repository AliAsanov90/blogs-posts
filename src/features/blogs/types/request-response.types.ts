import { Request } from 'express'
import { BlogInput } from './blog.types'

export type RequestWithParams = Request<{ id: string }>

export type RequestWithBody = Request<unknown, unknown, BlogInput>

export type RequestWithParamsAndBody = Request<
  { id: string },
  unknown,
  BlogInput
>
