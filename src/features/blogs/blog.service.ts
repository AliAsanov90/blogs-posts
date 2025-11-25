import { Messages } from '../../common/constants/messages'
import { NotFoundError } from '../../common/types/errors.types'
import { postQueryRepository } from '../posts/repository/post-query.repository'
import { postRepository } from '../posts/repository/post.repository'
import { Post, PostInput, PostQueryInput } from '../posts/types/post.types'
import { getPostInputFields } from '../posts/utils/get-post-input-fields.util'
import { blogQueryRepository } from './repository/blog-query.repository'
import { blogRepository } from './repository/blog.repository'
import { Blog, BlogInput, BlogQueryInput } from './types/blog.types'
import { getBlogInputFields } from './utils/get-blog-input-fields.util'

class BlogService {
  public async getAll(queryInput: BlogQueryInput) {
    return await blogQueryRepository.findMany(queryInput)
  }

  public async getOne(id: string) {
    return await blogRepository.getOne(id)
  }

  public async getPostsByBlogId(query: PostQueryInput, blogId: string) {
    await this.getOrThrowExistingBlog(blogId)
    return await postQueryRepository.findManyByBlogId(query, blogId)
  }

  public async createPostByBlogId(inputData: PostInput) {
    const blog = await this.getOrThrowExistingBlog(inputData.blogId)

    const newPost: Post = {
      ...getPostInputFields(inputData),
      blogName: blog.name,
      createdAt: new Date(),
    }
    return await postRepository.create(newPost)
  }

  public async create(inputData: BlogInput) {
    const blog: Blog = {
      ...getBlogInputFields(inputData),
      isMembership: false,
      createdAt: new Date(),
    }
    return await blogRepository.create(blog)
  }

  public async update(id: string, inputData: BlogInput) {
    const blog = await this.getOrThrowExistingBlog(id)

    const updatedBlog: Blog = {
      ...blog,
      ...getBlogInputFields(inputData),
    }
    return await blogRepository.update(id, updatedBlog)
  }

  public async delete(id: string) {
    await this.getOrThrowExistingBlog(id)
    return await blogRepository.delete(id)
  }

  public async getOrThrowExistingBlog(id: string) {
    const blog = await blogRepository.getOne(id)

    if (!blog) {
      throw new NotFoundError(Messages.BlogNotFound)
    }
    return blog
  }
}

export const blogService = new BlogService()
