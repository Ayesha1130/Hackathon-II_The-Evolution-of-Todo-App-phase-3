'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Card, CardContent } from '@/components/ui'
import { api } from '@/lib/api/client'

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true)
    setError(null)

    try {
      await api.signup({
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password,
      })
      router.push('/login') // Signup ke baad login par bhej dega
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: { message?: string } } } }
      const errorMessage = axiosError.response?.data?.error?.message || 'Failed to create account'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faf9] px-4 relative overflow-hidden">
      {/* Soft Background Blurs */}
      <div className="absolute top-[-5%] left-[-5%] w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-60"></div>

      <Card className="w-full max-w-md border-none shadow-2xl shadow-emerald-100/50 rounded-[2.5rem] bg-white/80 backdrop-blur-sm z-10">
        <CardContent className="pt-10 pb-10 px-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-lg shadow-emerald-200 italic">
              T
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Create Account</h1>
            <p className="text-slate-500 mt-2">Start your productivity journey today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
              className="rounded-2xl border-slate-100 focus:border-emerald-500 focus:ring-emerald-500/10"
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              error={errors.password?.message}
              {...register('password')}
              className="rounded-2xl border-slate-100 focus:border-emerald-500 focus:ring-emerald-500/10"
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              error={errors.confirm_password?.message}
              {...register('confirm_password')}
              className="rounded-2xl border-slate-100 focus:border-emerald-500 focus:ring-emerald-500/10"
            />

            <Button
              type="submit"
              className="w-full py-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-100 transition-all hover:-translate-y-0.5 mt-2"
              isLoading={isLoading}
            >
              Get Started Free
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-bold underline-offset-4 hover:underline">
              Sign in here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}