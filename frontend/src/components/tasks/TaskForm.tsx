'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input } from '@/components/ui'
import { useCreateTask, useUpdateTask, useCategories } from '@/hooks'
import type { Task, TaskPriority } from '@/types'

const taskSchema = z.object({
  description: z.string().min(1, 'Description is required').max(1000),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskFormProps {
  task?: Task | null
  onClose: () => void
  onSuccess?: () => void
}

export function TaskForm({ task, onClose, onSuccess }: TaskFormProps) {
  const isEditing = !!task
  const createMutation = useCreateTask()
  const updateMutation = useUpdateTask()
  const { data: categories } = useCategories()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      description: task?.description || '',
      priority: (task?.priority as TaskPriority) || 'medium',
    },
  })

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: task.id,
          data: {
            description: data.description,
            priority: data.priority,
          },
        })
      } else {
        await createMutation.mutateAsync({
          description: data.description,
          priority: data.priority,
        })
      }
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Failed to save task:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          placeholder="What needs to be done?"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          rows={3}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-danger-500">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Priority
        </label>
        <div className="flex gap-2">
          {(['high', 'medium', 'low'] as const).map((priority) => (
            <label
              key={priority}
              className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors"
            >
              <input
                type="radio"
                value={priority}
                {...register('priority')}
                className="sr-only"
              />
              <span
                className={`w-3 h-3 rounded-full ${
                  priority === 'high'
                    ? 'bg-danger-500'
                    : priority === 'medium'
                    ? 'bg-warning-500'
                    : 'bg-success-500'
                }`}
              />
              <span className="text-sm capitalize">{priority}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          className="flex-1"
          isLoading={createMutation.isPending || updateMutation.isPending}
        >
          {isEditing ? 'Save Changes' : 'Add Task'}
        </Button>
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
