import backendAPI from '../api'
import { ApiResponse, User, CreateUserRequest, UpdateUserRequest, Profile, UpdateProfileRequest, PaginationParams, PaginatedResponse } from '../types'

export const usersService = {
  // Get all users with pagination
  getUsers: async (params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const response = await backendAPI.get('/users', { params })
    return response.data
  },

  // Get user by ID
  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await backendAPI.get(`/users/${id}`)
    return response.data
  },

  // Create new user
  createUser: async (userData: CreateUserRequest): Promise<ApiResponse<User>> => {
    const response = await backendAPI.post('/users', userData)
    return response.data
  },

  // Update user
  updateUser: async (id: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> => {
    const response = await backendAPI.put(`/users/${id}`, userData)
    return response.data
  },

  // Delete user
  deleteUser: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.delete(`/users/${id}`)
    return response.data
  },

  // Get user profile
  getUserProfile: async (id: string): Promise<ApiResponse<Profile>> => {
    const response = await backendAPI.get(`/users/${id}/profile`)
    return response.data
  },

  // Update user profile
  updateUserProfile: async (id: string, profileData: UpdateProfileRequest): Promise<ApiResponse<Profile>> => {
    const response = await backendAPI.put(`/users/${id}/profile`, profileData)
    return response.data
  },

  // Get user bookmarks
  getUserBookmarks: async (id: string, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const response = await backendAPI.get(`/users/${id}/bookmarks`, { params })
    return response.data
  },

  // Get user history
  getUserHistory: async (id: string, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const response = await backendAPI.get(`/users/${id}/history`, { params })
    return response.data
  },

  // Get user notifications
  getUserNotifications: async (id: string, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const response = await backendAPI.get(`/users/${id}/notifications`, { params })
    return response.data
  },

  // Follow user
  followUser: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.post(`/users/${id}/follow`)
    return response.data
  },

  // Unfollow user
  unfollowUser: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.post(`/users/${id}/unfollow`)
    return response.data
  },

  // Get user followers
  getUserFollowers: async (id: string, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const response = await backendAPI.get(`/users/${id}/followers`, { params })
    return response.data
  },

  // Get user following
  getUserFollowing: async (id: string, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> => {
    const response = await backendAPI.get(`/users/${id}/following`, { params })
    return response.data
  }
} 