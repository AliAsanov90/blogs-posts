import { HttpStatus } from '../../../src/common/types/http-statuses.types'
import { generateAuthToken } from '../../../src/common/utils/generate-auth-token'
import { closeDb, runDb } from '../../../src/db/mongo.db'
import { UserInput, UserOutput } from '../../../src/features/users/types/user.types'
import { setupApp } from '../../../src/setupApp'
import { clearDb } from '../../utils/clearDb.util'
import { usersTestManager } from '../../utils/users.util'

const testUserData: UserInput = {
  login: 'test-login',
  password: 'test_password',
  email: 'test@gmail.com',
}

const testUserData2: UserInput = {
  login: 'test2',
  password: 'test_password_2',
  email: 'test2@gmail.com',
}

const incorrectTestUserData: UserInput = {
  login: '         ',
  password: 'Test password',
  email: 'websiteUrl'
}

let createdUser: UserOutput

describe('Users API', () => {
  const app = setupApp()
  const { authToken } = generateAuthToken()

  beforeAll(async () => {
    await runDb()
  })
  afterAll(async () => {
    await clearDb(app)
    closeDb()
  })

  // CREATE

  it('Should create a user; POST /users', async () => {
    const createdUserRes = await usersTestManager.create({
      app,
      token: authToken,
      data: testUserData
    })
    createdUser = createdUserRes.body
    expect(createdUser).toEqual({
      ...testUserData,
      ...createdUser,
      password: undefined // exclude "password" from result object
    })

    const usersRes = await usersTestManager.getAll({ app, token: authToken })
    expect(usersRes.body.items).toBeInstanceOf(Array)
    expect(usersRes.body.items.length).toBe(1)
  })

  it('Should not create a user if login or email already exists; POST /users', async () => {
    await usersTestManager.create({
      app,
      token: authToken,
      data: testUserData,
      httpStatus: HttpStatus.BadRequest
    })
  })

  it('Should not create a user without auth header; POST /users', async () => {
    await usersTestManager.create({
      app,
      token: undefined,
      data: testUserData,
      httpStatus: HttpStatus.Unauthorized
    })
  })

  it('Should not create a user with incorrect auth token; POST /users', async () => {
    await usersTestManager.create({
      app,
      token: 'Basic sfsdfsdsdfsdsf',
      data: testUserData,
      httpStatus: HttpStatus.Unauthorized
    })
  })

  it('Should not create a user if body is incorrect; POST /users', async () => {
     await usersTestManager.create({
      app,
      token: authToken,
      data: incorrectTestUserData,
      httpStatus: HttpStatus.BadRequest
    })
  })

  // GET ALL

  it('Should get all users; GET /users', async () => {
    const getAllUsersRes = await usersTestManager.getAll({ app, token: authToken })

    expect(getAllUsersRes.body.items).toBeInstanceOf(Array)
    expect(getAllUsersRes.body.items.length).toBe(1)
  })

  it('Should get users that match "searchLoginTerm" query param; GET /users?searchLoginTerm={MATCH}', async () => {
    const getUsersRes = await usersTestManager.getAll({
      app,
      token: authToken,
      query: { searchLoginTerm: testUserData.login }
    })
    expect(getUsersRes.body.items.length).toBe(1)
  })

  it('Should get users that match "searchEmailTerm" query param; GET /users?searchEmailTerm={MATCH}', async () => {
    const getUsersRes = await usersTestManager.getAll({
      app,
      token: authToken,
      query: { searchEmailTerm: testUserData.email }
    })
    expect(getUsersRes.body.items.length).toBe(1)
  })

  it('Should not get any users if "searchLoginTerm" query does not match; GET /users?searchLoginTerm={NOT_MATCH}', async () => {
    const getUsersRes = await usersTestManager.getAll({
      app,
      token: authToken,
      query: { searchLoginTerm: 'user' }
    })
    expect(getUsersRes.body.items.length).toBe(0)
  })

  it('Should not get any users if "searchEmailTerm" query does not match; GET /users?searchEmailTerm={NOT_MATCH}', async () => {
    const getUsersRes = await usersTestManager.getAll({
      app,
      token: authToken,
      query: { searchEmailTerm: 'user@gmail.com' }
    })
    expect(getUsersRes.body.items.length).toBe(0)
  })

  it('Should get users with "searchLoginTerm" and "searchEmailTerm"; GET /users?searchLoginTerm={MATCH}&searchEmailTerm={MATCH}', async () => {
    await usersTestManager.create({
      app,
      token: authToken,
      data: testUserData2
    })

    const getUsersRes = await usersTestManager.getAll({
      app,
      token: authToken,
      query: {
        searchLoginTerm: testUserData.login,
        searchEmailTerm: testUserData2.email,
      }
    })
    expect(getUsersRes.body.items.length).toBe(2)
  })

  // DELETE

  it('Should not delete without auth; DELETE /users/:id', async () => {
    await usersTestManager.delete({
      app,
      id: createdUser.id,
      token: undefined,
      httpStatus: HttpStatus.Unauthorized
    })
  })

  it('Should delete a user; DELETE /users/:id', async () => {
    const usersResBefore = await usersTestManager.getAll({
      app,
      token: authToken,
      query: { searchEmailTerm: createdUser.email }
    })
    expect(usersResBefore.body.items.length).toBe(1)

    await usersTestManager.delete({
      app,
      token: authToken,
      id: createdUser.id,
    })

    const usersResAfter = await usersTestManager.getAll({
      app,
      token: authToken,
      query: { searchEmailTerm: createdUser.email },
    })
    expect(usersResAfter.body.items.length).toBe(0)
  })

  it('Should not delete a not found user; DELETE /users/:id', async () => {
    await usersTestManager.delete({
      app,
      id: '691fe02e62d2354296c74851',
      token: authToken,
      httpStatus: HttpStatus.NotFound
    })
  })
})
