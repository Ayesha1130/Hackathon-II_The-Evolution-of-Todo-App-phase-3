// User types
export interface User {
  id: string
  email: string
  is_active: boolean
  is_superuser?: boolean
  created_at: string
  updated_at?: string
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

// Token types
export interface Token {
  access_token: string
  refresh_token: string
  token_type: string
}

// Task types
export type TaskPriority = 'high' | 'medium' | 'low'

export interface Task {
  id: string
  user_id: string
  category_id?: string
  description: string
  priority: TaskPriority
  is_completed: boolean
  created_at: string
  updated_at?: string
  category?: Category
}

export interface TaskCreate {
  description: string
  priority?: TaskPriority
  category_id?: string
}

export interface TaskUpdate {
  description?: string
  priority?: TaskPriority
  category_id?: string
  is_completed?: boolean
}

// Category types
export interface Category {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
  updated_at?: string
}

export interface CategoryCreate {
  name: string
  color?: string
}

export interface CategoryUpdate {
  name?: string
  color?: string
}

// API Error type
export interface ApiError {
  error?: {
    code?: string
    message?: string
    details?: Array<{
      field?: string
      message?: string
      type?: string
    }>
  }
}
