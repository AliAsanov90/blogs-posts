export type PostInput = {
  title: string
  shortDescription: string
  content: string
  blogId: string
}

export type Post = PostInput & {
  blogName: string
  createdAt: Date
}

export type PostViewModel = Post & {
  id: string
}
