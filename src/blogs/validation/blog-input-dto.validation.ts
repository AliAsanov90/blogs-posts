import { body } from 'express-validator'

const nameValidation = body('name')
  .exists()
  .withMessage('name field should exist')
  .isString()
  .withMessage('name field should be a string')
  .isLength({ min: 1, max: 15 })
  .withMessage('name field should be from 1 to 15 characters long')

const descriptionValidation = body('description')
  .exists()
  .withMessage('description field should exist')
  .isString()
  .withMessage('description field should be a string')
  .isLength({ min: 1, max: 500 })
  .withMessage('description field should be from 1 to 500 characters long')

const websiteUrlValidation = body('websiteUrl')
  .exists()
  .withMessage('websiteUrl field should exist')
  .isString()
  .withMessage('websiteUrl field should be a string')
  .isLength({ min: 1, max: 100 })
  .withMessage('websiteUrl field should be from 1 to 100 characters long')
  .matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
  .withMessage('websiteUrl must start with https and be a valid domain/path')

export const blogInputDtoValidation = [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
]
