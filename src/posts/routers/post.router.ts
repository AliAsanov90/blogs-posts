import { Router } from 'express'
import { HOME, ID } from '../../core/constants/routes'
import { createPost } from '../handlers/create.handler'
import { deletePost } from '../handlers/delete.handler'
import { getAllPosts } from '../handlers/get-all.handler'
import { getOnePost } from '../handlers/get-one.handler'
import { updatePost } from '../handlers/update.handler'

export const postRouter: Router = Router()

postRouter
  .get(HOME, getAllPosts)
  .get(ID, getOnePost)
  .post(HOME, createPost)
  .put(ID, updatePost)
  .delete(ID, deletePost)
