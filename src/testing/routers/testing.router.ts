import { Router } from 'express'
import { ALL_DATA } from '../../core/constants/routes'
import { deleteAllData } from '../handlers/delete-all.handler'

export const testingRouter: Router = Router()

testingRouter.delete(ALL_DATA, deleteAllData)
