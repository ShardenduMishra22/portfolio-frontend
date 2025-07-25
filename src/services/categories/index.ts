import backendAPI from '../api'
import {
  ApiResponse,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  PaginationParams,
  PaginatedResponse,
} from '../types'

export const categoriesService = {
  // Get all categories with pagination
  getCategories: async (
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Category>>> => {
    const response = await backendAPI.get('/categories', { params })
    return response.data
  },

  // Get category by ID or slug
  getCategoryByParam: async (param: string): Promise<ApiResponse<Category>> => {
    const response = await backendAPI.get(`/categories/${param}`)
    return response.data
  },

  // Create new category
  createCategory: async (categoryData: CreateCategoryRequest): Promise<ApiResponse<Category>> => {
    const response = await backendAPI.post('/categories', categoryData)
    return response.data
  },

  // Update category
  updateCategory: async (
    id: string,
    categoryData: UpdateCategoryRequest
  ): Promise<ApiResponse<Category>> => {
    const response = await backendAPI.put(`/categories/${id}`, categoryData)
    return response.data
  },

  // Delete category
  deleteCategory: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await backendAPI.delete(`/categories/${id}`)
    return response.data
  },
}
