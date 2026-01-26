'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api/client'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { useCurrentUser } from '@/hooks'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { data: user, isLoading } = useCurrentUser()

  useEffect(() => {
    // Check authentication
    const isAuthenticated = api.loadTokens()
    if (!isAuthenticated && !api.isAuthenticated()) {
      router.push('/login')
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  const handleLogout = async () => {
    await api.logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user || null} onLogout={handleLogout} />
      <div className="flex">
        <Sidebar user={user || null} />
        <main className="flex-1 p-6 lg:ml-0">
          {children}
        </main>
      </div>
    </div>
  )
}
