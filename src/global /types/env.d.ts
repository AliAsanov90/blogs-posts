// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'test'
    PORT: number
    ADMIN_USERNAME: string
    ADMIN_PASSWORD: string
    MONGO_DB_USERNAME: string
    MONGO_DB_PASSWORD: string
    MONGO_URL: string
    MONGO_DB_NAME: string
    JWT_SECRET: string
    JWT_EXPIRATION: StringValue
  }
}
