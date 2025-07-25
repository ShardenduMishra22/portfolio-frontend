import backendAPI from '../api'
import { ApiResponse } from '../types'

export const historyService = {
  // Add blog to history (alias for blogsService.addToHistory)
  addToHistory: async (blogId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.post(`/blogs/${blogId}/history`)
    return response.data
  },
}
