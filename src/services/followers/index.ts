import backendAPI from '../api'
import { ApiResponse } from '../types'

export const followersService = {
  // Follow user (alias for usersService.followUser)
  followUser: async (userId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.post(`/users/${userId}/follow`)
    return response.data
  },

  // Unfollow user (alias for usersService.unfollowUser)
  unfollowUser: async (userId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.post(`/users/${userId}/unfollow`)
    return response.data
  }
} 