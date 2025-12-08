import { HttpStatus } from '../../../src/common/types/http-statuses.types'
import { closeDb, runDb } from '../../../src/db/mongo.db'
import { LoginInput } from '../../../src/features/auth/types/auth.types'
import { UserInput, UserOutput } from '../../../src/features/users/types/user.types'
import { setupApp } from '../../../src/setupApp'
import { authTestManager } from '../../utils/auth.util'
import { clearDb, createTestData } from '../../utils/test-helpers.util'
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
  const userHelper = usersTestManager(app)
  const authHelper = authTestManager(app)

  beforeAll(async () => {
    await runDb()
  })
  afterAll(async () => {
    await clearDb(app)
    closeDb()
  })

  // LOGIN
  describe('LOGIN endpoint; POST -> /auth/login', () => {
    afterAll(async () => {
      await clearDb(app)
    })

    it('Should authenticate with correct login and password', async () => {
      await userHelper.create({})

      const res = await authHelper.login({
        data: testLoginDataWithLogin,
      })
      expect(res.body).toEqual({
        accessToken: expect.any(String),
      })
    })

    it('Should authenticate with correct email and password', async () => {
      const res = await authHelper.login({
        data: testLoginDataWithEmail,
      })
      expect(res.body).toEqual({
        accessToken: expect.any(String),
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

  // GET ME
  describe('GET ME endpoint; GET -> /auth/me', () => {
    let createdUser: UserOutput
    let accessToken: string

    beforeAll(async () => {
      const { user, userAccessToken } = await createTestData(app)
      createdUser = user
      accessToken = userAccessToken
    })
    afterAll(async () => {
      await clearDb(app)
    })

    it('Should return authenticated user data', async () => {
      const getMeRes = await authHelper.getMe({ token: accessToken })
      expect(getMeRes.body).toEqual({
        email: createdUser.email,
        login: createdUser.login,
        userId: createdUser.id,
      })
    })

    it('Should return "Unauthorized" error if user not authenticated', async () => {
      await authHelper.getMe({
        token: 'invalid-token',
        status: HttpStatus.Unauthorized,
      })
    })

    it('Should return "Unauthorized" error auth header absent', async () => {
      await authHelper.getMe({
        token: 'invalid-token',
        status: HttpStatus.Unauthorized,
        withAuthHeader: false,
      })
    })

    it('Should return "Unauthorized" error if "Bearer" absent', async () => {
      await authHelper.getMe({
        token: 'invalid-token',
        status: HttpStatus.Unauthorized,
        withAuthBearer: false,
      })
    })
  })
})
