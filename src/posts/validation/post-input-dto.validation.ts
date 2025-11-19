import { body } from 'express-validator'

const titleValidation = body('title')
  .exists()
  .withMessage('title field should exist')
  .isString()
  .withMessage('title field should be a string')
  .isLength({ min: 1, max: 30 })
  .withMessage('title field should be from 1 to 30 characters long')

const shortDescriptionValidation = body('shortDescription')
  .exists()
  .withMessage('shortDescription field should exist')
  .isString()
  .withMessage('shortDescription field should be a string')
  .isLength({ min: 1, max: 100 })
  .withMessage('shortDescription field should be from 1 to 100 characters long')

const contentValidation = body('content')
  .exists()
  .withMessage('content field should exist')
  .isString()
  .withMessage('content field should be a string')
  .isLength({ min: 1, max: 1000 })
  .withMessage('content field should be from 1 to 1000 characters long')

const blogIdValidation = body('blogId')
  .exists()
  .withMessage('blogId field should exist')
  .isString()
  .withMessage('blogId field should be a string')
  .isLength({ min: 1 })
  .withMessage('blogId field should be at least 1 character long')

export const postInputDtoValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
]
