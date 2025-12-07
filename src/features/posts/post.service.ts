import { Messages } from '../../common/constants/messages'
import { BadRequestError, NotFoundError } from '../../common/types/errors.types'
import { blogService } from '../blogs/blog.service'
import { commentQueryRepository } from '../comments/repository/comment-query.repository'
import { commentRepository } from '../comments/repository/comment.repository'
import { CommentInput, CommentQueryInput, CommentType } from '../comments/types/comment.types'
import { userService } from '../users/user.service'
import { postQueryRepository } from './repository/post-query.repository'
import { postRepository } from './repository/post.repository'
import { Post, PostInput } from './types/post.types'
import { getPostInputFields } from './utils/get-post-input-fields.util'

class PostService {
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

    const post = await this._getOrThrowExistingPost(id)

    if (inputData.blogId !== post.blogId) {
      throw new BadRequestError(Messages.post.blogNotCorrespondPost)
    }

    const updatedPost: Post = {
      ...post,
      ...getPostInputFields(inputData),
    }
    return await postRepository.update(id, updatedPost)
  }

  public async delete(id: string) {
    await this._getOrThrowExistingPost(id)
    return await postRepository.delete(id)
  }

  public async getCommentsByPostId(query: CommentQueryInput, postId: string) {
    await this._getOrThrowExistingPost(postId)
    return await commentQueryRepository.findManyByPostId(query, postId)
  }

  public async createCommentByPostId({ content }: CommentInput, postId: string, userId: string) {
    const post = await this._getOrThrowExistingPost(postId)
    const user = await userService.getExistingUserOrThrow(userId)

    const newComment = {
      content,
      postId: post.id,
      commentatorInfo: {
        userId: user._id.toString(),
        userLogin: user.login,
      },
      createdAt: new Date().toISOString(),
    } satisfies CommentType

    return await commentRepository.create(newComment)
  }

  private async _getOrThrowExistingPost(id: string) {
    const post = await postQueryRepository.findById(id)

    if (!post) {
      throw new NotFoundError(Messages.post.notFound)
    }
    return post
  }
}

export const postService = new PostService()
