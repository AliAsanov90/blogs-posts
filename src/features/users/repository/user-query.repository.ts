import { Filter, ObjectId } from 'mongodb'
import { PaginatedOutput } from '../../../common/types/query-result-output.types'
import { usersCollection } from '../../../db/mongo.db'
import { User, UserOutput, UserQueryInput } from '../types/user.types'
import { mapToUserOutput, mapToUsersPaginatedOutput } from '../utils/user-output.mapper'

type UserSearchFieldKeys = keyof Pick<User, 'login' | 'email'>

class UserQueryRepository {
  public async findMany(query: UserQueryInput): Promise<PaginatedOutput<UserOutput>> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchEmailTerm, searchLoginTerm } = query

    const skip = (pageNumber - 1) * pageSize

    const filter = this.prepareFilterObj({
      email: searchEmailTerm,
      login: searchLoginTerm,
    })

    const items = await usersCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray()

    const totalCount = await usersCollection.countDocuments(filter)

    return mapToUsersPaginatedOutput(items, totalCount, query)
  }

  public async findById(id: string): Promise<UserOutput | null> {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) })
    return user ? mapToUserOutput(user) : null
  }

  private prepareFilterObj(fieldValuesMap: Record<UserSearchFieldKeys, string | undefined>) {
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
