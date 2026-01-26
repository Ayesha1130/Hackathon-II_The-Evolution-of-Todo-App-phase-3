import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { taskKeys } from './useTasks'
import type { TaskStats } from '@/types'

// Hook to get task statistics
export function useTaskStats() {
  return useQuery({
    queryKey: taskKeys.stats(),
    queryFn: () => api.getStats(),
    enabled: api.isAuthenticated(),
    staleTime: 30 * 1000, // 30 seconds
  })
}
