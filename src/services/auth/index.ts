import backendAPI from '../api'
import { ApiResponse } from '../types'

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    username: string;
  };
  token: string;
}

export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await backendAPI.post('/auth/login', credentials)
    return response.data
  },

  // Register user
  register: async (userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await backendAPI.post('/auth/register', userData)
    return response.data
  },

  // Logout user
  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.post('/auth/logout')
    return response.data
  },

  // Get current user
  getCurrentUser: async (): Promise<ApiResponse<AuthResponse['user']>> => {
    const response = await backendAPI.get('/auth/me')
    return response.data
  },

  // Refresh token
  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    const response = await backendAPI.post('/auth/refresh')
    return response.data
  },

  // Verify token
  verifyToken: async (token: string): Promise<ApiResponse<{ valid: boolean }>> => {
    const response = await backendAPI.post('/auth/verify', { token })
    return response.data
  }
} 