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
    const response = await api.get<ApiResponse<SkillsResponse>>('/skills')
    return response.data as ApiResponse<SkillsResponse>
  },

  addSkills: async (skills: SkillsRequest): Promise<ApiResponse<SkillsResponse>> => {
    const response = await api.post<ApiResponse<SkillsResponse>>('/skills', skills)
    return response.data as ApiResponse<SkillsResponse>
  },
}

// Projects API
export const projectsAPI = {
  getAllProjects: async (): Promise<ApiResponse<Project[]>> => {
    const response = await api.get<ApiResponse<Project[]>>('/projects')
    return response.data as ApiResponse<Project[]>
  },

  getProjectById: async (id: string): Promise<ApiResponse<Project>> => {
    const response = await api.get<ApiResponse<Project>>(`/projects/${id}`)
    return response.data as ApiResponse<Project>
  },

  createProject: async (project: CreateProjectRequest): Promise<ApiResponse<Project>> => {
    const response = await api.post<ApiResponse<Project>>('/projects', project)
    return response.data as ApiResponse<Project>
  },

  updateProject: async (id: string, project: UpdateProjectRequest): Promise<ApiResponse<Project>> => {
    const response = await api.put<ApiResponse<Project>>(`/projects/${id}`, project)
    return response.data as ApiResponse<Project>
  },

  deleteProject: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/projects/${id}`)
    return response.data as ApiResponse<{ message: string }>
  },
}

// Experiences API
export const experiencesAPI = {
  getAllExperiences: async (): Promise<ApiResponse<Experience[]>> => {
    const response = await api.get<ApiResponse<Experience[]>>('/experiences')
    return response.data as ApiResponse<Experience[]>
  },

  getExperienceById: async (id: string): Promise<ApiResponse<Experience>> => {
    const response = await api.get<ApiResponse<Experience>>(`/experiences/${id}`)
    return response.data as ApiResponse<Experience>
  },

  createExperience: async (experience: CreateExperienceRequest): Promise<ApiResponse<Experience>> => {
    const response = await api.post<ApiResponse<Experience>>('/experiences', experience)
    return response.data as ApiResponse<Experience>
  },

  updateExperience: async (id: string, experience: UpdateExperienceRequest): Promise<ApiResponse<Experience>> => {
    const response = await api.put<ApiResponse<Experience>>(`/experiences/${id}`, experience)
    return response.data as ApiResponse<Experience>
  },

  deleteExperience: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/experiences/${id}`)
    return response.data as ApiResponse<{ message: string }>
  },
}

// Certifications API
export const certificationsAPI = {
  getAllCertifications: async (): Promise<ApiResponse<Certification[]>> => {
    const response = await api.get<ApiResponse<Certification[]>>('/certifications')
    return response.data as ApiResponse<Certification[]>
  },

  getCertificationById: async (id: string): Promise<ApiResponse<Certification>> => {
    const response = await api.get<ApiResponse<Certification>>(`/certifications/${id}`)
    return response.data as ApiResponse<Certification>
  },

  createCertification: async (cert: CreateCertificationRequest): Promise<ApiResponse<Certification>> => {
    const response = await api.post<ApiResponse<Certification>>('/certifications', cert)
    return response.data as ApiResponse<Certification>
  },

  updateCertification: async (id: string, cert: UpdateCertificationRequest): Promise<ApiResponse<Certification>> => {
    const response = await api.put<ApiResponse<Certification>>(`/certifications/${id}`, cert)
    return response.data as ApiResponse<Certification>
  },

  deleteCertification: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/certifications/${id}`)
    return response.data as ApiResponse<{ message: string }>
  },
}

// Achievements API (alias for certifications if same contract)
export const achievementsAPI = certificationsAPI;

// Test API
export const testAPI = {
  testEndpoint: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.get<ApiResponse<{ message: string }>>('/test')
    return response.data as ApiResponse<{ message: string }>
  },
}