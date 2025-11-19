import { setupApp } from './setupApp'

const app = setupApp()

const DEFAULT_PORT = 3001
const PORT = process.env.PORT ?? DEFAULT_PORT

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on port ${PORT}.....`)
})
