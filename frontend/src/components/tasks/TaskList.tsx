'use client'

import { TaskItem } from './TaskItem'
import type { Task } from '@/types'

interface TaskListProps {
  tasks: Task[]
  onEdit?: (task: Task) => void
  onToggle?: (task: Task) => void
  onDelete?: (taskId: string) => void
  getPriorityVariant?: (priority: string) => 'high' | 'medium' | 'low'
  isLoading?: boolean
}

export function TaskList({
  tasks,
  onEdit,
  onToggle,
  onDelete,
  getPriorityVariant,
  isLoading,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 bg-slate-100 rounded-xl animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-1">No tasks yet</h3>
        <p className="text-slate-500">Add your first task to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onToggle={onToggle}
          onDelete={onDelete}
          getPriorityVariant={getPriorityVariant}
        />
      ))}
    </div>
  )
}
