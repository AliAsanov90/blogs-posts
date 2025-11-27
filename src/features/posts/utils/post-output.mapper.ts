import { WithId } from 'mongodb'
import { PaginationAndSorting } from '../../../common/middleware/query-validation.middleware'
import { PaginatedOutput } from '../../../common/types/query-result-output.types'
import { Post, PostOutput, PostSortByFields } from '../types/post.types'

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
): PaginatedOutput<PostOutput> => {
  return {
    pagesCount: Math.ceil(totalCount / pageSize),
    page: pageNumber,
    pageSize,
    totalCount,
    items: items.map(mapToPostOutput),
  }
}
