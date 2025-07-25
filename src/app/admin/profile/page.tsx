'use client'

import { useEffect, useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { useAuth } from '../../../hooks/use-auth'
import { User, Mail, Shield } from 'lucide-react'
import api from '../../../util/api'
import { ProfileData } from '@/data/types.data'

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { logout } = useAuth()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/admin/auth')
        setProfile((response.data as any).data)
      } catch {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></div>
    </div>
  )
  if (error) return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
        <span className="text-4xl">😢</span>
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-heading text-foreground">Oops! Something went wrong</h2>
        <p className="text-foreground text-lg">{error}</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            Admin Profile
          </h1>
        </header>

        <div className="grid gap-10 md:grid-cols-2">
          <Card className="bg-card/70 backdrop-blur-md border border-border rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary font-semibold text-lg">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Your basic account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="email" className="font-semibold text-sm text-foreground">Email Address</Label>
                <div className="flex items-center gap-3 mt-1">
                  <Input id="email" value={profile?.email || ''} disabled className="bg-muted text-foreground" />
                </div>
                <p className="text-xs text-foreground mt-1">Email address cannot be changed</p>
              </div>

              <div>
                <Label htmlFor="user-id" className="font-semibold text-sm text-foreground">User ID</Label>
                <Input id="user-id" value={profile?.inline?.id || ''} disabled className="bg-muted text-foreground mt-1" />
              </div>

              <div>
                <Label htmlFor="admin-status" className="font-semibold text-sm text-foreground">Admin Status</Label>
                <div className="flex items-center gap-3 mt-1">
                  <Input id="admin-status" value="Administrator" disabled className="bg-muted text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/70 backdrop-blur-md border border-border rounded-xl shadow-lg hover:shadow-secondary/20 transition-shadow">
            <CardHeader>
              <CardTitle className="text-secondary font-semibold text-lg">Account Statistics</CardTitle>
              <CardDescription>Overview of your portfolio data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-5 rounded-lg bg-primary/10 text-primary font-semibold shadow-inner">
                  <div className="text-3xl">{profile?.skills?.length || 0}</div>
                  <div className="text-sm font-normal text-foreground">Skills</div>
                </div>
                <div className="text-center p-5 rounded-lg bg-secondary/10 text-secondary font-semibold shadow-inner">
                  <div className="text-3xl">{profile?.projects?.length || 0}</div>
                  <div className="text-sm font-normal text-foreground">Projects</div>
                </div>
                <div className="text-center p-5 rounded-lg bg-accent/10 text-accent font-semibold shadow-inner">
                  <div className="text-3xl">{profile?.experiences?.length || 0}</div>
                  <div className="text-sm font-normal text-foreground">Experiences</div>
                </div>
                <div className="text-center p-5 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-semibold shadow-inner">
                  <div className="text-3xl">Active</div>
                  <div className="text-sm font-normal text-foreground">Status</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/70 backdrop-blur-md border border-border rounded-xl shadow-lg hover:shadow-destructive/20 transition-shadow md:col-span-2">
            <CardHeader>
              <CardTitle className="text-destructive font-semibold text-lg">Security</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="font-semibold text-sm text-foreground">Session Management</Label>
                <p className="text-sm text-foreground mt-1">
                  You are currently logged in and have access to all admin features.
                </p>
              </div>
              <Button variant="destructive" onClick={logout} className="w-full py-3 font-semibold">
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}