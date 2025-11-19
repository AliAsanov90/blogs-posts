export type BlogInput = {
  name: string
  description: string
  websiteUrl: string
}

export type Blog = { id: string } & BlogInput
