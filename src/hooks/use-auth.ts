'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '../util/apiResponse.util'
import { AuthRequest } from '../data/types.data'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: AuthRequest) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  setLoading: (loading: boolean) => void
}

// Helper to normalize user object

/**
 * Zustand store for authentication state and actions.
 * Handles login, logout, and loading state, and persists auth info.
 */
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      isLoading: false,

      /**
       * Attempts to log in with the provided credentials.
       * On success, saves user and token, sets isAuthenticated.
       * On failure, returns a detailed error message.
       */
      login: async (credentials: AuthRequest) => {
        set({ isLoading: true })
        try {
          const response = await authAPI.login(credentials)

          // Defensive checks for backend response shape
          if (!response || typeof response !== 'object') {
            console.error('Login failed: No response or invalid response object')
            set({ isLoading: false })
            return { success: false, error: 'No response from server.' }
          }

          if (response.error) {
            console.error('Login failed:', response.error)
            set({ isLoading: false })
            return { success: false, error: response.error || 'Login failed. Please try again.' }
          }

          // Extract token from top-level, user from data
          const token = response.token
          if (!token) {
            console.error('Login failed: Missing token in response', response)
            set({ isLoading: false })
            return { success: false, error: 'Invalid server response. Please contact support.' }
          }
          
          // Store token in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('jwt_token', token)
          }

          set({
            token,
            isAuthenticated: true,
            isLoading: false,
          })
          return { success: true }
        } catch (error: any) {
          let errorMsg = 'Login error. Please try again.'
          if (error?.response?.data?.error) {
            errorMsg = error.response.data.error
          } else if (error?.message) {
            errorMsg = error.message
          }
          console.error('Login error:', error)
          set({ isLoading: false })
          return { success: false, error: errorMsg }
        }
      },

      /**
       * Logs out the user, clears all auth state and localStorage.
       */
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jwt_token')
          // Redirect to home page after logout
          window.location.href = '/'
        }
        set({
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      /**
       * Sets the loading state for auth actions.
       */
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
) 