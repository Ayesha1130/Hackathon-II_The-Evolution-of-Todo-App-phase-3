import { HTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'high' | 'medium' | 'low'
  size?: 'sm' | 'md'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'sm', ...props }, ref) => {
    const variants = {
      default: 'bg-slate-100 text-slate-700',
      success: 'bg-success-100 text-success-600',
      warning: 'bg-warning-100 text-warning-600',
      danger: 'bg-danger-100 text-danger-600',
      high: 'bg-danger-100 text-danger-600',
      medium: 'bg-warning-100 text-warning-600',
      low: 'bg-success-100 text-success-600',
    }

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
    }

    return (
      <span
        ref={ref}
        className={twMerge(
          'inline-flex items-center font-medium rounded-full',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'
