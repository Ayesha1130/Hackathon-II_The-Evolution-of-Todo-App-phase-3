'use client'

import { useState } from 'react'
import { Card, CardContent, Button } from '@/components/ui'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskForm } from '@/components/tasks/TaskForm'
import { Modal } from '@/components/ui/Modal'
import { useTasks, useTaskStats, useCreateTask, useToggleTask, useDeleteTask } from '@/hooks'
import { Plus, LayoutGrid, CheckCircle2, Clock, PieChart } from 'lucide-react'
import type { Task } from '@/types'

export default function DashboardPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)

  const { data: tasks, isLoading: tasksLoading } = useTasks({ status: statusFilter })
  const { data: stats } = useTaskStats()
  const toggleMutation = useToggleTask()
  const deleteMutation = useDeleteTask()

  const handleToggleTask = async (task: Task) => {
    await toggleMutation.mutateAsync({
      id: task.id,
      isCompleted: !task.is_completed,
    })
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    await deleteMutation.mutateAsync(taskId)
  }

  const getPriorityVariant = (priority: string): 'high' | 'medium' | 'low' => {
    switch (priority) {
      case 'high': return 'high'
      case 'medium': return 'medium'
      case 'low': return 'low'
      default: return 'medium'
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Dashboard</h1>
          <p className="text-emerald-600 font-medium italic mt-1">Keep growing, one task at a time.</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)} 
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl px-8 py-6 shadow-xl shadow-emerald-100 font-bold transition-all hover:-translate-y-1 active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<LayoutGrid size={20}/>} label="Total" value={stats.total_tasks} color="bg-white text-slate-800" />
          <StatCard icon={<CheckCircle2 size={20}/>} label="Done" value={stats.completed_tasks} color="bg-emerald-50 text-emerald-700" />
          <StatCard icon={<Clock size={20}/>} label="Active" value={stats.active_tasks} color="bg-emerald-100 text-emerald-800" />
          <StatCard icon={<PieChart size={20}/>} label="Progress" value={`${stats.completion_percentage}%`} color="bg-emerald-500 text-white shadow-lg shadow-emerald-200" />
        </div>
      )}

      {/* Filters & Content Area */}
      <div className="bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-emerald-50 p-6 md:p-10 shadow-2xl shadow-emerald-100/20">
        <div className="flex items-center gap-2 mb-8 bg-emerald-50/50 p-1.5 rounded-2xl w-fit">
          <FilterButton active={statusFilter === undefined} label="All" onClick={() => setStatusFilter(undefined)} />
          <FilterButton active={statusFilter === 'active'} label="Active" onClick={() => setStatusFilter('active')} />
          <FilterButton active={statusFilter === 'completed'} label="Completed" onClick={() => setStatusFilter('completed')} />
        </div>

        {/* Tasks List Component */}
        <div className="min-h-[400px]">
          <TaskList
            tasks={tasks || []}
            isLoading={tasksLoading}
            onEdit={setEditingTask}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
            getPriorityVariant={getPriorityVariant}
          />
        </div>
      </div>

      {/* Modals remain the same but will use the theme internally */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Task">
        <TaskForm onClose={() => setShowAddModal(false)} onSuccess={() => setShowAddModal(false)} />
      </Modal>

      <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title="Edit Task">
        {editingTask && (
          <TaskForm task={editingTask} onClose={() => setEditingTask(null)} onSuccess={() => setEditingTask(null)} />
        )}
      </Modal>
    </div>
  )
}

// Custom Styled Components for Cleanliness
function StatCard({ label, value, color, icon, shadow }: any) {
  return (
    <Card className={`${color} border-none rounded-[2rem] p-6 transition-transform hover:scale-105 duration-300`}>
      <div className="flex flex-col gap-1">
        <div className="opacity-80 mb-2">{icon}</div>
        <div className="text-3xl font-black tracking-tight">{value}</div>
        <div className="text-xs font-bold uppercase tracking-widest opacity-70">{label}</div>
      </div>
    </Card>
  )
}

function FilterButton({ active, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
        active 
          ? 'bg-white text-emerald-600 shadow-sm' 
          : 'text-slate-500 hover:text-emerald-500'
      }`}
    >
      {label}
    </button>
  )
}