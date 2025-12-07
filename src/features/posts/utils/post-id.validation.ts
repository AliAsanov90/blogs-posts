import { param } from 'express-validator'

export const postIdValidation = param('postId')
  .exists()
  .withMessage('Post ID parameter is required')
  .isString()
  .withMessage('Post ID parameter must be a string')
  .trim()
  .notEmpty()
  .withMessage('Post ID parameter must not be empty string')
  .isMongoId()
  .withMessage('Post ID parameter is of incorrect format of Mongo ObjectId')
