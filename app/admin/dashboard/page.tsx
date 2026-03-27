'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

interface Submission {
  id: string
  name: string
  email: string
  organization_name: string
  location: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  learner_types: string[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [adminUser, setAdminUser] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/check-auth')
      if (!response.ok) {
        router.push('/admin')
        return
      }
      const data = await response.json()
      setAdminUser(data.user)
      fetchSubmissions()
    } catch (error) {
      router.push('/admin')
    }
  }

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/submissions')
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data)
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (submissionId: string) => {
    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}/approve`, {
        method: 'POST',
      })
      if (response.ok) {
        setSubmissions(submissions.map(s => 
          s.id === submissionId ? { ...s, status: 'approved' } : s
        ))
      }
    } catch (error) {
      alert('Error approving submission')
    }
  }

  const handleReject = async (submissionId: string) => {
    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}/reject`, {
        method: 'POST',
      })
      if (response.ok) {
        setSubmissions(submissions.map(s => 
          s.id === submissionId ? { ...s, status: 'rejected' } : s
        ))
      }
    } catch (error) {
      alert('Error rejecting submission')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const pendingSubmissions = submissions.filter(s => s.status === 'pending')
  const approvedSubmissions = submissions.filter(s => s.status === 'approved')
  const rejectedSubmissions = submissions.filter(s => s.status === 'rejected')

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">K</span>
            </div>
            <span className="font-bold text-lg text-foreground">Kolibri Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-foreground/60">
              {adminUser?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/60">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{submissions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/60">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{pendingSubmissions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/60">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{approvedSubmissions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/60">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{rejectedSubmissions.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Submissions</CardTitle>
            <CardDescription>Manage and review project submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="pending">
                  Pending ({pendingSubmissions.length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({approvedSubmissions.length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({rejectedSubmissions.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {pendingSubmissions.length === 0 ? (
                  <div className="text-center py-8 text-foreground/60">
                    No pending submissions
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingSubmissions.map(submission => (
                      <SubmissionRow
                        key={submission.id}
                        submission={submission}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        getStatusColor={getStatusColor}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="approved" className="space-y-4">
                {approvedSubmissions.length === 0 ? (
                  <div className="text-center py-8 text-foreground/60">
                    No approved submissions
                  </div>
                ) : (
                  <div className="space-y-4">
                    {approvedSubmissions.map(submission => (
                      <SubmissionRow
                        key={submission.id}
                        submission={submission}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        getStatusColor={getStatusColor}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="rejected" className="space-y-4">
                {rejectedSubmissions.length === 0 ? (
                  <div className="text-center py-8 text-foreground/60">
                    No rejected submissions
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rejectedSubmissions.map(submission => (
                      <SubmissionRow
                        key={submission.id}
                        submission={submission}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        getStatusColor={getStatusColor}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function SubmissionRow({ submission, onApprove, onReject, getStatusColor }: any) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const isExpanded = expandedId === submission.id

  return (
    <div key={submission.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-foreground">{submission.organization_name}</h3>
            <Badge className={getStatusColor(submission.status)}>
              {submission.status}
            </Badge>
          </div>
          <p className="text-sm text-foreground/60 mb-2">
            <span className="font-medium">Contact:</span> {submission.name} ({submission.email})
          </p>
          <p className="text-sm text-foreground/60">
            <span className="font-medium">Location:</span> {submission.location}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpandedId(isExpanded ? null : submission.id)}
        >
          {isExpanded ? 'Hide' : 'View'}
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border space-y-3">
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Learner Types</p>
            <div className="flex flex-wrap gap-2">
              {submission.learner_types?.map((type: string) => (
                <Badge key={type} variant="secondary">{type}</Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            {submission.status !== 'approved' && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => onApprove(submission.id)}
              >
                Approve
              </Button>
            )}
            {submission.status !== 'rejected' && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onReject(submission.id)}
              >
                Reject
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
