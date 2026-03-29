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
  organization_name: string
  organization_type: string
  organization_website: string
  contact_name: string
  contact_email: string
  contact_phone: string
  country: string
  region: string
  city: string
  latitude: number
  longitude: number
  project_description: string
  primary_use_case: string
  primary_language: string
  other_languages: string[]
  kolibri_version: string
  channels_used: string[]
  implementation_date: string
  number_of_students: number
  number_of_teachers: number
  number_of_devices: number
  years_active: number
  customized_content: boolean
  challenges_faced: string
  measurable_impact: string
  success_stories: string
  photo_url: string
  program_links: Record<string, string>
  social_media_links: Record<string, string>
  additional_notes: string
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

  const getLocation = () => {
    const parts = [submission.city, submission.region, submission.country].filter(Boolean)
    return parts.join(', ') || 'Location not provided'
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
              {submission.organization_type && (
                <Badge variant="outline">{submission.organization_type}</Badge>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Contact:</span> {submission.contact_name || 'N/A'}
              </p>
              <p>
                <span className="font-medium text-foreground">Email:</span> {submission.contact_email || 'N/A'}
              </p>
              <p>
                <span className="font-medium text-foreground">Location:</span> {getLocation()}
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
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-card rounded-lg p-3 text-center border border-border">
                <div className="text-2xl font-bold text-primary">{submission.number_of_students || 0}</div>
                <div className="text-xs text-muted-foreground">Students</div>
              </div>
              <div className="bg-card rounded-lg p-3 text-center border border-border">
                <div className="text-2xl font-bold text-primary">{submission.number_of_teachers || 0}</div>
                <div className="text-xs text-muted-foreground">Teachers</div>
              </div>
              <div className="bg-card rounded-lg p-3 text-center border border-border">
                <div className="text-2xl font-bold text-primary">{submission.number_of_devices || 0}</div>
                <div className="text-xs text-muted-foreground">Devices</div>
              </div>
              <div className="bg-card rounded-lg p-3 text-center border border-border">
                <div className="text-2xl font-bold text-primary">{submission.years_active || 0}</div>
                <div className="text-xs text-muted-foreground">Years Active</div>
              </div>
            </div>

            {/* Organization Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Organization Info</h4>
                  <div className="space-y-1 text-sm">
                    {submission.organization_website && (
                      <p>
                        <span className="text-muted-foreground">Website:</span>{' '}
                        <a href={submission.organization_website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {submission.organization_website}
                        </a>
                      </p>
                    )}
                    {submission.contact_phone && (
                      <p>
                        <span className="text-muted-foreground">Phone:</span> {submission.contact_phone}
                      </p>
                    )}
                    {submission.primary_language && (
                      <p>
                        <span className="text-muted-foreground">Primary Language:</span> {submission.primary_language}
                      </p>
                    )}
                    {submission.other_languages && submission.other_languages.length > 0 && (
                      <p>
                        <span className="text-muted-foreground">Other Languages:</span> {submission.other_languages.join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Technical Details</h4>
                  <div className="space-y-1 text-sm">
                    {submission.kolibri_version && (
                      <p>
                        <span className="text-muted-foreground">Kolibri Version:</span> {submission.kolibri_version}
                      </p>
                    )}
                    {submission.primary_use_case && (
                      <p>
                        <span className="text-muted-foreground">Primary Use Case:</span> {submission.primary_use_case}
                      </p>
                    )}
                    {submission.implementation_date && (
                      <p>
                        <span className="text-muted-foreground">Implementation Date:</span> {formatDate(submission.implementation_date)}
                      </p>
                    )}
                    <p>
                      <span className="text-muted-foreground">Customized Content:</span> {submission.customized_content ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>

                {submission.channels_used && submission.channels_used.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Channels Used</h4>
                    <div className="flex flex-wrap gap-1">
                      {submission.channels_used.map((channel: string) => (
                        <Badge key={channel} variant="secondary" className="text-xs">{channel}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {submission.project_description && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Project Description</h4>
                    <p className="text-sm text-muted-foreground bg-card p-3 rounded-lg border border-border">
                      {submission.project_description}
                    </p>
                  </div>
                )}

                {submission.measurable_impact && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Measurable Impact</h4>
                    <p className="text-sm text-muted-foreground bg-card p-3 rounded-lg border border-border">
                      {submission.measurable_impact}
                    </p>
                  </div>
                )}

                {submission.challenges_faced && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Challenges Faced</h4>
                    <p className="text-sm text-muted-foreground bg-card p-3 rounded-lg border border-border">
                      {submission.challenges_faced}
                    </p>
                  </div>
                )}

                {submission.success_stories && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Success Stories</h4>
                    <p className="text-sm text-muted-foreground bg-card p-3 rounded-lg border border-border">
                      {submission.success_stories}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {submission.additional_notes && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Additional Notes</h4>
                <p className="text-sm text-muted-foreground bg-card p-3 rounded-lg border border-border">
                  {submission.additional_notes}
                </p>
              </div>
            )}

            {/* Coordinates */}
            {(submission.latitude && submission.longitude) && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Coordinates</h4>
                <p className="text-sm text-muted-foreground">
                  Lat: {submission.latitude}, Long: {submission.longitude}
                </p>
              </div>
            )}

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
