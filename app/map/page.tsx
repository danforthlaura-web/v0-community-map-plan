'use client'

import { useState, useEffect, Suspense, lazy } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import ProjectDetailPanel, { type Project } from '@/components/project-detail-panel'

const WorldMap = lazy(() => import('@/components/world-map'))

export default function MapPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        console.log('[v0] Projects fetched:', data)
        setProjects(data)
        setFilteredProjects(data)
      } else {
        console.error('[v0] API error:', response.status)
      }
    } catch (error) {
      console.error('[v0] Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = projects

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        project =>
          project.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.project_description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by countries
    if (selectedCountries.length > 0) {
      filtered = filtered.filter(project =>
        selectedCountries.includes(project.country)
      )
    }

    setFilteredProjects(filtered)
  }, [searchTerm, selectedCountries, projects])

  const handleCountryToggle = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    )
  }

  return (
    <>
    <ProjectDetailPanel project={selectedProject} onClose={() => setSelectedProject(null)} />
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">K</span>
            </div>
            <span className="font-bold text-lg text-foreground">Kolibri Map</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-foreground hover:text-primary text-sm">
              Home
            </Link>
            <Link href="/submit" className="text-foreground hover:text-primary text-sm">
              Submit Project
            </Link>
            <Link href="/admin" className="text-foreground hover:text-primary text-sm">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Kolibri Implementations Map</h1>
          <p className="text-foreground/70">
            Discover {projects.length} approved Kolibri implementations from around the world
          </p>
        </div>

        {/* World Map Section */}
        {!loading && (
          <div className="mb-10">
            <Card className="overflow-hidden border border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Global Kolibri Implementations</CardTitle>
                <CardDescription>
                  Click a pin to view full details. Drag to pan, use controls or scroll to zoom.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-64 text-foreground/40 text-sm">
                      Loading map...
                    </div>
                  }
                >
                  <WorldMap
                    projects={projects}
                    onSelectProject={(p) => setSelectedProject(p)}
                  />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Search
                  </label>
                  <Input
                    type="text"
                    placeholder="Organization or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Learner Types Filter */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Countries
                  </label>
                  <div className="space-y-2">
                    {Array.from(new Set(projects.map(p => p.country))).map(country => (
                      <label key={country} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={selectedCountries.includes(country)}
                          onCheckedChange={() => handleCountryToggle(country)}
                        />
                        <span className="text-sm text-foreground">{country}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* View Type Toggle */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    View
                  </label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={viewType === 'grid' ? 'default' : 'outline'}
                      onClick={() => setViewType('grid')}
                      className={viewType === 'grid' ? 'bg-primary text-primary-foreground' : ''}
                    >
                      Grid
                    </Button>
                    <Button
                      size="sm"
                      variant={viewType === 'list' ? 'default' : 'outline'}
                      onClick={() => setViewType('list')}
                      className={viewType === 'list' ? 'bg-primary text-primary-foreground' : ''}
                    >
                      List
                    </Button>
                  </div>
                </div>

                {/* Reset Filters */}
                {(searchTerm || selectedCountries.length > 0) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCountries([])
                    }}
                    className="w-full"
                  >
                    Reset Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Projects Display */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-foreground/60">Loading projects...</p>
                </div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-foreground/60 mb-4">No projects found matching your filters.</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCountries([])
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : viewType === 'grid' ? (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredProjects.map(project => (
                  <ProjectCard key={project.id} project={project} onSelect={setSelectedProject} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map(project => (
                  <ProjectListItem key={project.id} project={project} onSelect={setSelectedProject} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
    </>
  )
}

function ContextIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}

function LearnerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a8.38 8.38 0 0 1 13 0" />
    </svg>
  )
}

function DeviceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <rect x="2" y="7" width="6" height="10" rx="1" ry="1" />
      <line x1="12" y1="18" x2="12" y2="18.01" />
    </svg>
  )
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-foreground/40 mt-0.5 shrink-0">{icon}</span>
      <div className="text-sm">
        <p className="font-semibold text-foreground leading-snug">{label}</p>
        <p className="text-foreground/60 leading-snug">{value}</p>
      </div>
    </div>
  )
}

function ProjectCard({ project, onSelect }: { project: Project; onSelect: (p: Project) => void }) {
  const deviceRatio =
    project.number_of_devices && project.number_of_students
      ? project.number_of_devices >= project.number_of_students
        ? '1 device per learner'
        : project.number_of_students / project.number_of_devices <= 2
        ? '1 device shared by 2 learners'
        : `1 device shared by ${Math.round(project.number_of_students / project.number_of_devices)} or more learners`
      : null

  const learnerValue = [
    project.channels_used && project.channels_used.length > 0 ? project.channels_used.join(', ') : null,
    project.organization_type,
  ]
    .filter(Boolean)
    .join(' · ') || null

  return (
    <Card
      className="hover:shadow-lg transition-shadow hover:border-primary/50 cursor-pointer overflow-hidden flex flex-col"
      onClick={() => onSelect(project)}
    >
      {/* Card header: org name + location */}
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-base font-bold text-foreground leading-tight">{project.organization_name}</h3>
        <p className="text-sm text-foreground/60 mt-0.5">{project.city}, {project.country}</p>
      </div>

      {/* Photo or placeholder */}
      <div className="mx-5 mb-4 rounded-md overflow-hidden bg-muted aspect-[16/9]">
        {project.photo_url ? (
          <img
            src={project.photo_url}
            alt={`${project.organization_name} photo`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="text-muted-foreground/30" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="px-5 mb-4">
        <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3">
          {project.project_description || 'No description provided.'}
        </p>
      </div>

      {/* Metadata rows */}
      <div className="px-5 pb-5 flex flex-col gap-3 mt-auto">
        <MetaRow
          icon={<ContextIcon />}
          label="Context"
          value={project.primary_use_case}
        />
        <MetaRow
          icon={<LearnerIcon />}
          label="Learner type"
          value={learnerValue || (project.primary_language ? `Language: ${project.primary_language}` : null)}
        />
        {deviceRatio && (
          <MetaRow
            icon={<DeviceIcon />}
            label="Device to learner ratio"
            value={deviceRatio}
          />
        )}
      </div>
    </Card>
  )
}

function ProjectListItem({ project, onSelect }: { project: Project; onSelect: (p: Project) => void }) {
  return (
    <Card
      className="hover:shadow-md transition-shadow hover:border-primary/50 cursor-pointer overflow-hidden"
      onClick={() => onSelect(project)}
    >
      <CardContent className="p-0">
        <div className="flex gap-0">
          {/* Thumbnail */}
          <div className="w-28 shrink-0 bg-muted self-stretch">
            {project.photo_url ? (
              <img
                src={project.photo_url}
                alt={`${project.organization_name} photo`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center min-h-[90px]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="text-muted-foreground/30" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 px-4 py-3 flex flex-col gap-1.5">
            <div>
              <h3 className="font-bold text-foreground leading-tight">{project.organization_name}</h3>
              <p className="text-xs text-foreground/60">{project.city}, {project.country}</p>
            </div>
            <p className="text-sm text-foreground/70 line-clamp-2 leading-relaxed">{project.project_description}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground/60 mt-0.5">
              {project.primary_use_case && (
                <span className="flex items-center gap-1">
                  <ContextIcon />
                  {project.primary_use_case}
                </span>
              )}
              {project.organization_type && (
                <span className="flex items-center gap-1">
                  <LearnerIcon />
                  {project.organization_type}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
