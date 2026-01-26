import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import type { Task, TaskCreate, TaskUpdate, TaskFilters } from '@/types'

// Query keys
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: TaskFilters) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
  stats: () => [...taskKeys.all, 'stats'] as const,
}

// Hook to get all tasks with optional filters
export function useTasks(filters: TaskFilters = {}) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => api.getTasks(filters),
    enabled: api.isAuthenticated(),
  })
}

// Hook to get a single task
export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => api.getTask(id),
    enabled: !!id && api.isAuthenticated(),
  })
}

// Hook to create a task
export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TaskCreate) => api.createTask(data),
    onSuccess: () => {
      // Invalidate all task lists and stats
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() })
    },
  })
}

// Hook to update a task
export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskUpdate }) =>
      api.updateTask(id, data),
    onSuccess: (updatedTask: Task) => {
      // Update the specific task in cache
      queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask)
      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() })
    },
  })
}

// Hook to toggle task completion
export function useToggleTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isCompleted }: { id: string; isCompleted: boolean }) =>
      api.toggleTask(id, isCompleted),
    onSuccess: (updatedTask: Task) => {
      // Update the specific task in cache
      queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask)
      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() })
    },
  })
}

// Hook to delete a task
export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteTask(id),
    onSuccess: (_, deletedId) => {
      // Remove the task from cache
      queryClient.removeQueries({ queryKey: taskKeys.detail(deletedId) })
      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() })
    },
  })
}
