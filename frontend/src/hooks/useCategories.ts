import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import type { Category, CategoryCreate, CategoryUpdate } from '@/types'

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
}

// Hook to get all categories
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => api.getCategories(),
    enabled: api.isAuthenticated(),
  })
}

// Hook to create a category
export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CategoryCreate) => api.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
  })
}

// Hook to update a category
export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryUpdate }) =>
      api.updateCategory(id, data),
    onSuccess: (updatedCategory: Category) => {
      queryClient.setQueryData(
        categoryKeys.detail(updatedCategory.id),
        updatedCategory
      )
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
  })
}

// Hook to delete a category
export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: categoryKeys.detail(deletedId) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
  })
}
