import backendAPI from '../api'
import { ApiResponse, Comment, CreateCommentRequest, UpdateCommentRequest } from '../types'
import axios from 'axios'

// Local API client for comment endpoints
const localAPI = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const commentsService = {
  // Get comments for a blog
  getBlogComments: async (blogId: string, params?: any): Promise<ApiResponse<Comment[]>> => {
    const response = await localAPI.get(`/blogs/${blogId}/comments`, { params })
    return response.data
  },

  // Add comment to a blog
  addBlogComment: async (
    blogId: string,
    commentData: { content: string; userId: string }
  ): Promise<ApiResponse<Comment>> => {
    const response = await localAPI.post(`/blogs/${blogId}/comments`, commentData)
    return response.data
  },

  // Get comment by ID
  getCommentById: async (id: string): Promise<ApiResponse<Comment>> => {
    const response = await backendAPI.get(`/comments/${id}`)
    return response.data
  },

  // Update comment
  updateComment: async (
    id: string,
    commentData: UpdateCommentRequest
  ): Promise<ApiResponse<Comment>> => {
    const response = await localAPI.patch(`/comments/${id}`, commentData)
    return response.data
  },

  // Delete comment
  deleteComment: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.delete(`/comments/${id}`)
    return response.data
  },
}
