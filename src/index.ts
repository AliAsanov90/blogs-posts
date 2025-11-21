import 'dotenv/config'
import { runDb } from './db/mongo.db'
import { setupApp } from './setupApp'

const PORT = process.env.PORT ?? 3001

const bootstrap = async () => {
  const app = setupApp()

  await runDb()

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.....`)
  })
}

void bootstrap()
