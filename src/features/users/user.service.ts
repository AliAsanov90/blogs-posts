import { Messages } from '../../common/constants/messages'
import { bcryptService } from '../../common/services/bcrypt/bcrypt.service'
import { BadRequestError, NotFoundError } from '../../common/types/errors.types'
import { userRepository } from './repository/user.repository'
import { User, UserInput } from './types/user.types'

class UserService {
  public async create(inputData: UserInput) {
    const { login, password, email } = inputData

    await this.checkUserLoginEmailExists(login, email)

    const hashedPassword = await bcryptService.createHash(password)

    const newUser: User = {
      login,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    }
    return await userRepository.create(newUser)
  }

  public async delete(id: string) {
    await this.getExistingUserOrThrow(id)
    return await userRepository.delete(id)
  }

  private async checkUserLoginEmailExists(login: string, email: string) {
    const userExists = await userRepository.getUserExistsByLoginAndEmail(login, email)
    if (userExists) {
      throw new BadRequestError(Messages.user.emailOrLoginExists)
    }
  }

  public async getExistingUserOrThrow(id: string) {
    const user = await userRepository.getOneById(id)

    if (!user) {
      throw new NotFoundError(Messages.user.notFound)
    }
    return user
  }
}

export const userService = new UserService()
