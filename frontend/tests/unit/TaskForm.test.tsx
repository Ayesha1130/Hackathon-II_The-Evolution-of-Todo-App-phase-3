import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TaskForm } from '@/components/tasks/TaskForm'
import type { Task } from '@/types'

// Mock hooks
jest.mock('@/hooks', () => ({
  useCreateTask: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
  useUpdateTask: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
  useCategories: () => ({
    data: [],
  }),
}))

const mockTask: Task = {
  id: '1',
  user_id: 'user-1',
  description: 'Test task',
  priority: 'medium',
  is_completed: false,
  created_at: '2024-01-01T00:00:00Z',
}

describe('TaskForm', () => {
  it('renders form fields', () => {
    render(<TaskForm onClose={jest.fn()} />)

    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument()
  })

  it('shows priority options', () => {
    render(<TaskForm onClose={jest.fn()} />)

    expect(screen.getByText('high')).toBeInTheDocument()
    expect(screen.getByText('medium')).toBeInTheDocument()
    expect(screen.getByText('low')).toBeInTheDocument()
  })

  it('shows default priority as medium', () => {
    render(<TaskForm onClose={jest.fn()} />)

    // Medium should be selected by default
    const mediumOption = screen.getByText('medium').closest('label')
    expect(mediumOption).toHaveStyle({ backgroundColor: expect.stringContaining('rgb') })
  })

  it('prefills data when editing task', () => {
    render(<TaskForm task={mockTask} onClose={jest.fn()} />)

    const descriptionInput = screen.getByPlaceholderText('What needs to be done?') as HTMLInputElement
    expect(descriptionInput.value).toBe('Test task')
  })

  it('shows "Save Changes" for edit mode', () => {
    render(<TaskForm task={mockTask} onClose={jest.fn()} />)

    expect(screen.getByText('Save Changes')).toBeInTheDocument()
  })

  it('shows "Add Task" for create mode', () => {
    render(<TaskForm onClose={jest.fn()} />)

    expect(screen.getByText('Add Task')).toBeInTheDocument()
  })

  it('calls onClose when cancel is clicked', () => {
    const onClose = jest.fn()
    render(<TaskForm onClose={onClose} />)

    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(onClose).toHaveBeenCalled()
  })

  it('validates description is required', async () => {
    render(<TaskForm onClose={jest.fn()} />)

    const submitButton = screen.getByText('Add Task')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Description is required')).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const mutateAsync = jest.fn()
    const onClose = jest.fn()
    const onSuccess = jest.fn()

    jest.spyOn(require('@/hooks'), 'useCreateTask').mockReturnValue({
      mutateAsync,
      isPending: false,
    })

    render(<TaskForm onClose={onClose} onSuccess={onSuccess} />)

    const input = screen.getByPlaceholderText('What needs to be done?')
    fireEvent.change(input, { target: { value: 'New task description' } })

    const submitButton = screen.getByText('Add Task')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        description: 'New task description',
        priority: 'medium',
      })
    })
  })

  it('disables submit button when pending', async () => {
    jest.spyOn(require('@/hooks'), 'useCreateTask').mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: true,
    })

    render(<TaskForm onClose={jest.fn()} />)

    await waitFor(() => {
      const submitButton = screen.getByText('Add Task').closest('button')
      expect(submitButton).toBeDisabled()
      // Check for spinner
      expect(submitButton?.querySelector('svg.animate-spin')).toBeInTheDocument()
    })
  })
})
