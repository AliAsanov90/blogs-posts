import { body } from 'express-validator'

const loginOrEmailValidation = body('loginOrEmail')
  .exists()
  .withMessage('loginOrEmail field should exist')
  .isString()
  .withMessage('loginOrEmail field should be a string')
  .trim()
  .notEmpty()
  .withMessage('loginOrEmail field should not be empty')

const passwordValidation = body('password')
  .exists()
  .withMessage('password field should exist')
  .isString()
  .withMessage('password field should be a string')
  .trim()
  .notEmpty()
  .withMessage('password field should not be empty')

export const loginInputValidation = [loginOrEmailValidation, passwordValidation]
