import { db } from '../../../db/in-memory.db'
import { BlogViewModel } from '../types/blog'

const { blogs } = db

const updateOrDeleteBlog = (id: string, blog?: BlogViewModel) => {
  const blogIndex = blogs.findIndex((b) => b.id === id)

  if (blog) {
    blogs.splice(blogIndex, 1, blog) // update blog
  } else {
    blogs.splice(blogIndex, 1) // delete blog
  }
}

const getAll = () => {
  return blogs
}

const getOne = (id: string) => {
  return blogs.find((b) => b.id === id) ?? null
}

const create = (blog: BlogViewModel) => {
  blogs.push(blog)
  return blog
}

const update = (id: string, blog: BlogViewModel) => {
  updateOrDeleteBlog(id, blog)
}

const deleteOne = (id: string) => {
  updateOrDeleteBlog(id)
}

export const blogRepository = {
  getAll,
  getOne,
  create,
  update,
  deleteOne,
}
