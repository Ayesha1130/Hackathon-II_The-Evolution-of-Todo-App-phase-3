import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { ApiError } from '@/types'

//const API_URL = 'http://localhost:8000'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiClient {
  private client: AxiosInstance
  private accessToken: string | null = null
  private refreshToken: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api/v1`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    this.loadTokens();

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for error handling and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        // Handle 401 Unauthorized - try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          if (this.refreshToken) {
            try {
              const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
                refresh_token: this.refreshToken,
              })

              const { access_token, refresh_token } = response.data
              this.setTokens(access_token, refresh_token)

              originalRequest.headers.Authorization = `Bearer ${access_token}`
              return this.client(originalRequest)
            } catch (refreshError) {
              // Refresh failed - clear tokens and redirect to login
              this.clearTokens()
              window.location.href = '/login'
              return Promise.reject(refreshError)
            }
          }
        }

        return Promise.reject(error)
      }
    )
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    }
  }

  clearTokens() {
    this.accessToken = null
    this.refreshToken = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }

  loadTokens() {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      if (accessToken && refreshToken) {
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        return true
      }
    }
    return false
  }

  getAccessToken() {
    return this.accessToken
  }

  isAuthenticated() {
    return !!this.accessToken
  }

  // Auth endpoints
  async signup(data: { email: string; password: string; confirm_password: string }) {
    const response = await this.client.post('/auth/signup', data)
    return response.data
  }

  async login(data: { email: string; password: string }) {
    const response = await this.client.post('/auth/login', data)
    const { access_token, refresh_token } = response.data
    this.setTokens(access_token, refresh_token)
    return response.data
  }

  async logout() {
    try {
      await this.client.post('/auth/logout')
    } finally {
      this.clearTokens()
    }
  }

  async getMe() {
    const response = await this.client.get('/auth/me')
    return response.data
  }

  // Task endpoints
  async getTasks(params?: { category_id?: string; status?: string }) {
    const response = await this.client.get('/tasks', { params })
    return response.data
  }

  async getTask(id: string) {
    const response = await this.client.get(`/tasks/${id}`)
    return response.data
  }

  async createTask(data: { description: string; priority?: string; category_id?: string }) {
    const response = await this.client.post('/tasks', data)
    return response.data
  }

  async updateTask(id: string, data: Partial<{ description: string; priority: string; category_id: string }>) {
    const response = await this.client.put(`/tasks/${id}`, data)
    return response.data
  }

  async toggleTask(id: string, is_completed: boolean) {
    const response = await this.client.patch(`/tasks/${id}/toggle`, { is_completed })
    return response.data
  }

  async deleteTask(id: string) {
    const response = await this.client.delete(`/tasks/${id}`)
    return response.data
  }

  // Category endpoints
  async getCategories() {
    const response = await this.client.get('/categories')
    return response.data
  }

  async createCategory(data: { name: string; color?: string }) {
    const response = await this.client.post('/categories', data)
    return response.data
  }

  async updateCategory(id: string, data: Partial<{ name: string; color: string }>) {
    const response = await this.client.put(`/categories/${id}`, data)
    return response.data
  }

  async deleteCategory(id: string) {
    const response = await this.client.delete(`/categories/${id}`)
    return response.data
  }

  async getStats() {
    const response = await this.client.get('/stats')
    return response.data
  }

  // Yahan add karein
  async sendMessage(message: string) {
    // Note: Agar backend terminal mein 404 aaye, toh niche '/chat/' try karein (slash ke sath)
    const response = await this.client.post('/chat/', { message })
    return response.data
  }
}

export const api = new ApiClient()
