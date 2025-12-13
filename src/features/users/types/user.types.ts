import { PaginationAndSorting } from '../../../common/middleware/query-validation.middleware'

export type UserInput = {
  login: string
  password: string
  email: string
}

export type User = {
  login: string
  password: string
  email: string
  createdAt: Date
}

export type UserOutput = {
  id: string
  login: string
  email: string
  createdAt: Date
}

export type UserMeOutput = {
  email: string
  login: string
  userId: string
}

export enum UserSortByFields {
  CreatedAt = 'createdAt',
  Id = 'id',
  Login = 'login',
  Email = 'email',
}

export enum UserSearchQueryFields {
  searchLoginTerm = 'searchLoginTerm',
  searchEmailTerm = 'searchEmailTerm',
}

export type UserQueryInput = PaginationAndSorting<UserSortByFields> & {
  searchLoginTerm?: string
  searchEmailTerm?: string
}
