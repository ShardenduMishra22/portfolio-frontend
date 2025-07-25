import backendAPI from '../api'
import { ApiResponse } from '../types'

export const bookmarksService = {
  // Bookmark a blog (alias for blogsService.bookmarkBlog)
  bookmarkBlog: async (blogId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.post(`/blogs/${blogId}/bookmark`)
    return response.data
  },

  // Unbookmark a blog (alias for blogsService.unbookmarkBlog)
  unbookmarkBlog: async (blogId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.post(`/blogs/${blogId}/unbookmark`)
    return response.data
  },
}
