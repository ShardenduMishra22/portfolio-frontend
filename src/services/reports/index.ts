import backendAPI from '../api'
import {
  ApiResponse,
  Report,
  CreateReportRequest,
  UpdateReportStatusRequest,
  PaginationParams,
  PaginatedResponse,
} from '../types'

export const reportsService = {
  // Get all reports with pagination
  getReports: async (
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Report>>> => {
    const response = await backendAPI.get('/reports', { params })
    return response.data
  },

  // Get report by ID
  getReportById: async (id: string): Promise<ApiResponse<Report>> => {
    const response = await backendAPI.get(`/reports/${id}`)
    return response.data
  },

  // Create new report
  createReport: async (reportData: CreateReportRequest): Promise<ApiResponse<Report>> => {
    const response = await backendAPI.post('/reports', reportData)
    return response.data
  },

  // Update report status
  updateReportStatus: async (
    id: string,
    statusData: UpdateReportStatusRequest
  ): Promise<ApiResponse<Report>> => {
    const response = await backendAPI.put(`/reports/${id}/status`, statusData)
    return response.data
  },
}
