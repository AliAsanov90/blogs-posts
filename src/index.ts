import { runDb } from './db/mongo.db'
import { setupApp } from './setupApp'

const DEFAULT_PORT = 3001

const bootstrap = async () => {
  const app = setupApp()

  const PORT = process.env.PORT ?? DEFAULT_PORT

  await runDb({
    url: process.env.MONGO_URL,
    // url: process.env.MONGO_URL_TEST,
    dbName: process.env.MONGO_DB_NAME,
  })

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on port ${PORT}.....`)
  })
}

void bootstrap()
