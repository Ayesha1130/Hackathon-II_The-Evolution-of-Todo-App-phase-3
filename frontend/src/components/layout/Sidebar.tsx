'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { useCategories, useTaskStats } from '@/hooks'
import type { Category } from '@/types'

interface SidebarProps {
  user?: { email: string } | null
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const { data: categories } = useCategories()
  const { data: stats } = useTaskStats()

  const navItems = [
    {
      label: 'All Tasks',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
  ]

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] hidden lg:block">
      <div className="p-4">
        {/* User info */}
        {user && (
          <div className="mb-6 px-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium">
                  {user.email[0].toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 truncate max-w-[150px]">
                  {user.email}
                </p>
                <p className="text-xs text-slate-500">
                  {stats?.total_tasks || 0} tasks
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick stats */}
        <div className="mb-6 px-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">{stats?.completed_tasks || 0}</p>
              <p className="text-xs text-slate-500">Completed</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">{stats?.active_tasks || 0}</p>
              <p className="text-xs text-slate-500">Active</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}

          {/* Categories */}
          {categories && categories.length > 0 && (
            <div className="pt-4 mt-4 border-t border-slate-100">
              <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Categories
              </p>
              {categories.map((category: Category) => (
                <Link
                  key={category.id}
                  href={`/dashboard?category=${category.id}`}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </nav>
      </div>
    </aside>
  )
}
