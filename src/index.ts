import { runDb } from './db/mongo.db'
import { setupApp } from './setupApp'

const DEFAULT_PORT = 3001

const bootstrap = async () => {
  const app = setupApp()

  const PORT = process.env.PORT ?? DEFAULT_PORT

  await runDb()

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on port ${PORT}.....`)
  })
}

bootstrap()
