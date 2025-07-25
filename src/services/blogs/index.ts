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

// Simple in-memory cache for GET requests
const cache: Record<string, { data: any, expiry: number }> = {}
const CACHE_TTL = 30 * 1000 // 30 seconds

function getCache(key: string) {
  const entry = cache[key]
  if (entry && entry.expiry > Date.now()) return entry.data
  return null
}

function setCache(key: string, data: any) {
  cache[key] = { data, expiry: Date.now() + CACHE_TTL }
}

export const blogsService = {
  // Get all blogs with pagination
  getBlogs: async (params?: PaginationParams): Promise<ApiResponse<Blog[]>> => {
    const key = `getBlogs:${JSON.stringify(params)}`
    const cached = getCache(key)
    if (cached) return cached
    const response = await localAPI.get('/blogs', { params })
    setCache(key, response.data)
    return response.data
  },

  // Get blog by ID
  getBlogById: async (id: string): Promise<ApiResponse<Blog>> => {
    const key = `getBlogById:${id}`
    const cached = getCache(key)
    if (cached) return cached
    const response = await localAPI.get(`/blogs/${id}`)
    setCache(key, response.data)
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
    const key = `getBlogComments:${id}:${JSON.stringify(params)}`
    const cached = getCache(key)
    if (cached) return cached
    const response = await localAPI.get(`/blogs/${id}/comments`, { params })
    setCache(key, response.data)
    return response.data
  },

  // Add comment to blog
  addBlogComment: async (id: string, commentData: { content: string; userId: string }): Promise<ApiResponse<any>> => {
    const response = await localAPI.post(`/blogs/${id}/comments`, commentData)
    return response.data
  },

  // Get blog likes
  getBlogLikes: async (id: string, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const key = `getBlogLikes:${id}:${JSON.stringify(params)}`
    const cached = getCache(key)
    if (cached) return cached
    const response = await localAPI.get(`/blogs/${id}/likes`, { params })
    setCache(key, response.data)
    return response.data
  },

  // Like blog
  likeBlog: async (id: string, data: { userId: string }): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.post(`/blogs/${id}/like`, data)
    return response.data
  },

  // Unlike blog
  unlikeBlog: async (id: string, data: { userId: string }): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.post(`/blogs/${id}/unlike`, data)
    return response.data
  },

  // Bookmark blog
  bookmarkBlog: async (id: string, data: { userId: string }): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.post(`/blogs/${id}/bookmark`, data)
    return response.data
  },

  // Unbookmark blog
  unbookmarkBlog: async (id: string, data: { userId: string }): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.post(`/blogs/${id}/unbookmark`, data)
    return response.data
  },

  // Add blog to history
  addToHistory: async (id: string, data: { userId: string }): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.post(`/blogs/${id}/history`, data)
    return response.data
  },

  // Get blog categories
  getBlogCategories: async (id: string): Promise<ApiResponse<any[]>> => {
    const key = `getBlogCategories:${id}`
    const cached = getCache(key)
    if (cached) return cached
    const response = await localAPI.get(`/blogs/${id}/categories`)
    setCache(key, response.data)
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
    const key = `getBlogViews:${id}:${JSON.stringify(params)}`
    const cached = getCache(key)
    if (cached) return cached
    const response = await localAPI.get(`/blogs/${id}/views`, { params })
    setCache(key, response.data)
    return response.data
  },

  // Add blog view
  addBlogView: async (id: string, data: { userId?: string; ipAddress?: string; userAgent?: string }): Promise<ApiResponse<{ message: string }>> => {
    const response = await localAPI.post(`/blogs/${id}/views`, data)
    return response.data
  },

  // Get blog revisions
  getBlogRevisions: async (id: string, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const key = `getBlogRevisions:${id}:${JSON.stringify(params)}`
    const cached = getCache(key)
    if (cached) return cached
    const response = await localAPI.get(`/blogs/${id}/revisions`, { params })
    setCache(key, response.data)
    return response.data
  },

  // Create blog revision
  createBlogRevision: async (id: string, revisionData: { content: string; version: string }): Promise<ApiResponse<any>> => {
    const response = await localAPI.post(`/blogs/${id}/revisions`, revisionData)
    return response.data
  },

  // Get specific blog revision
  getBlogRevision: async (id: string, version: string): Promise<ApiResponse<any>> => {
    const key = `getBlogRevision:${id}:${version}`
    const cached = getCache(key)
    if (cached) return cached
    const response = await localAPI.get(`/blogs/${id}/revisions/${version}`)
    setCache(key, response.data)
    return response.data
  },

  // Get blog statistics
  getBlogStats: async (): Promise<ApiResponse<any>> => {
    const key = `getBlogStats`
    const cached = getCache(key)
    if (cached) return cached
    const response = await localAPI.get('/blogs/stats')
    setCache(key, response.data)
    return response.data
  }
} 