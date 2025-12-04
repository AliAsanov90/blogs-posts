import { PaginationAndSorting } from '../../../common/middleware/query-validation.middleware'

export type UserInput = {
  login: string
  password: string
  email: string
}

export type User = UserInput & {
  createdAt: Date
}

export type UserOutput = Omit<User, 'password'> & {
  id: string
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
