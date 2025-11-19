export type PostInput = {
  title: string
  shortDescription: string
  content: string
  blogId: string
}

export type Post = {
  id: string
  blogName: string
} & PostInput
