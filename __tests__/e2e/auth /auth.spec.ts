import { HttpStatus } from '../../../src/common/types/http-statuses.types'
import { generateAuthToken } from '../../../src/common/utils/generate-auth-token'
import { closeDb, runDb } from '../../../src/db/mongo.db'
import { LoginInput } from '../../../src/features/auth/types/auth.types'
import { UserInput, UserOutput } from '../../../src/features/users/types/user.types'
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

let createdUser: UserOutput

describe('Auth API', () => {
  const app = setupApp()
  const { authToken } = generateAuthToken()

  beforeAll(async () => {
    await runDb()
  })
  afterAll(async () => {
    await clearDb(app)
    closeDb()
  })

  // LOGIN

  it('Should authenticate with correct login and password; POST /auth/login', async () => {
    const createdUserRes = await usersTestManager.create({
      app,
      token: authToken,
      data: testUserData
    })
    createdUser = createdUserRes.body

    await authTestManager.login({
      app,
      data: testLoginDataWithLogin
    })
  })

  it('Should authenticate with correct email and password; POST /auth/login', async () => {
    await authTestManager.login({
      app,
      data: testLoginDataWithEmail
    })
  })

  it('Should not authenticate with incorrect email or login; POST /auth/login', async () => {
    await authTestManager.login({
      app,
      data: incorrectLoginOrEmail,
      httpStatus: HttpStatus.Unauthorized
    })
  })

  it('Should not authenticate with incorrect password; POST /auth/login', async () => {
    await authTestManager.login({
      app,
      data: incorrectPassword,
      httpStatus: HttpStatus.Unauthorized
    })
  })
})
