import { Collection, Db, MongoClient } from 'mongodb'
import { Blog } from '../blogs/types/blog'
import { Post } from '../posts/types/post'

const DB_URL = process.env.MONGO_URL
const DB_NAME = process.env.MONGO_DB_NAME

const BLOGS_COLLECTION_NAME = 'blogs'
const POSTS_COLLECTION_NAME = 'posts'

export let client: MongoClient
export let blogsCollection: Collection<Blog>
export let postsCollection: Collection<Post>

export const runDb = async (): Promise<void> => {
  if (!DB_URL || !DB_NAME) {
    throw new Error('Database URL or name is undefined')
  }

  try {
    client = new MongoClient(DB_URL)

    const db: Db = client.db(DB_NAME)

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

export const closeDb = async () => {
  await client.close()
}
