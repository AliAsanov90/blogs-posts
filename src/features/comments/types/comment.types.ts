import { PaginationAndSorting } from '../../../common/middleware/query-validation.middleware'

export type CommentInput = {
  content: string
}

export type CommentType = CommentInput & {
  commentatorInfo: {
    userId: string
    userLogin: string
  }
  postId: string
  createdAt: string
}

export type CommentOutput = Omit<CommentType, 'postId'> & {
  id: string
}

export enum CommentSortByFields {
  CreatedAt = 'createdAt',
}

export type CommentQueryInput = PaginationAndSorting<CommentSortByFields>
