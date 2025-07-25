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
    const response = await api.post('/admin/auth', credentials)
    return response.data
  },
}

// Skills API
export const skillsAPI = {
  getSkills: async (): Promise<ApiResponse<SkillsResponse>> => {
    const key = 'getSkills'
    const cached = getCache(key)
    if (cached) return cached
    const response = await api.get('/skills')
    setCache(key, response.data)
    return response.data
  },

  addSkills: async (skills: SkillsRequest): Promise<ApiResponse<SkillsResponse>> => {
    const response = await api.post('/skills', skills)
    return response.data
  },
}

// Projects API
export const projectsAPI = {
  getAllProjects: async (): Promise<ApiResponse<Project[]>> => {
    const key = 'getAllProjects'
    const cached = getCache(key)
    if (cached) return cached
    const response = await api.get('/projects')
    setCache(key, response.data)
    return response.data
  },

  getProjectById: async (id: string): Promise<ApiResponse<Project>> => {
    const key = `getProjectById:${id}`
    const cached = getCache(key)
    if (cached) return cached
    const response = await api.get(`/projects/${id}`)
    setCache(key, response.data)
    return response.data
  },

  createProject: async (project: CreateProjectRequest): Promise<ApiResponse<Project>> => {
    const response = await api.post('/projects', project)
    return response.data
  },

  updateProject: async (id: string, project: UpdateProjectRequest): Promise<ApiResponse<Project>> => {
    const response = await api.put(`/projects/${id}`, project)
    return response.data
  },

  deleteProject: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/projects/${id}`)
    return response.data
  },
}

// Experiences API
export const experiencesAPI = {
  getAllExperiences: async (): Promise<ApiResponse<Experience[]>> => {
    const key = 'getAllExperiences'
    const cached = getCache(key)
    if (cached) return cached
    const response = await api.get('/experiences')
    setCache(key, response.data)
    return response.data
  },

  getExperienceById: async (id: string): Promise<ApiResponse<Experience>> => {
    const key = `getExperienceById:${id}`
    const cached = getCache(key)
    if (cached) return cached
    const response = await api.get(`/experiences/${id}`)
    setCache(key, response.data)
    return response.data
  },

  createExperience: async (experience: CreateExperienceRequest): Promise<ApiResponse<Experience>> => {
    const response = await api.post('/experiences', experience)
    return response.data
  },

  updateExperience: async (id: string, experience: UpdateExperienceRequest): Promise<ApiResponse<Experience>> => {
    const response = await api.put(`/experiences/${id}`, experience)
    return response.data
  },

  deleteExperience: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/experiences/${id}`)
    return response.data
  },
}

// Certifications API
export const certificationsAPI = {
  getAllCertifications: async (): Promise<ApiResponse<Certification[]>> => {
    const key = 'getAllCertifications'
    const cached = getCache(key)
    if (cached) return cached
    const response = await api.get('/certifications')
    setCache(key, response.data)
    return response.data
  },

  getCertificationById: async (id: string): Promise<ApiResponse<Certification>> => {
    const key = `getCertificationById:${id}`
    const cached = getCache(key)
    if (cached) return cached
    const response = await api.get(`/certifications/${id}`)
    setCache(key, response.data)
    return response.data
  },

  createCertification: async (cert: CreateCertificationRequest): Promise<ApiResponse<Certification>> => {
    const response = await api.post('/certifications', cert)
    return response.data
  },

  updateCertification: async (id: string, cert: UpdateCertificationRequest): Promise<ApiResponse<Certification>> => {
    const response = await api.put(`/certifications/${id}`, cert)
    return response.data
  },

  deleteCertification: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/certifications/${id}`)
    return response.data
  },
}

// Achievements API (alias for certifications if same contract)
export const achievementsAPI = certificationsAPI;

// Test API
export const testAPI = {
  testEndpoint: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.get('/test')
    return response.data
  },
}

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