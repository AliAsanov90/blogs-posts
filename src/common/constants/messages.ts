export const Messages = {
  blog: {
    notFound: 'Blog does not exist',
  },
  post: {
    notFound: 'Post does not exist',
    blogNotCorrespondPost: 'Blog ID does not correspond to Post ID',
  },
  comment: {
    notFound: 'Comment does not exist',
    forbiddenUpdate: 'You are not authorized to update this comment',
    forbiddenDelete: 'You are not authorized to delete this comment',
  },
  user: {
    notFound: 'User does not exist',
    emailOrLoginExists: 'User with such email or login already exists',
  },
  auth: {
    incorrectLoginOrPassword: 'Login or password is incorrect',
  },
} as const
