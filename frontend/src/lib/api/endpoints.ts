// API endpoint constants
export const API_ENDPOINTS = {
  // Auth
  SIGNUP: '/auth/signup',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',

  // Tasks
  TASKS: '/tasks',
  TASK_BY_ID: (id: string) => `/tasks/${id}`,
  TASK_TOGGLE: (id: string) => `/tasks/${id}/toggle`,

  // Categories
  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id: string) => `/categories/${id}`,

  // Stats
  STATS: '/stats',
  CHAT: '/chat',
} as const

// Environment variable keys
export const ENV_KEYS = {
  API_URL: 'NEXT_PUBLIC_API_URL',
  AUTH_URL: 'NEXT_PUBLIC_AUTH_URL',
} as const
