'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Card, CardContent } from '@/components/ui'
import { api } from '@/lib/api/client'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setError(null)

    try {
      await api.login(data)
      router.push('/tasks')
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: { message?: string } } } }
      const errorMessage = axiosError.response?.data?.error?.message || 'Invalid email or password'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faf9] px-4 relative overflow-hidden">
      {/* Soft Background Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-60"></div>

      <Card className="w-full max-w-md border-none shadow-2xl shadow-emerald-100/50 rounded-[2.5rem] bg-white/80 backdrop-blur-sm z-10">
        <CardContent className="pt-10 pb-10 px-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-lg shadow-emerald-200 italic">
              T
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
            <p className="text-slate-500 mt-2">Sign in to continue to TaskFlow</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
                className="rounded-2xl border-slate-100 focus:border-emerald-500 focus:ring-emerald-500/10"
              />
            </div>

            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
                className="rounded-2xl border-slate-100 focus:border-emerald-500 focus:ring-emerald-500/10"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-100 transition-all hover:-translate-y-0.5"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-emerald-600 hover:text-emerald-700 font-bold underline-offset-4 hover:underline">
              Create one for free
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}