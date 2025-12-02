import { WithId } from 'mongodb'
import { usersCollection } from '../../../db/mongo.db'
import { User } from '../../users/types/user.types'

class AuthRepository {
  public async findOneByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<WithId<User> | null> {
    return usersCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    })
  }
}

export const authRepository = new AuthRepository()
