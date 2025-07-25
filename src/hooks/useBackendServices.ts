import { useState, useCallback } from 'react'
import { 
  authService, 
  usersService, 
  blogsService, 
  categoriesService,
  notificationsService,
  reportsService,
  type ApiResponse 
} from '@/services'

interface ServiceState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export const useBackendServices = () => {
  const [state, setState] = useState<ServiceState<any>>({
    data: null,
    loading: false,
    error: null
  })

  const setStateIfChanged = (updater: (prev: ServiceState<any>) => ServiceState<any>) => {
    setState(prev => {
      const next = updater(prev)
      if (JSON.stringify(prev) === JSON.stringify(next)) return prev
      return next
    })
  }

  const executeService = useCallback(async <T>(
    serviceCall: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T> | null> => {
    setStateIfChanged(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await serviceCall()
      
      if (response.success) {
        setStateIfChanged(prev => ({ ...prev, data: response.data, loading: false }))
      } else {
        setStateIfChanged(prev => ({ 
          ...prev, 
          error: response.error || 'Operation failed', 
          loading: false 
        }))
      }
      
      return response
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setStateIfChanged(prev => ({ ...prev, error: errorMessage, loading: false }))
      return null
    }
  }, [])

  const clearState = useCallback(() => {
    setStateIfChanged(() => ({ data: null, loading: false, error: null }))
  }, [])

  return {
    ...state,
    executeService,
    clearState,
    
    // Auth services
    login: (credentials: { email: string; password: string }) =>
      executeService(() => authService.login(credentials)),
    
    register: (userData: { email: string; username: string; password: string }) =>
      executeService(() => authService.register(userData)),
    
    logout: () => executeService(() => authService.logout()),
    
    getCurrentUser: () => executeService(() => authService.getCurrentUser()),
    
    // User services
    getUsers: (params?: { page?: number; limit?: number; search?: string }) =>
      executeService(() => usersService.getUsers(params)),
    
    getUserById: (id: string) => executeService(() => usersService.getUserById(id)),
    
    createUser: (userData: { email: string; username: string; password: string }) =>
      executeService(() => usersService.createUser(userData)),
    
    updateUser: (id: string, userData: { email?: string; username?: string }) =>
      executeService(() => usersService.updateUser(id, userData)),
    
    deleteUser: (id: string) => executeService(() => usersService.deleteUser(id)),
    
    getUserProfile: (id: string) => executeService(() => usersService.getUserProfile(id)),
    
    updateUserProfile: (id: string, profileData: { bio?: string; avatar?: string; website?: string; location?: string }) =>
      executeService(() => usersService.updateUserProfile(id, profileData)),
    
    // Blog services
    getBlogs: (params?: { page?: number; limit?: number; search?: string }) =>
      executeService(() => blogsService.getBlogs(params)),
    
    getBlogById: (id: string) => executeService(() => blogsService.getBlogById(id)),
    
    createBlog: (blogData: { title: string; content: string; authorId: string; excerpt?: string; published?: boolean; categoryIds?: number[] }) =>
      executeService(() => blogsService.createBlog(blogData)),
    
    updateBlog: (id: string, blogData: { title?: string; content?: string; excerpt?: string; published?: boolean; categoryIds?: number[] }) =>
      executeService(() => blogsService.updateBlog(id, blogData)),
    
    deleteBlog: (id: string) => executeService(() => blogsService.deleteBlog(id)),
    
    likeBlog: (id: string, userId: string) => executeService(() => blogsService.likeBlog(id, { userId })),
    
    unlikeBlog: (id: string, userId: string) => executeService(() => blogsService.unlikeBlog(id, { userId })),
    
    bookmarkBlog: (id: string, userId: string) => executeService(() => blogsService.bookmarkBlog(id, { userId })),
    
    unbookmarkBlog: (id: string, userId: string) => executeService(() => blogsService.unbookmarkBlog(id, { userId })),
    
    addToHistory: (id: string, userId: string) => executeService(() => blogsService.addToHistory(id, { userId })),
    
    // Category services
    getCategories: (params?: { page?: number; limit?: number; search?: string }) =>
      executeService(() => categoriesService.getCategories(params)),
    
    getCategoryByParam: (param: string) => executeService(() => categoriesService.getCategoryByParam(param)),
    
    createCategory: (categoryData: { name: string; slug: string; description?: string }) =>
      executeService(() => categoriesService.createCategory(categoryData)),
    
    updateCategory: (id: string, categoryData: { name?: string; slug?: string; description?: string }) =>
      executeService(() => categoriesService.updateCategory(id, categoryData)),
    
    deleteCategory: (id: string) => executeService(() => categoriesService.deleteCategory(id)),
    
    // Notification services
    getNotificationById: (id: string) => executeService(() => notificationsService.getNotificationById(id)),
    
    markNotificationRead: (id: string) => executeService(() => notificationsService.markNotificationRead(id)),
    
    deleteNotification: (id: string) => executeService(() => notificationsService.deleteNotification(id)),
    
    // Report services
    getReports: (params?: { page?: number; limit?: number; search?: string }) =>
      executeService(() => reportsService.getReports(params)),
    
    getReportById: (id: string) => executeService(() => reportsService.getReportById(id)),
    
    createReport: (reportData: { type: 'blog' | 'comment' | 'user'; reason: string; relatedId: number }) =>
      executeService(() => reportsService.createReport(reportData)),
    
    updateReportStatus: (id: string, statusData: { status: 'pending' | 'resolved' | 'dismissed' }) =>
      executeService(() => reportsService.updateReportStatus(id, statusData))
  }
} 