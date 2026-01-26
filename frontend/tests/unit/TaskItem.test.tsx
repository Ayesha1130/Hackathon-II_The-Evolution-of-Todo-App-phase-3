import { render, screen, fireEvent } from '@testing-library/react'
import { TaskItem } from '@/components/tasks/TaskItem'
import type { Task } from '@/types'

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Check: () => <svg data-testid="check-icon" />,
  Trash2: () => <svg data-testid="trash-icon" />,
  Edit2: () => <svg data-testid="edit-icon" />,
}))

const mockTask: Task = {
  id: '1',
  user_id: 'user-1',
  description: 'Test task',
  priority: 'high',
  is_completed: false,
  created_at: '2024-01-01T00:00:00Z',
}

describe('TaskItem', () => {
  it('renders task description', () => {
    render(<TaskItem task={mockTask} />)

    expect(screen.getByText('Test task')).toBeInTheDocument()
  })

  it('renders priority badge', () => {
    render(<TaskItem task={mockTask} />)

    expect(screen.getByText('high')).toBeInTheDocument()
  })

  it('renders created date', () => {
    render(<TaskItem task={mockTask} />)

    expect(screen.getByText('1/1/2024')).toBeInTheDocument()
  })

  it('shows completed state with checkmark', () => {
    const completedTask = { ...mockTask, is_completed: true }
    render(<TaskItem task={completedTask} />)

    expect(screen.getByTestId('check-icon')).toBeInTheDocument()
  })

  it('applies strikethrough for completed tasks', () => {
    const completedTask = { ...mockTask, is_completed: true }
    render(<TaskItem task={completedTask} />)

    expect(screen.getByText('Test task')).toHaveClass('line-through')
  })

  it('calls onToggle when checkbox is clicked', () => {
    const onToggle = jest.fn()
    render(<TaskItem task={mockTask} onToggle={onToggle} />)

    // Get the checkbox button (first button)
    const buttons = screen.getAllByRole('button')
    const checkbox = buttons[0]
    fireEvent.click(checkbox)

    expect(onToggle).toHaveBeenCalledWith(mockTask)
  })

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn()
    render(<TaskItem task={mockTask} onEdit={onEdit} />)

    const editButton = screen.getByTestId('edit-icon').closest('button')
    fireEvent.click(editButton!)

    expect(onEdit).toHaveBeenCalledWith(mockTask)
  })

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = jest.fn()
    window.confirm = jest.fn(() => true)
    render(<TaskItem task={mockTask} onDelete={onDelete} />)

    const deleteButton = screen.getByTestId('trash-icon').closest('button')
    fireEvent.click(deleteButton!)

    expect(onDelete).toHaveBeenCalledWith(mockTask.id)
  })

  it('disables edit button for completed tasks', () => {
    const completedTask = { ...mockTask, is_completed: true }
    const onEdit = jest.fn()
    render(<TaskItem task={completedTask} onEdit={onEdit} />)

    const editButton = screen.getByTestId('edit-icon').closest('button')
    expect(editButton).toBeDisabled()
  })

  it('uses custom priority variant function', () => {
    const getPriorityVariant = jest.fn(() => 'low')
    render(<TaskItem task={mockTask} getPriorityVariant={getPriorityVariant} />)

    expect(getPriorityVariant).toHaveBeenCalledWith('high')
  })
})
