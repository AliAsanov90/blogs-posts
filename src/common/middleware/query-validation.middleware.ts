import { query, ValidationChain } from 'express-validator'
import {
  SearchQueryFields,
  TSearchQueryFieldKeys,
} from '../types/request-response.types'

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type PaginationAndSorting<S> = {
  pageNumber: number
  pageSize: number
  sortBy: S
  sortDirection: SortDirection
}

const DEFAULT_SORT_BY = 'createdAt'
const DEFAULT_SORT_DIRECTION = SortDirection.Desc
const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_SIZE = 10

export const defaultSortPaginationValues: PaginationAndSorting<string> = {
  sortBy: DEFAULT_SORT_BY,
  sortDirection: DEFAULT_SORT_DIRECTION,
  pageNumber: DEFAULT_PAGE_NUMBER,
  pageSize: DEFAULT_PAGE_SIZE,
}

export const getQueryValidation = <T extends string>(
  sortFieldsEnum: Record<string, T>,
  searchFieldsEnum?: Partial<typeof SearchQueryFields>,
) => {
  const defaultSortBy = Object.values(sortFieldsEnum)[0]
  const allowedSortByFields = Object.values(sortFieldsEnum)
  const allowedSortDirection = Object.values(SortDirection)

  const searchNameTermValidation = query('searchNameTerm')
    .optional()
    .isString()
    .withMessage('Search name term must be a string')
    .trim()
    .notEmpty()
    .withMessage('Search name term must not be empty')
    .isLength({ max: 100 })
    .withMessage('Search name term must be maximum 100 characters')

  const searchLoginTermValidation = query('searchLoginTerm')
    .optional()
    .isString()
    .withMessage('Search login term must be a string')
    .trim()
    .notEmpty()
    .withMessage('Search login term must not be empty')
    .isLength({ max: 20 })
    .withMessage('Search login term must be maximum 20 characters')

  const searchEmailTermValidation = query('searchEmailTerm')
    .optional()
    .isString()
    .withMessage('Search email term must be a string')
    .trim()
    .notEmpty()
    .withMessage('Search email term must not be empty')
    .isLength({ max: 50 })
    .withMessage('Search email term must be maximum 50 characters')

  const sortByValidation = query('sortBy')
    .default(defaultSortBy)
    .isIn(allowedSortByFields)
    .withMessage(
      `Invalid sort field. Allowed values: ${allowedSortByFields.join(', ')}`,
    )

  const sortDirectionValidation = query('sortDirection')
    .default(DEFAULT_SORT_DIRECTION)
    .isIn(allowedSortDirection)
    .withMessage(
      `Invalid sort direction. Allowed values: ${allowedSortDirection.join(', ')}`,
    )

  const pageNumberValidation = query('pageNumber')
    .default(DEFAULT_PAGE_NUMBER)
    .isInt({ min: 1 })
    .withMessage('Page number must be a positive integer')
    .toInt()

  const pageSizeValidation = query('pageSize')
    .default(DEFAULT_PAGE_SIZE)
    .isInt({ min: 1, max: 100 })
    .withMessage('Page size must be between 1 and 100')
    .toInt()

  const validations = [
    sortByValidation,
    sortDirectionValidation,
    pageNumberValidation,
    pageSizeValidation,
  ]

  if (!searchFieldsEnum) return validations

  const searchFieldValidations: Record<TSearchQueryFieldKeys, ValidationChain> =
    {
      [SearchQueryFields.searchNameTerm]: searchNameTermValidation,
      [SearchQueryFields.searchLoginTerm]: searchLoginTermValidation,
      [SearchQueryFields.searchEmailTerm]: searchEmailTermValidation,
    }

  Object.keys(SearchQueryFields).forEach((searchField) => {
    if (searchField in searchFieldsEnum) {
      validations.push(
        searchFieldValidations[searchField as TSearchQueryFieldKeys],
      )
    }
  })

  return validations
}
