import { WithId } from 'mongodb'
import { PaginationAndSorting } from '../../../common/middleware/query-validation.middleware'
import { PaginatedOutput } from '../../../common/types/query-result-output.types'
import { Blog, BlogOutput, BlogSortByFields } from '../types/blog.types'

export function mapToBlogOutput({
  _id,
  name,
  description,
  websiteUrl,
  isMembership,
  createdAt,
}: WithId<Blog>): BlogOutput {
  return {
    id: _id.toString(),
    name,
    description,
    websiteUrl,
    isMembership,
    createdAt,
  }
}

export const mapToBlogsPaginatedOutput = (
  items: WithId<Blog>[],
  totalCount: number,
  { pageNumber, pageSize }: PaginationAndSorting<BlogSortByFields>,
): PaginatedOutput<BlogOutput> => {
  return {
    pagesCount: Math.ceil(totalCount / pageSize),
    page: pageNumber,
    pageSize,
    totalCount,
    items: items.map(mapToBlogOutput),
  }
}
