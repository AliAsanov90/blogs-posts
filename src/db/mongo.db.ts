import { Collection, Db, MongoClient } from 'mongodb'
import { Blog } from '../features/blogs/types/blog.types'
import { Post } from '../features/posts/types/post.types'
import { User } from '../features/users/types/user.types'

const DB_URL = process.env.MONGO_URL
const DB_NAME = process.env.MONGO_DB_NAME

const BLOGS_COLLECTION_NAME = 'blogs'
const POSTS_COLLECTION_NAME = 'posts'
const USERS_COLLECTION_NAME = 'users'

export let client: MongoClient
export let blogsCollection: Collection<Blog>
export let postsCollection: Collection<Post>
export let usersCollection: Collection<User>

export const runDb = async (): Promise<void> => {
  if (!DB_URL || !DB_NAME) {
    throw new Error('Database URL or name is undefined')
  }

  try {
    client = new MongoClient(DB_URL)

    const db: Db = client.db(DB_NAME)

    blogsCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME)
    postsCollection = db.collection<Post>(POSTS_COLLECTION_NAME)
    usersCollection = db.collection<User>(USERS_COLLECTION_NAME)

    await client.connect()
    await db.command({ ping: 1 })
    console.log('✅ Connected to the database')
  } catch (error: unknown) {
    await client.close()
    console.error(error)
    throw new Error('❌ Database not connected...')
  }
}

export const closeDb = async () => {
  await client.close()
}
