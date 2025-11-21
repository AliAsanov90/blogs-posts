export type BlogInput = {
  name: string
  description: string
  websiteUrl: string
}

export type Blog = BlogInput & {
  createdAt: Date
  isMembership: boolean
}

export type BlogViewModel = Blog & {
  id: string
}
