import { NotFoundError } from '../../common/errors/not-found.error'
import { blogRepository } from './blog.repository'
import { Blog, BlogInput } from './types/blog.types'
import { getBlogInputFields } from './utils/get-blog-input-fields.util'

class BlogService {
  public async getAll() {
    return await blogRepository.getAll()
  }

  public async getOne(id: string) {
    return await blogRepository.getOne(id)
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

  private async getOrThrowExistingBlog(id: string) {
    const blog = await blogRepository.getOne(id)

    if (!blog) {
      throw new NotFoundError('Blog does not exist')
    }
    return blog
  }
}

export const blogService = new BlogService()
