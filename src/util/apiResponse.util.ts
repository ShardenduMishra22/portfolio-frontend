import api from './api'
import {
  ApiResponse,
  AuthRequest,
  SkillsRequest,
  SkillsResponse,
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  Experience,
  CreateExperienceRequest,
  UpdateExperienceRequest,
  Certification,
  CreateCertificationRequest,
  UpdateCertificationRequest,
} from '../data/types.data'

export const authAPI = {
  login: async (credentials: AuthRequest): Promise<any> => {
    const response = await api.post('/api/admin/auth', credentials)
    return response.data
  },
}

// Skills API
export const skillsAPI = {
  getSkills: async (): Promise<ApiResponse<SkillsResponse>> => {
    console.log('API Base URL:', api.defaults.baseURL)
    console.log('Making request to: /api/skills')
    const response = await api.get('/api/skills')
    return response.data
  },

  addSkills: async (skills: SkillsRequest): Promise<ApiResponse<SkillsResponse>> => {
    const response = await api.post('/api/skills', skills)
    return response.data
  },
}

// Projects API
export const projectsAPI = {
  getAllProjects: async (): Promise<ApiResponse<Project[]>> => {
    const response = await api.get('/api/projects')
    return response.data
  },

  getProjectById: async (id: string): Promise<ApiResponse<Project>> => {
    const response = await api.get(`/api/projects/${id}`)
    return response.data
  },

  createProject: async (project: CreateProjectRequest): Promise<ApiResponse<Project>> => {
    const response = await api.post('/api/projects', project)
    return response.data
  },

  updateProject: async (
    id: string,
    project: UpdateProjectRequest
  ): Promise<ApiResponse<Project>> => {
    const response = await api.put(`/api/projects/${id}`, project)
    return response.data
  },

  deleteProject: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/api/projects/${id}`)
    return response.data
  },
}

// Experiences API
export const experiencesAPI = {
  getAllExperiences: async (): Promise<ApiResponse<Experience[]>> => {
    const response = await api.get('/api/experiences')
    return response.data
  },

  getExperienceById: async (id: string): Promise<ApiResponse<Experience>> => {
    const response = await api.get(`/api/experiences/${id}`)
    return response.data
  },

  createExperience: async (
    experience: CreateExperienceRequest
  ): Promise<ApiResponse<Experience>> => {
    const response = await api.post('/api/experiences', experience)
    return response.data
  },

  updateExperience: async (
    id: string,
    experience: UpdateExperienceRequest
  ): Promise<ApiResponse<Experience>> => {
    const response = await api.put(`/api/experiences/${id}`, experience)
    return response.data
  },

  deleteExperience: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/api/experiences/${id}`)
    return response.data
  },
}

// Certifications API
export const certificationsAPI = {
  getAllCertifications: async (): Promise<ApiResponse<Certification[]>> => {
    const response = await api.get('/api/certifications')
    return response.data
  },

  getCertificationById: async (id: string): Promise<ApiResponse<Certification>> => {
    const response = await api.get(`/api/certifications/${id}`)
    return response.data
  },

  createCertification: async (
    cert: CreateCertificationRequest
  ): Promise<ApiResponse<Certification>> => {
    const response = await api.post('/api/certifications', cert)
    return response.data
  },

  updateCertification: async (
    id: string,
    cert: UpdateCertificationRequest
  ): Promise<ApiResponse<Certification>> => {
    const response = await api.put(`/api/certifications/${id}`, cert)
    return response.data
  },

  deleteCertification: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/api/certifications/${id}`)
    return response.data
  },
}

// Achievements API (alias for certifications if same contract)
export const achievementsAPI = certificationsAPI

// Test API
export const testAPI = {
  testEndpoint: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.get('/api/test')
    return response.data
  },
}
