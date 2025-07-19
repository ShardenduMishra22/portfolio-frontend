import backendAPI from '../api'
import { ApiResponse, Comment, CreateCommentRequest, UpdateCommentRequest } from '../types'

export const commentsService = {
  // Get comment by ID
  getCommentById: async (id: string): Promise<ApiResponse<Comment>> => {
    const response = await backendAPI.get(`/comments/${id}`)
    return response.data
  },

  // Update comment
  updateComment: async (id: string, commentData: UpdateCommentRequest): Promise<ApiResponse<Comment>> => {
    const response = await backendAPI.put(`/comments/${id}`, commentData)
    return response.data
  },

  // Delete comment
  deleteComment: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.delete(`/comments/${id}`)
    return response.data
  }
} 