import { WithId } from 'mongodb'
import { PaginationAndSorting } from '../../../common/middleware/query-validation.middleware'
import { PaginatedOutput } from '../../../common/types/query-result-output.types'
import { User, UserOutput, UserSortByFields } from '../types/user.types'

export function mapToUserOutput({
  _id,
  login,
  email,
  createdAt,
}: WithId<User>): UserOutput {
  return {
    id: _id.toString(),
    login,
    email,
    createdAt,
  }
}

export const mapToUsersPaginatedOutput = (
  items: WithId<User>[],
  totalCount: number,
  { pageNumber, pageSize }: PaginationAndSorting<UserSortByFields>,
): PaginatedOutput<UserOutput> => {
  return {
    pagesCount: Math.ceil(totalCount / pageSize),
    page: pageNumber,
    pageSize,
    totalCount,
    items: items.map(mapToUserOutput),
  }
}
