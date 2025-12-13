import { WithId } from 'mongodb'
import { PaginationAndSorting } from '../../../common/middleware/query-validation.middleware'
import { PaginatedOutput } from '../../../common/types/query-result-output.types'
import { User, UserMeOutput, UserOutput, UserSortByFields } from '../types/user.types'

export function mapToMeUser({ _id, login, email }: WithId<User>): UserMeOutput {
  return {
    email,
    login,
    userId: _id.toString(),
  }
}

export function mapToUserOutput({ _id, login, email, createdAt }: WithId<User>): UserOutput {
  return {
    id: _id.toString(),
    login,
    email,
    createdAt,
  }
}

export function mapToUsersPaginatedOutput(
  items: WithId<User>[],
  totalCount: number,
  { pageNumber, pageSize }: PaginationAndSorting<UserSortByFields>,
): PaginatedOutput<UserOutput> {
  return {
    pagesCount: Math.ceil(totalCount / pageSize),
    page: pageNumber,
    pageSize,
    totalCount,
    items: items.map(mapToUserOutput),
  }
}
