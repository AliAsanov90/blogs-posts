import { param } from 'express-validator'

export const commentIdValidation = param('commentId')
  .exists()
  .withMessage('"commentId" param is required')
  .isString()
  .withMessage('"commentId" param must be a string')
  .trim()
  .notEmpty()
  .withMessage('"commentId" param must not be empty')
  .isMongoId()
  .withMessage('"commentId" param: Incorrect format of Mongo ObjectId')
