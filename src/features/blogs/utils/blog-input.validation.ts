import { body } from 'express-validator'

const nameValidation = body('name')
  .exists()
  .withMessage('name field should exist')
  .isString()
  .withMessage('name field should be a string')
  .trim()
  .notEmpty()
  .withMessage('name field should not be empty')
  .isLength({ max: 15 })
  .withMessage('name field should be maximum 15 characters long')

const descriptionValidation = body('description')
  .exists()
  .withMessage('description field should exist')
  .isString()
  .withMessage('description field should be a string')
  .trim()
  .notEmpty()
  .withMessage('name field should not be empty')
  .isLength({ max: 500 })
  .withMessage('description field should be maximum 500 characters long')

const websiteUrlValidation = body('websiteUrl')
  .exists()
  .withMessage('websiteUrl field should exist')
  .isString()
  .withMessage('websiteUrl field should be a string')
  .trim()
  .notEmpty()
  .withMessage('name field should not be empty')
  .isLength({ max: 100 })
  .withMessage('websiteUrl field should be maximum 100 characters long')
  .matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
  .withMessage('websiteUrl must start with https and be a valid domain/path')

export const blogInputValidation = [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
]
