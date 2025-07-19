// Export all backend services
export { authService } from './auth'
export { usersService } from './users'
export { blogsService } from './blogs'
export { commentsService } from './comments'
export { categoriesService } from './categories'
export { notificationsService } from './notifications'
export { reportsService } from './reports'
export { likesService } from './likes'
export { bookmarksService } from './bookmarks'
export { historyService } from './history'
export { followersService } from './followers'

// Export types
export * from './types'

// Export base API instance
export { default as backendAPI } from './api' 