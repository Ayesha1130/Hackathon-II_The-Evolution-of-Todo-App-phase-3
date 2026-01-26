import { render, screen } from '@testing-library/react'
import { TaskList } from '@/components/tasks/TaskList'
import type { Task } from '@/types'

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Check: () => <svg data-testid="check-icon" />,
  Trash2: () => <svg data-testid="trash-icon" />,
  Edit2: () => <svg data-testid="edit-icon" />,
}))

const mockTasks: Task[] = [
  {
    id: '1',
    user_id: 'user-1',
    description: 'Test task 1',
    priority: 'high',
    is_completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'user-1',
    description: 'Test task 2',
    priority: 'low',
    is_completed: true,
    created_at: new Date().toISOString(),
  },
]

describe('TaskList', () => {
  it('renders loading state', () => {
    render(<TaskList tasks={[]} isLoading={true} />)

    // Check for animate-pulse elements in loading skeleton
    const pulseElements = screen.getAllByText((_, element) =>
      element?.classList?.contains('animate-pulse')
    )
    expect(pulseElements.length).toBeGreaterThan(0)
  })

  it('renders empty state', () => {
    render(<TaskList tasks={[]} />)

    expect(screen.getByText('No tasks yet')).toBeInTheDocument()
    expect(screen.getByText('Add your first task to get started!')).toBeInTheDocument()
  })

  it('renders task items', () => {
    render(<TaskList tasks={mockTasks} />)

    expect(screen.getByText('Test task 1')).toBeInTheDocument()
    expect(screen.getByText('Test task 2')).toBeInTheDocument()
  })

  it('renders completed tasks with strikethrough', () => {
    render(<TaskList tasks={mockTasks} />)

    const completedTask = screen.getByText('Test task 2')
    expect(completedTask).toHaveClass('line-through')
  })

  it('renders active tasks without strikethrough', () => {
    render(<TaskList tasks={mockTasks} />)

    const activeTask = screen.getByText('Test task 1')
    expect(activeTask).not.toHaveClass('line-through')
  })

  it('passes callbacks to TaskItem', () => {
    const onEdit = jest.fn()
    const onToggle = jest.fn()
    const onDelete = jest.fn()
    const getPriorityVariant = jest.fn()

    render(
      <TaskList
        tasks={mockTasks}
        onEdit={onEdit}
        onToggle={onToggle}
        onDelete={onDelete}
        getPriorityVariant={getPriorityVariant}
      />
    )

    expect(screen.getByText('Test task 1')).toBeInTheDocument()
  })
})
