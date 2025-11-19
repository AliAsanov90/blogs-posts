import { db } from '../../db/in-memory.db'
import { Post } from '../types/post'

const { posts } = db

const updateOrDelete = (id: string, post?: Post) => {
  const postIndex = posts.findIndex((p) => p.id === id)

  if (post) {
    posts.splice(postIndex, 1, post) // update post
  } else {
    posts.splice(postIndex, 1) // delete post
  }
}

const getAll = () => {
  return posts
}

const getOne = (id: string) => {
  return posts.find((p) => p.id === id) ?? null
}

const create = (post: Post) => {
  posts.push(post)
  return post
}

const update = (id: string, post: Post) => {
  updateOrDelete(id, post)
}

const deleteOne = (id: string) => {
  updateOrDelete(id)
}

export const postRepository = {
  getAll,
  getOne,
  create,
  update,
  deleteOne,
}
