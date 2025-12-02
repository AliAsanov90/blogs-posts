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

  public async findById(id: string): Promise<WithId<User> | null> {
    return usersCollection.findOne({ _id: new ObjectId(id) })
  }

  private prepareFilterObj(
    fieldValuesMap: Record<UserSearchFieldKeys, UserSearchQueryFields>,
  ) {
    const filterObj: Filter<User> = {}
    const orArray: Filter<User>[] = []

    Object.entries(fieldValuesMap).forEach(([field, value]) => {
      if (value) {
        orArray.push({
          [field]: { $regex: value, $options: 'i' },
        })
      }
    })

    if (orArray.length) {
      filterObj.$or = orArray
    }

    return filterObj
  }
}

export const userQueryRepository = new UserQueryRepository()
