import bcrypt from 'bcrypt'

const saltRounds = 12

class BcryptService {
  public async createHash(password: string): Promise<string> {
    return await bcrypt.hash(password, saltRounds)
  }

  public async compareHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }
}

export const bcryptService = new BcryptService()
