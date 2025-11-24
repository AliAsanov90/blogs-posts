import { WithId } from 'mongodb'

export type QueryResult<T> = { items: WithId<T>[]; totalCount: number }

export type Meta = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
}
