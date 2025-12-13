import type { Config } from 'jest'

const config: Config = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/__tests__/setupEnv.js'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.spec.ts'],
}

export default config
