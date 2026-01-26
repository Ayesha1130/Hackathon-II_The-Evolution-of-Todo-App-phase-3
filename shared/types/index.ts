// ==================== User Types ====================

export interface User {
  id: string
  email: string
  is_active: boolean
  is_superuser: boolean
  created_at: string
  updated_at: string
}

export interface UserCreate {
  email: string
  password: string
  confirm_password: string
}

export interface UserLogin {
  email: string
  password: string
}

export interface UserResponse {
  id: string
  email: string
  is_active: boolean
  created_at: string
}

// ==================== Task Types ====================

export type TaskPriority = 'high' | 'medium' | 'low'

export interface Task {
  id: string
  user_id: string
  category_id: string | null
  description: string
  priority: TaskPriority
  is_completed: boolean
  created_at: string
  updated_at: string
}

export interface TaskCreate {
  description: string
  priority?: TaskPriority
  category_id?: string | null
}

export interface TaskUpdate {
  description?: string
  priority?: TaskPriority
  category_id?: string | null
  is_completed?: boolean
}

export interface TaskToggle {
  is_completed: boolean
}

// ==================== Category Types ====================

export interface Category {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

export interface CategoryCreate {
  name: string
  color?: string
}

export interface CategoryUpdate {
  name?: string
  color?: string
}

// ==================== Auth Types ====================

export interface Token {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// ==================== Stats Types ====================

export interface TaskStats {
  total_tasks: number
  completed_tasks: number
  active_tasks: number
  completion_percentage: number
  by_priority: {
    high: number
    medium: number
    low: number
  }
}

// ==================== API Types ====================

export interface ApiError {
  detail: string
  status_code?: number
}

export interface Message {
  message: string
}

// ==================== Filter Types ====================

export type StatusFilter = 'all' | 'active' | 'completed'

export interface TaskFilters {
  category_id?: string
  status?: StatusFilter
}
