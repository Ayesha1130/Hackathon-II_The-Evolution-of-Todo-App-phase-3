import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import type { User, UserCreate, UserLogin, Token } from '@/types'

// Query keys
export const authKeys = {
  user: ['user'] as const,
}

// Hook to get current user
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: () => api.getMe(),
    enabled: api.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to check if user is authenticated
export function useIsAuthenticated() {
  const { data: user, isLoading } = useCurrentUser()
  return {
    user: user ?? null,
    isAuthenticated: !!user && !isLoading,
    isLoading,
  }
}

// Mutation for login
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UserLogin) => api.login(data),
    onSuccess: (data: Token) => {
      // Load tokens into API client
      api.loadTokens()
      // Invalidate user query to refetch
      queryClient.invalidateQueries({ queryKey: authKeys.user })
    },
    onError: (error: Error) => {
      console.error('Login failed:', error)
    },
  })
}

// Mutation for signup
export function useSignup() {
  return useMutation({
    mutationFn: (data: UserCreate) => api.signup(data),
    onError: (error: Error) => {
      console.error('Signup failed:', error)
    },
  })
}

// Mutation for logout
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => api.logout(),
    onSuccess: () => {
      // Clear user cache
      queryClient.clear()
      // Clear tokens from API client
      api.clearTokens()
    },
  })
}
