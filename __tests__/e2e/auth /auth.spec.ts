import { HttpStatus } from '../../../src/common/types/http-statuses.types'
import { generateAuthToken } from '../../../src/common/utils/generate-auth-token'
import { closeDb, runDb } from '../../../src/db/mongo.db'
import { LoginInput } from '../../../src/features/auth/types/auth.types'
import { UserInput } from '../../../src/features/users/types/user.types'
import { setupApp } from '../../../src/setupApp'
import { authTestManager } from '../../utils/auth.util'
import { clearDb } from '../../utils/clearDb.util'
import { usersTestManager } from '../../utils/users.util'

const testUserData: UserInput = {
  login: 'test-login',
  password: 'test_password',
  email: 'test@gmail.com',
}

const testLoginDataWithLogin: LoginInput = {
  loginOrEmail: testUserData.login,
  password: testUserData.password,
}

const testLoginDataWithEmail: LoginInput = {
  loginOrEmail: testUserData.email,
  password: testUserData.password,
}

const incorrectLoginOrEmail: LoginInput = {
  loginOrEmail: 'incorrect',
  password: testUserData.password,
}

const incorrectPassword: LoginInput = {
  loginOrEmail: testUserData.login,
  password: 'incorrect',
}

describe('Auth API', () => {
  const app = setupApp()
  const { authToken } = generateAuthToken()
  const userHelper = usersTestManager({ app, authToken })
  const authHelper = authTestManager({ app })

  beforeAll(async () => {
    await runDb()
  })

  afterAll(async () => {
    await clearDb(app)
    closeDb()
  })

  // LOGIN
  describe('LOGIN endpoint; POST -> /auth/login', () => {
    it('Should authenticate with correct login and password', async () => {
      await userHelper.create({})

      const res = await authHelper.login({
        data: testLoginDataWithLogin,
      })
      expect(res.body).toEqual({
        accessToken: expect.any(String)
      })
    })

    it('Should authenticate with correct email and password', async () => {
      const res = await authHelper.login({
        data: testLoginDataWithEmail,
      })
      expect(res.body).toEqual({
        accessToken: expect.any(String)
      })
    })

    it('Should not authenticate with incorrect email or login', async () => {
      await authHelper.login({
        data: incorrectLoginOrEmail,
        status: HttpStatus.Unauthorized,
      })
    })

    it('Should not authenticate with incorrect password', async () => {
      await authHelper.login({
        data: incorrectPassword,
        status: HttpStatus.Unauthorized,
      })
    })
  })
})
