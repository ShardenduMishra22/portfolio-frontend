import backendAPI from '../api'
import { ApiResponse, Blog, CreateBlogRequest, UpdateBlogRequest, PaginationParams, PaginatedResponse } from '../types'
import axios from 'axios'

// Local API client for blog endpoints
const localAPI = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const blogsService = {
  // Get all blogs with pagination
  getBlogs: async (params?: PaginationParams): Promise<ApiResponse<Blog[]>> => {
    const response = await localAPI.get('/blogs', { params })
    return response.data
  },

  // Get blog by ID
  getBlogById: async (id: string): Promise<ApiResponse<Blog>> => {
    const response = await localAPI.get(`/blogs/${id}`)
    return response.data
  },

  // Create new blog
  createBlog: async (blogData: CreateBlogRequest): Promise<ApiResponse<Blog>> => {
    const response = await localAPI.post('/blogs', blogData)
    return response.data
  },

  // Update blog
  updateBlog: async (id: string, blogData: UpdateBlogRequest): Promise<ApiResponse<Blog>> => {
    const response = await localAPI.put(`/blogs/${id}`, blogData)
    return response.data
  },

  // Delete blog
  deleteBlog: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.delete(`/blogs/${id}`)
    return response.data
  },

  // Get blog comments
  getBlogComments: async (id: string, params?: PaginationParams): Promise<ApiResponse<any[]>> => {
    const response = await localAPI.get(`/blogs/${id}/comments`, { params })
    return response.data
  },

  // Add comment to blog
  addBlogComment: async (id: string, commentData: { content: string; userId: string }): Promise<ApiResponse<any>> => {
    const response = await localAPI.post(`/blogs/${id}/comments`, commentData)
    return response.data
  },

  // Get blog likes
  getBlogLikes: async (id: string, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const response = await localAPI.get(`/blogs/${id}/likes`, { params })
    return response.data
  },

  // Like blog
  likeBlog: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.post(`/blogs/${id}/like`)
    return response.data
  },

  // Unlike blog
  unlikeBlog: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.post(`/blogs/${id}/unlike`)
    return response.data
  },

  // Bookmark blog
  bookmarkBlog: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.post(`/blogs/${id}/bookmark`)
    return response.data
  },

  // Unbookmark blog
  unbookmarkBlog: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.post(`/blogs/${id}/unbookmark`)
    return response.data
  },

  // Add blog to history
  addToHistory: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.post(`/blogs/${id}/history`)
    return response.data
  },

  // Get blog categories
  getBlogCategories: async (id: string): Promise<ApiResponse<any[]>> => {
    const response = await localAPI.get(`/blogs/${id}/categories`)
    return response.data
  },

  // Add category to blog
  addBlogCategory: async (id: string, categoryId: number): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.post(`/blogs/${id}/categories`, { categoryId })
    return response.data
  },

  // Remove category from blog
  removeBlogCategory: async (id: string, categoryId: number): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.delete(`/blogs/${id}/categories/${categoryId}`)
    return response.data
  },

  // Get blog views
  getBlogViews: async (id: string, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const response = await localAPI.get(`/blogs/${id}/views`, { params })
    return response.data
  },

  // Add blog view
  addBlogView: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.post(`/blogs/${id}/views`)
    return response.data
  },

  // Get blog revisions
  getBlogRevisions: async (id: string, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const response = await localAPI.get(`/blogs/${id}/revisions`, { params })
    return response.data
  },

  // Create blog revision
  createBlogRevision: async (id: string, revisionData: { content: string; version: string }): Promise<ApiResponse<any>> => {
    const response = await localAPI.post(`/blogs/${id}/revisions`, revisionData)
    return response.data
  },

  // Get specific blog revision
  getBlogRevision: async (id: string, version: string): Promise<ApiResponse<any>> => {
    const response = await localAPI.get(`/blogs/${id}/revisions/${version}`)
    return response.data
  }
} 