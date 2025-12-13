import { WithId } from 'mongodb'
import { PaginationAndSorting } from '../../../common/middleware/query-validation.middleware'
import { PaginatedOutput } from '../../../common/types/query-result-output.types'
import { CommentOutput, CommentSortByFields, CommentType } from '../types/comment.types'

export function mapToCommentOutput({
  _id,
  content,
  commentatorInfo: { userId, userLogin },
  createdAt,
}: WithId<CommentType>): CommentOutput {
  return {
    id: _id.toString(),
    content,
    commentatorInfo: {
      userId,
      userLogin,
    },
    createdAt,
  }
}

export const mapToCommentsPaginatedOutput = (
  items: WithId<CommentType>[],
  totalCount: number,
  { pageNumber, pageSize }: PaginationAndSorting<CommentSortByFields>,
): PaginatedOutput<CommentOutput> => {
  return {
    pagesCount: Math.ceil(totalCount / pageSize),
    page: pageNumber,
    pageSize,
    totalCount,
    items: items.map(mapToCommentOutput),
  }
}
