import jwt from 'jsonwebtoken'
import { checkEnvVariables } from '../../utils/checkEnvVars.util'

const secret = process.env.JWT_SECRET
const expiresIn = process.env.JWT_EXPIRATION

type JwtPayloadObj = {
  userId: string
}

class JwtService {
  public createToken(payload: JwtPayloadObj) {
    checkEnvVariables(secret, expiresIn)
    return jwt.sign(payload, secret, { expiresIn })
  }

  public verifyToken(token: string) {
    checkEnvVariables(secret)
    return jwt.verify(token, secret) as JwtPayloadObj
  }
}

export const jwtService = new JwtService()
