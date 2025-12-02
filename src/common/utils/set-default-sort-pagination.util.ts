import {
  defaultSortPaginationValues,
  PaginationAndSorting,
} from '../middleware/query-validation.middleware'

export const setDefaultSortAndPagination = <
  T extends PaginationAndSorting<T['sortBy']>,
>(
  query: Partial<T>,
) =>
  ({
    ...defaultSortPaginationValues,
    ...query,
    sortBy: (query.sortBy ?? defaultSortPaginationValues.sortBy) as T['sortBy'],
  }) as T
