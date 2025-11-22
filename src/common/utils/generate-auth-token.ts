import { ADMIN_PASSWORD, ADMIN_USERNAME } from '../middleware/auth.middleware'

export const generateAuthToken = () => {
  const credentials = `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`
  const token = Buffer.from(credentials, 'utf8').toString('base64')
  const tokenType = 'Basic'

  return {
    authToken: `${tokenType} ${token}`,
    tokenType,
    token,
  }
}
