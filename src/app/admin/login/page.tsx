'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '../../../hooks/use-auth'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { Eye, EyeOff, Lock, Mail, Shield, X } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  admin_pass: z.string().min(1, 'Admin password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showAdminPass, setShowAdminPass] = useState(false)
  const [error, setError] = useState('')
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData, e?: React.BaseSyntheticEvent) => {
    e?.preventDefault()
    setError('')
    try {
      const result = await login(data)
      if (result.success) {
        router.push('/admin/dashboard')
      } else {
        setError(result.error || 'Invalid credentials. Please check your email, password, and admin password.')
      }
    } catch {
      setError('Something went wrong. Please try again later.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border border-border bg-card/80 backdrop-blur-md rounded-2xl shadow-md">
        <CardHeader className="text-center space-y-1">
          <Shield className="mx-auto h-10 w-10 text-primary" />
          <CardTitle className="text-3xl font-semibold">Admin Login</CardTitle>
          <CardDescription>Access restricted admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="flex items-center justify-between">
                <AlertDescription className="flex-1 text-sm">{error}</AlertDescription>
                <button onClick={() => setError('')} className="p-1">
                  <X className="w-4 h-4" />
                </button>
              </Alert>
            )}

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  className="pl-10"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="admin_pass">Admin Password</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="admin_pass"
                  type={showAdminPass ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  className="pl-10 pr-10"
                  {...register('admin_pass')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-muted-foreground"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                >
                  {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.admin_pass && <p className="text-sm text-destructive">{errors.admin_pass.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
