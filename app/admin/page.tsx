'use client'

import { useState } from 'react' // Admin login page
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('[v0] Login attempt with username:', username)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      console.log('[v0] Login response status:', response.status)

      const data = await response.json()
      console.log('[v0] Login response data:', data)

      if (response.ok) {
        console.log('[v0] Login successful, storing token')
        // Store token and username for dashboard access
        localStorage.setItem('admin_access_token', data.session?.access_token || '')
        localStorage.setItem('admin_username', username)
        // Redirect to dashboard
        window.location.href = '/admin/dashboard'
        return
      } else {
        const errorMsg = data.error || 'Login failed'
        console.log('[v0] Login failed with error:', errorMsg)
        setError(errorMsg)
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'An error occurred'
      console.log('[v0] Login error:', errMsg)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-block mb-4">
          <Button variant="outline" size="sm" className="gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Home
          </Button>
        </Link>
        <Card className="w-full border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <Image
              src="/kolibri-logo.png"
              alt="Kolibri Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="font-bold text-xl text-foreground">Kolibri Map</span>
          </div>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Access the submission review dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/50 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        </Card>
      </div>
    </main>
  )
}
