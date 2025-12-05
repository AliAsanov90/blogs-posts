import { Messages } from '../../common/constants/messages'
import { bcryptService } from '../../common/services/bcrypt/bcrypt.service'
import { UnauthorizedError } from '../../common/types/errors.types'
import { authRepository } from './repository/auth.repository'
import { LoginInput } from './types/auth.types'

class AuthService {
  public async login({ loginOrEmail, password }: LoginInput): Promise<boolean> {
    const user = await this.checkLoginOrEmailExists(loginOrEmail)

    return await bcryptService.compareHash(password, user.password)
  }

  private async checkLoginOrEmailExists(loginOrEmail: string) {
    const user = await authRepository.findOneByLoginOrEmail(loginOrEmail)

    if (!user) {
      throw new UnauthorizedError(Messages.auth.incorrectLoginOrPassword)
    }
    return user
  }
}

export const authService = new AuthService()
