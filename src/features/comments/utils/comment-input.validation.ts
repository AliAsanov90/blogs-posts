import { body } from 'express-validator'

const contentValidation = body('content')
  .exists()
  .withMessage('content field should exist')
  .isString()
  .withMessage('content field should be a string')
  .trim()
  .notEmpty()
  .withMessage('content field should not be empty')
  .isLength({ min: 20, max: 300 })
  .withMessage('content field should be from 20 to 300 characters long')

export const commentInputValidation = [contentValidation]
