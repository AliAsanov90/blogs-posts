import {
  defaultSortPaginationValues,
  PaginationAndSorting,
} from '../middleware/query-validation.middleware'

export const setDefaultSortAndPagination = <S = string>(
  query: Partial<PaginationAndSorting<S>>,
): PaginationAndSorting<S> => ({
  ...defaultSortPaginationValues,
  ...query,
  sortBy: (query.sortBy ?? defaultSortPaginationValues.sortBy) as S,
})
