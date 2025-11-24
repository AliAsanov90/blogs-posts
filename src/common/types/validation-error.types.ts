export type ValidationAppError = {
  field?: string
  message: string
}

export type ErrorMessages = {
  errorsMessages: ValidationAppError[]
}
