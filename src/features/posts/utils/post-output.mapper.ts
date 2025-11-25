import { WithId } from 'mongodb'
import { PaginationAndSorting } from '../../../common/middleware/query-validation.middleware'
import {
  Post,
  PostOutput,
  PostSortByFields,
  PostsPaginatedOutput,
} from '../types/post.types'

export function mapToPostOutput({
  _id,
  title,
  shortDescription,
  content,
  blogId,
  blogName,
  createdAt,
}: WithId<Post>): PostOutput {
  return {
    id: _id.toString(),
    title,
    shortDescription,
    content,
    blogId,
    blogName,
    createdAt,
  }
}

export const mapToPostsPaginatedOutput = (
  items: WithId<Post>[],
  totalCount: number,
  { pageNumber, pageSize }: PaginationAndSorting<PostSortByFields>,
): PostsPaginatedOutput => {
  return {
    pagesCount: Math.ceil(totalCount / pageSize),
    page: pageNumber,
    pageSize,
    totalCount,
    items: items.map(mapToPostOutput),
  }
}
