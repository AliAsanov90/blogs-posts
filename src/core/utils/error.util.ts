import { ErrorMessages, ValidationAppError } from '../types/validation-error'

export const createErrorMessages = (
  errors: ValidationAppError[],
): ErrorMessages => {
  return { errorsMessages: errors }
}
