import backendAPI from '../api'
import { ApiResponse } from '../types'

export const likesService = {
  // Like a blog (alias for blogsService.likeBlog)
  likeBlog: async (blogId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.post(`/blogs/${blogId}/like`)
    return response.data
  },

  // Unlike a blog (alias for blogsService.unlikeBlog)
  unlikeBlog: async (blogId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.post(`/blogs/${blogId}/unlike`)
    return response.data
  }
} 