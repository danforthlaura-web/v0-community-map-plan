'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

interface Submission {
  id: string
  created_at: string
  updated_at: string
  status: 'pending' | 'approved' | 'rejected'
  // Basic Details
  name: string
  email: string
  organization_name: string
  location: string
  latitude: number
  longitude: number
  organization_website: string
  start_year: string
  // Implementation Details
  implementation_settings: string[]
  learner_types: string[]
  device_usage: string[]
  client_devices: string[]
  server_devices: string[]
  client_device_types: string[]
  hardware_model: string[]
  blended_learning_model: string[]
  kolibri_usage_description: string
  // Content
  primary_language: string
  public_channels: string
  uses_kolibri_studio: boolean
  // Media & Social
  photo_url: string
  program_links: { title: string; url: string }[]
  testimonials: string
  reports: string
  twitter_handle: string
  facebook_handle: string
  instagram_handle: string
  linkedin_handle: string
  forum_username: string
  other_social: string
  receive_updates: boolean
  email_visible: boolean
}

interface AdminUser {
  username: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      console.log('[v0] Checking auth from localStorage...')
      const token = localStorage.getItem('admin_access_token')
      const username = localStorage.getItem('admin_username')
      
      if (!token || !username) {
        console.log('[v0] No token or username in localStorage, redirecting to login')
        router.push('/admin')
        return
      }
      
      console.log('[v0] Found token and username in localStorage, user:', username)
      setAdminUser({ username })
      fetchSubmissions()
    } catch (error) {
      console.log('[v0] Auth check error:', error)
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

  const handleApprove = async (submission: Submission) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/submissions/${submission.id}/approve`, {
        method: 'POST',
      })
      if (response.ok) {
        setSubmissions(submissions.map(s => 
          s.id === submission.id ? { ...s, status: 'approved' } : s
        ))
        setSelectedSubmission(null)
      } else {
        alert('Failed to approve submission')
      }
    } catch (error) {
      alert('Error approving submission')
    } finally {
      setActionLoading(false)
    }
  }

  const openRejectDialog = (submission: Submission) => {
    setSelectedSubmission(submission)
    setRejectReason('')
    setRejectDialogOpen(true)
  }

  const handleReject = async () => {
    if (!selectedSubmission) return
    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/submissions/${selectedSubmission.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason }),
      })
      if (response.ok) {
        setSubmissions(submissions.map(s => 
          s.id === selectedSubmission.id ? { ...s, status: 'rejected' } : s
        ))
        setRejectDialogOpen(false)
        setSelectedSubmission(null)
        setRejectReason('')
      } else {
        alert('Failed to reject submission')
      }
    } catch (error) {
      alert('Error rejecting submission')
    } finally {
      setActionLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('admin_access_token')
      localStorage.removeItem('admin_email')
      // Redirect to login
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
            <Image
              src="/kolibri-logo.png"
              alt="Kolibri Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-bold text-lg text-foreground">Kolibri Map Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-foreground/60">
              {adminUser?.username}
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
                      <SubmissionCard
                        key={submission.id}
                        submission={submission}
                        onApprove={handleApprove}
                        onReject={openRejectDialog}
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
                      <SubmissionCard
                        key={submission.id}
                        submission={submission}
                        onApprove={handleApprove}
                        onReject={openRejectDialog}
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
                      <SubmissionCard
                        key={submission.id}
                        submission={submission}
                        onApprove={handleApprove}
                        onReject={openRejectDialog}
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

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting &quot;{selectedSubmission?.organization_name}&quot;. This will be sent to the submitter via email.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={actionLoading || !rejectReason.trim()}
            >
              {actionLoading ? 'Rejecting...' : 'Reject Submission'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

interface SubmissionCardProps {
  submission: Submission
  onApprove: (submission: Submission) => void
  onReject: (submission: Submission) => void
  getStatusColor: (status: string) => string
}

function SubmissionCard({ submission, onApprove, onReject, getStatusColor }: SubmissionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Header Row */}
      <div className="p-4 bg-card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-semibold text-foreground truncate">{submission.organization_name}</h3>
              <Badge className={getStatusColor(submission.status)}>
                {submission.status}
              </Badge>
            </div>
            <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Submitted by:</span> {submission.name || 'N/A'}
              </p>
              <p>
                <span className="font-medium text-foreground">Email:</span> {submission.email || 'N/A'}
              </p>
              <p>
                <span className="font-medium text-foreground">Location:</span> {submission.location || 'N/A'}
              </p>
              <p>
                <span className="font-medium text-foreground">Submitted:</span> {formatDate(submission.created_at)}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0"
          >
            {isExpanded ? 'Collapse' : 'Review'}
          </Button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border bg-muted/30">
          <div className="p-4 space-y-6">

            {/* Basic Details */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Basic Details</h4>
              <div className="space-y-1 text-sm">
                {submission.organization_website && (
                  <p>
                    <span className="text-muted-foreground">Website:</span>{' '}
                    <a href={submission.organization_website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {submission.organization_website}
                    </a>
                  </p>
                )}
                {submission.start_year && (
                  <p><span className="text-muted-foreground">Started with Kolibri:</span> {submission.start_year}</p>
                )}
                {(submission.latitude && submission.longitude) && (
                  <p className="text-xs text-muted-foreground">Coordinates: {submission.latitude}, {submission.longitude}</p>
                )}
              </div>
            </div>

            {/* Implementation Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {submission.implementation_settings && submission.implementation_settings.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Implementation Setting</h4>
                    <div className="flex flex-wrap gap-1">
                      {submission.implementation_settings.map((s: string) => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {submission.learner_types && submission.learner_types.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Learner Types</h4>
                    <div className="flex flex-wrap gap-1">
                      {submission.learner_types.map((t: string) => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {submission.device_usage && submission.device_usage.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Device Usage During Session</h4>
                    <div className="flex flex-wrap gap-1">
                      {submission.device_usage.map((d: string) => (
                        <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {submission.client_devices && submission.client_devices.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Client Devices per Server</h4>
                    <div className="flex flex-wrap gap-1">
                      {submission.client_devices.map((d: string) => (
                        <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {submission.server_devices && submission.server_devices.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Server Devices</h4>
                    <div className="flex flex-wrap gap-1">
                      {submission.server_devices.map((d: string) => (
                        <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {submission.client_device_types && submission.client_device_types.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Client Device Types</h4>
                    <div className="flex flex-wrap gap-1">
                      {submission.client_device_types.map((d: string) => (
                        <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {submission.hardware_model && submission.hardware_model.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Hardware Implementation Model</h4>
                    <div className="flex flex-wrap gap-1">
                      {submission.hardware_model.map((m: string) => (
                        <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {submission.blended_learning_model && submission.blended_learning_model.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Blended Learning Model</h4>
                    <div className="flex flex-wrap gap-1">
                      {submission.blended_learning_model.map((m: string) => (
                        <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {submission.kolibri_usage_description && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">How Kolibri is Used</h4>
                    <p className="text-sm text-muted-foreground bg-card p-3 rounded-lg border border-border">
                      {submission.kolibri_usage_description}
                    </p>
                  </div>
                )}

                {/* Content */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Content</h4>
                  <div className="space-y-1 text-sm">
                    {submission.primary_language && (
                      <p><span className="text-muted-foreground">Primary Language:</span> {submission.primary_language}</p>
                    )}
                    <p><span className="text-muted-foreground">Uses Kolibri Studio:</span> {submission.uses_kolibri_studio ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                {submission.public_channels && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Kolibri Library Channels</h4>
                    <p className="text-sm text-muted-foreground bg-card p-3 rounded-lg border border-border">
                      {submission.public_channels}
                    </p>
                  </div>
                )}

                {/* Photo */}
                {submission.photo_url && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Project Photo</h4>
                    <img src={submission.photo_url} alt="Project photo" className="max-w-xs h-auto rounded-lg border border-border" />
                  </div>
                )}
              </div>
            </div>

            {/* Media & Social */}
            {(submission.testimonials || submission.reports || submission.twitter_handle || submission.facebook_handle || submission.instagram_handle || submission.linkedin_handle || submission.forum_username || submission.other_social || (submission.program_links && submission.program_links.length > 0)) && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Media &amp; Social</h4>
                <div className="space-y-2 text-sm">
                  {submission.program_links && submission.program_links.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Program Links:</span>
                      <ul className="mt-1 space-y-1 ml-2">
                        {submission.program_links.map((link, i) => (
                          <li key={i}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {link.title || link.url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {submission.testimonials && (
                    <p><span className="text-muted-foreground">Testimonials / Stories:</span> {submission.testimonials}</p>
                  )}
                  {submission.reports && (
                    <p>
                      <span className="text-muted-foreground">Reports / White Papers:</span>{' '}
                      <a href={submission.reports} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{submission.reports}</a>
                    </p>
                  )}
                  {submission.twitter_handle && (
                    <p><span className="text-muted-foreground">Twitter:</span> {submission.twitter_handle}</p>
                  )}
                  {submission.facebook_handle && (
                    <p><span className="text-muted-foreground">Facebook:</span> {submission.facebook_handle}</p>
                  )}
                  {submission.instagram_handle && (
                    <p><span className="text-muted-foreground">Instagram:</span> {submission.instagram_handle}</p>
                  )}
                  {submission.linkedin_handle && (
                    <p><span className="text-muted-foreground">LinkedIn:</span> {submission.linkedin_handle}</p>
                  )}
                  {submission.forum_username && (
                    <p><span className="text-muted-foreground">Forum Username:</span> {submission.forum_username}</p>
                  )}
                  {submission.other_social && (
                    <p><span className="text-muted-foreground">Other Social:</span> {submission.other_social}</p>
                  )}
                </div>
              </div>
            )}

            {/* Preferences */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Preferences</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Receive updates from Learning Equality:</span> {submission.receive_updates ? 'Yes' : 'No'}</p>
                <p><span className="text-muted-foreground">Email visible to others:</span> {submission.email_visible ? 'Yes' : 'No'}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
              {submission.status !== 'approved' && (
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => onApprove(submission)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Approve
                </Button>
              )}
              {submission.status !== 'rejected' && (
                <Button
                  variant="destructive"
                  onClick={() => onReject(submission)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Reject
                </Button>
              )}
              {submission.status === 'approved' && (
                <Button variant="outline" onClick={() => onReject(submission)}>
                  Revoke Approval
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
