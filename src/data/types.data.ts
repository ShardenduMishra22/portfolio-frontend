export interface CommitData {
  date: string
  count: number
}

export interface GitHubData {
  name?: string
  location?: string
  bio?: string
  followers: number
  public_repos: number
}

export interface LeetCodeData {
  profile: {
    realName?: string
    ranking: number
  }
  submitStats: {
    acSubmissionNum: Array<{ count: number }>
  }
}

export interface Repository {
  name: string
  url: string
  stars: number
}

export interface DashboardData {
  github?: GitHubData
  leetcode?: LeetCodeData
  commits?: CommitData[]
  languages?: Record<string, number>
  stars?: number
  topRepos?: Repository[]
}

export interface ChartTheme {
  text: string
  grid: string
  background: string
  primary: string
}

// API Response Types
export interface ApiResponse<T> {
  message: string
  data: T
  error?: string
}

// Authentication Types
export interface AuthRequest {
  email: string
  password: string
  admin_pass: string
}

export interface AuthResponse {
  token: string
  data: {
    _id: string
    email: string
    skills: string[]
    projects: string[]
    experiences: string[]
  }
}

// User Types
export interface User {
  email: string
  skills: string[]
  projects: string[]
  experiences: string[]
  certifications: string[]
}

// Skills Types
export interface SkillsRequest {
  skills: string[]
}

export interface SkillsResponse {
  skills: string[]
}

export interface ProfileData {
  inline: {
    id: string
    created_at: string
    updated_at: string
  }
  email: string
  password: string
  admin_pass: string
  skills: string[]
  projects: string[]
  experiences: string[]
  certifications?: string[] | null
}

// Project Types
export interface Project {
  title: string | undefined
  stats: any
  id: any
  images: never[]
  inline: any
  project_name: string
  small_description: string
  description: string
  skills: string[]
  project_repository: string
  project_live_link: string
  project_video: string
  created_at?: string
  updated_at?: string
}

export interface CreateProjectRequest {
  project_name: string
  small_description: string
  description: string
  skills: string[]
  project_repository: string
  project_live_link: string
  project_video: string
}

export type UpdateProjectRequest = CreateProjectRequest

// Experience Types
export interface Experience {
  inline: any
  company_name: string
  position: string
  start_date: string
  end_date: string
  description: string
  technologies: string[]
  company_logo: string
  certificate_url: string
  projects: string[]
  images: string[]
  created_at?: string
  updated_at?: string
}

export interface CreateExperienceRequest {
  company_name: string
  position: string
  start_date: string
  end_date: string
  description: string
  technologies: string[]
  company_logo: string
  certificate_url: string
  projects: string[]
  images: string[]
}

export type UpdateExperienceRequest = CreateExperienceRequest

// Certification Types
export interface Certification {
  inline: {
    id: string
    created_at: string
    updated_at: string
  }
  title: string
  description: string
  projects: string[]
  skills: string[]
  certificate_url: string
  images: string[]
  issuer: string
  issue_date: string
  expiry_date: string
}

export interface CreateCertificationRequest {
  title: string
  description: string
  issuer: string
  skills: string[]
  projects: string[]
  certificate_url: string
  images: string[]
  issue_date: string
  expiry_date: string
}

export type UpdateCertificationRequest = CreateCertificationRequest

// Achievement Types (if different, otherwise alias Certification)
export type Achievement = Certification
export type CreateAchievementRequest = CreateCertificationRequest
export type UpdateAchievementRequest = UpdateCertificationRequest
