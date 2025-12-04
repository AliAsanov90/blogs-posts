import { Filter, ObjectId, WithId } from 'mongodb'
import { usersCollection } from '../../../db/mongo.db'
import { User } from '../types/user.types'

class UserRepository {
  public async create(user: User): Promise<string> {
    const { insertedId } = await usersCollection.insertOne(user)
    return insertedId.toString()
  }

  public async delete(id: string): Promise<boolean> {
    const { deletedCount } = await usersCollection.deleteOne({
      _id: new ObjectId(id),
    })
    return !!deletedCount
  }

  public async getUserExistsByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<boolean> {
    const filter: Filter<User> = {
      $or: [{ login }, { email }],
    }
    const foundUsersCount = await usersCollection.countDocuments(filter)
    return !!foundUsersCount
  }

  public async getOneById(id: string): Promise<WithId<User> | null> {
    return usersCollection.findOne({ _id: new ObjectId(id) })
  }
}

export const userRepository = new UserRepository()
