import { param } from 'express-validator'

export const blogIdValidation = param('blogId')
  .exists()
  .withMessage('Blog ID parameter is required')
  .isString()
  .withMessage('Blog ID parameter must be a string')
  .trim()
  .notEmpty()
  .withMessage('Blog ID parameter must not be empty string')
  .isMongoId()
  .withMessage('Blog ID parameter is of incorrect format of Mongo ObjectId')
