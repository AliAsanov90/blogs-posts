import { HttpStatus } from '../../../src/common/types/http-statuses.types'
import { closeDb, runDb } from '../../../src/db/mongo.db'
import { UserInput, UserOutput } from '../../../src/features/users/types/user.types'
import { setupApp } from '../../../src/setupApp'
import { clearDb } from '../../utils/test-helpers.util'
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
  email: 'websiteUrl',
}

describe('Users API', () => {
  const app = setupApp()
  const userHelper = usersTestManager(app)

  beforeAll(async () => {
    await runDb()
  })

  afterAll(async () => {
    await closeDb()
  })

  // CREATE
  describe('CREATE endpoint; POST -> /users', () => {
    let createdUser: UserOutput

    afterAll(async () => {
      await clearDb(app)
    })

    it('Should create a user', async () => {
      createdUser = (await userHelper.create({})).body

      expect(createdUser).toEqual({
        ...testUserData,
        ...createdUser,
        password: undefined, // exclude "password" from result object
      })

      const usersRes = await userHelper.getAll({})
      expect(usersRes.body.items).toBeInstanceOf(Array)
      expect(usersRes.body.items.length).toBe(1)
    })

    it('Should not create a user if login or email already exists', async () => {
      await userHelper.create({
        status: HttpStatus.BadRequest,
      })
    })

    it('Should not create a user without auth header', async () => {
      await userHelper.create({
        token: '',
        status: HttpStatus.Unauthorized,
      })
    })

    it('Should not create a user with incorrect auth token', async () => {
      await userHelper.create({
        token: 'Basic sfsdfsdsdfsdsf',
        status: HttpStatus.Unauthorized,
      })
    })

    it('Should not create a user if body is incorrect', async () => {
      await userHelper.create({
        data: incorrectTestUserData,
        status: HttpStatus.BadRequest,
      })
    })
  })

  // GET ALL
  describe('GET ALL endpoint; GET -> /users', () => {
    beforeAll(async () => {
      await userHelper.create({})
    })

    afterAll(async () => {
      await clearDb(app)
    })

    it('Should get all users', async () => {
      const getAllUsersRes = await userHelper.getAll({})

      expect(getAllUsersRes.body.items).toBeInstanceOf(Array)
      expect(getAllUsersRes.body.items.length).toBe(1)
    })

    it('Should get users that match "searchLoginTerm" query param', async () => {
      const getUsersRes = await userHelper.getAll({
        query: { searchLoginTerm: testUserData.login },
      })
      expect(getUsersRes.body.items.length).toBe(1)
    })

    it('Should get users that match "searchEmailTerm" query param', async () => {
      const getUsersRes = await userHelper.getAll({
        query: { searchEmailTerm: testUserData.email },
      })
      expect(getUsersRes.body.items.length).toBe(1)
    })

    it('Should not get any users if "searchLoginTerm" query does not match', async () => {
      const getUsersRes = await userHelper.getAll({
        query: { searchLoginTerm: 'user' },
      })
      expect(getUsersRes.body.items.length).toBe(0)
    })

    it('Should not get any users if "searchEmailTerm" query does not match', async () => {
      const getUsersRes = await userHelper.getAll({
        query: { searchEmailTerm: 'user@gmail.com' },
      })
      expect(getUsersRes.body.items.length).toBe(0)
    })

    it('Should get users with "searchLoginTerm" and "searchEmailTerm"', async () => {
      await userHelper.create({
        data: testUserData2,
      })

      const getUsersRes = await userHelper.getAll({
        query: {
          searchLoginTerm: testUserData.login,
          searchEmailTerm: testUserData2.email,
        },
      })
      expect(getUsersRes.body.items.length).toBe(2)
    })
  })

  // DELETE
  describe('DELETE endpoint; DELETE -> /users/:id', () => {
    let createdUser: UserOutput

    beforeAll(async () => {
      createdUser = (await userHelper.create({})).body
    })

    afterAll(async () => {
      await clearDb(app)
    })

    it('Should not delete without auth', async () => {
      await userHelper.delete({
        id: createdUser.id,
        token: '',
        status: HttpStatus.Unauthorized,
      })
    })

    it('Should delete a user', async () => {
      const usersResBefore = await userHelper.getAll({
        query: { searchEmailTerm: createdUser.email },
      })
      expect(usersResBefore.body.items.length).toBe(1)

      await userHelper.delete({
        id: createdUser.id,
      })

      const usersResAfter = await userHelper.getAll({
        query: { searchEmailTerm: createdUser.email },
      })
      expect(usersResAfter.body.items.length).toBe(0)
    })

    it('Should not delete a not found user', async () => {
      await userHelper.delete({
        id: '691fe02e62d2354296c74851',
        status: HttpStatus.NotFound,
      })
    })
  })
})
