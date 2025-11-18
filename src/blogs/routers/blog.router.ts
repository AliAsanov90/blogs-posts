import { Router } from 'express'
import { HOME, ID } from '../../core/constants/routes'
import { createBlog } from '../handlers/create.handler'
import { deleteBlog } from '../handlers/delete.handler'
import { getAllBlogs } from '../handlers/get-all.handler'
import { getOneBlog } from '../handlers/get-one.handler'
import { updateBlog } from '../handlers/update.handler'

export const blogRouter: Router = Router()

blogRouter
  .get(HOME, getAllBlogs)
  .get(ID, getOneBlog)
  .post(HOME, createBlog)
  .put(ID, updateBlog)
  .delete(ID, deleteBlog)
