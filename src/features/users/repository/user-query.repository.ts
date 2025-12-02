import { Filter, ObjectId, WithId } from 'mongodb'
import { QueryResult } from '../../../common/types/query-result-output.types'
import { usersCollection } from '../../../db/mongo.db'
import {
  User,
  UserQueryInput,
  UserSearchQueryFields,
} from '../types/user.types'

type UserSearchFieldKeys = keyof Pick<User, 'login' | 'email'>

class UserQueryRepository {
  public async findMany(query: UserQueryInput): Promise<QueryResult<User>> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchEmailTerm,
      searchLoginTerm,
    } = query

    const skip = (pageNumber - 1) * pageSize

    const filter = this.prepareFilterObj({
      email: searchEmailTerm,
      login: searchLoginTerm,
    })

    const items = await usersCollection
      .find()
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray()

    const totalCount = await usersCollection.countDocuments(filter)

    return { items, totalCount }
  }

  public async findById(id: ObjectId): Promise<WithId<User> | null> {
    return usersCollection.findOne({ _id: id })
  }

  private prepareFilterObj(
    fieldValuesMap: Record<UserSearchFieldKeys, UserSearchQueryFields>,
  ) {
    return Object.entries(fieldValuesMap).reduce(
      (filterObj, [field, value]): Filter<User> => {
        filterObj.$or = filterObj.$or?.length ? filterObj.$or : []

        if (value) {
          filterObj.$or.push({
            [field]: { $regex: value, $options: 'i' },
          })
        }
        return filterObj
      },
      {},
    )
  }
}

export const userQueryRepository = new UserQueryRepository()
