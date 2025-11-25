import { Messages } from '../../common/constants/messages'
import { BadRequestError, NotFoundError } from '../../common/types/errors.types'
import { blogService } from '../blogs/blog.service'
import { postRepository } from './repository/post.repository'
import { Post, PostInput } from './types/post.types'
import { getPostInputFields } from './utils/get-post-input-fields.util'

class PostService {
  public async getAll() {
    return await postRepository.getAll()
  }

  public async getOne(id: string) {
    return await postRepository.getOne(id)
  }

  public async create(inputData: PostInput) {
    const blog = await blogService.getOrThrowExistingBlog(inputData.blogId)

    const newPost: Post = {
      ...getPostInputFields(inputData),
      blogName: blog.name,
      createdAt: new Date(),
    }
    return await postRepository.create(newPost)
  }

  public async update(id: string, inputData: PostInput) {
    await blogService.getOrThrowExistingBlog(inputData.blogId)

    const post = await this.getOrThrowExistingPost(id)

    if (inputData.blogId !== post.blogId) {
      throw new BadRequestError(Messages.BlogNotCorrespondPost)
    }

    const updatedPost: Post = {
      ...post,
      ...getPostInputFields(inputData),
    }
    return await postRepository.update(id, updatedPost)
  }

  public async delete(id: string) {
    await this.getOrThrowExistingPost(id)
    return await postRepository.delete(id)
  }

  private async getOrThrowExistingPost(id: string) {
    const post = await postRepository.getOne(id)

    if (!post) {
      throw new NotFoundError(Messages.PostNotFound)
    }
    return post
  }
}

export const postService = new PostService()
