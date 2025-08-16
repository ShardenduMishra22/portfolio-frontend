import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_BACKEND_1 || process.env.BACKEND_1

const backendAPI = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add JWT token
backendAPI.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
backendAPI.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt_token')
        // Redirect to login page
        window.location.href = '/admin/login'
      }
    }
    console.error('Backend API Error:', error)
    return Promise.reject(error)
  }
)

export default backendAPI
