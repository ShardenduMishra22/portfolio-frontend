import backendAPI from '../api'
import {
  ApiResponse,
  Blog,
  CreateBlogRequest,
  UpdateBlogRequest,
  PaginationParams,
  PaginatedResponse,
} from '../types'
import axios from 'axios'

// Local API client for blog endpoints
const localAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_1 || process.env.BACKEND_1,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const blogsService = {
  // Get all blogs with pagination
  getBlogs: async (params?: PaginationParams): Promise<ApiResponse<Blog[]>> => {
    const response = await localAPI.get('/api/blogs', { params })
    return response.data
  },

  // Get blog by ID
  getBlogById: async (id: string): Promise<ApiResponse<Blog>> => {
    const response = await localAPI.get(`/api/api/blogs/${id}`)
    return response.data
  },

  // Create new blog
  createBlog: async (blogData: CreateBlogRequest): Promise<ApiResponse<Blog>> => {
    const response = await localAPI.post('/api/blogs', blogData)
    return response.data
  },

  // Update blog
  updateBlog: async (id: string, blogData: UpdateBlogRequest): Promise<ApiResponse<Blog>> => {
    const response = await localAPI.put(`/api/blogs/${id}`, blogData)
    return response.data
  },

  // Delete blog
  deleteBlog: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.delete(`/api/blogs/${id}`)
    return response.data
  },

  // Get blog comments
  getBlogComments: async (id: string, params?: PaginationParams): Promise<ApiResponse<any[]>> => {
    const response = await localAPI.get(`/api/blogs/${id}/comments`, { params })
    return response.data
  },

  // Add comment to blog
  addBlogComment: async (
    id: string,
    commentData: { content: string; userId: string }
  ): Promise<ApiResponse<any>> => {
    const response = await localAPI.post(`/api/blogs/${id}/comments`, commentData)
    return response.data
  },

  // Get blog likes
  getBlogLikes: async (
    id: string,
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const response = await localAPI.get(`/api/blogs/${id}/likes`, { params })
    return response.data
  },

  // Like blog
  likeBlog: async (
    id: string,
    data: { userId: string }
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.post(`/api/blogs/${id}/like`, data)
    return response.data
  },

  // Unlike blog
  unlikeBlog: async (
    id: string,
    data: { userId: string }
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.post(`/api/blogs/${id}/unlike`, data)
    return response.data
  },

  // Bookmark blog
  bookmarkBlog: async (
    id: string,
    data: { userId: string }
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.post(`/api/blogs/${id}/bookmark`, data)
    return response.data
  },

  // Unbookmark blog
  unbookmarkBlog: async (
    id: string,
    data: { userId: string }
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.post(`/api/blogs/${id}/unbookmark`, data)
    return response.data
  },

  // Add blog to history
  addToHistory: async (
    id: string,
    data: { userId: string }
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.post(`/api/blogs/${id}/history`, data)
    return response.data
  },

  // Get blog categories
  getBlogCategories: async (id: string): Promise<ApiResponse<any[]>> => {
    const response = await localAPI.get(`/api/blogs/${id}/categories`)
    return response.data
  },

  // Add category to blog
  addBlogCategory: async (
    id: string,
    categoryId: number
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.post(`/api/blogs/${id}/categories`, { categoryId })
    return response.data
  },

  // Remove category from blog
  removeBlogCategory: async (
    id: string,
    categoryId: number
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.delete(`/api/blogs/${id}/categories/${categoryId}`)
    return response.data
  },

  // Get blog views
  getBlogViews: async (
    id: string,
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const response = await localAPI.get(`/api/blogs/${id}/views`, { params })
    return response.data
  },

  // Add blog view
  addBlogView: async (
    id: string,
    data: { userId?: string; ipAddress?: string; userAgent?: string }
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.post(`/api/blogs/${id}/views`, data)
    return response.data
  },

  // Get blog revisions
  getBlogRevisions: async (
    id: string,
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const response = await localAPI.get(`/api/blogs/${id}/revisions`, { params })
    return response.data
  },

  // Create blog revision
  createBlogRevision: async (
    id: string,
    revisionData: { content: string; version: string }
  ): Promise<ApiResponse<any>> => {
    const response = await localAPI.post(`/api/blogs/${id}/revisions`, revisionData)
    return response.data
  },

  // Get specific blog revision
  getBlogRevision: async (id: string, version: string): Promise<ApiResponse<any>> => {
    const response = await localAPI.get(`/api/blogs/${id}/revisions/${version}`)
    return response.data
  },

  // Get blog statistics
  getBlogStats: async (): Promise<ApiResponse<any>> => {
    const response = await localAPI.get('/api/api/blogs/stats')
    return response.data
  },
}
