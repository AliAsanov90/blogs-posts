import { Collection, Db, MongoClient } from 'mongodb'
import { Blog } from '../blogs/types/blog'
import { Post } from '../posts/types/post'

const BLOGS_COLLECTION_NAME = 'blogs'
const POSTS_COLLECTION_NAME = 'posts'

export let client: MongoClient
export let blogsCollection: Collection<Blog>
export let postsCollection: Collection<Post>

type RunDbParams = {
  url: string | undefined
  dbName: string | undefined
}

export const runDb = async ({ url, dbName }: RunDbParams): Promise<void> => {
  if (!url || !dbName) {
    throw new Error('Database URL or name is undefined')
  }

  try {
    client = new MongoClient(url)

    const db: Db = client.db(dbName)

    blogsCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME)
    postsCollection = db.collection<Post>(POSTS_COLLECTION_NAME)

    await client.connect()
    await db.command({ ping: 1 })
    // eslint-disable-next-line no-console
    console.log('✅ Connected to the database')
  } catch (error: unknown) {
    await client.close()
    throw new Error(`❌ Database not connected: ${error}`)
  }
}
