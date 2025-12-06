export const checkEnvVariables = (...envVars: unknown[]) => {
  const hasUndefinedEnvVars = envVars.includes(undefined)

  if (hasUndefinedEnvVars) {
    throw new Error('Env variables include undefined variable')
  }
}
