export const checkEnvVariables = (...envVars: unknown[]) => {
  const hasUndefinedEnvVars = envVars.includes(undefined)

  if (hasUndefinedEnvVars) {
    console.log('envVars: ', envVars)
    throw new Error('Env variables include undefined variable')
  }
}
