import { Messages } from '../../common/constants/messages'
import { bcryptService } from '../../common/services/bcrypt/bcrypt.service'
import { jwtService } from '../../common/services/jwt/jwt.service'
import { UnauthorizedError } from '../../common/types/errors.types'
import { userRepository } from '../users/repository/user.repository'
import { LoginInput } from './types/auth.types'

class AuthService {
  public async login({ loginOrEmail, password }: LoginInput): Promise<string> {
    const user = await this._checkLoginOrEmailExists(loginOrEmail)

    await this._checkPassword(password, user.password)

    return jwtService.createToken({ userId: user._id.toString() })
  }

  private async _checkLoginOrEmailExists(loginOrEmail: string) {
    const user = await userRepository.findOneByLoginOrEmail(loginOrEmail)

    if (!user) {
      throw new UnauthorizedError(Messages.auth.incorrectLoginOrPassword)
    }
    return user
  }

  private async _checkPassword(inputPassword: string, userPassword: string) {
    const isCorrect = await bcryptService.compareHash(inputPassword, userPassword)

    if (!isCorrect) {
      throw new UnauthorizedError(Messages.auth.incorrectLoginOrPassword)
    }
  }
}

export const authService = new AuthService()
