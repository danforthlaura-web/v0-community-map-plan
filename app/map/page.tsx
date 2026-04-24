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
          (project.location?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (project.kolibri_usage_description?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by country
    if (selectedCountries.length > 0) {
      filtered = filtered.filter(project => {
        const projectCountry = project.location?.split(',').pop()?.trim()
        return selectedCountries.some(country => projectCountry?.includes(country))
      })
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
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kolibri-logo-FBRiDzMv5OsQ140bWgi7Cvj6milUQW.png"
              alt="Kolibri Logo"
              className="w-8 h-8"
            />
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

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Countries
                  </label>
                  <div className="space-y-2">
                    {Array.from(new Set(
                      projects
                        .map(p => p.location?.split(',').pop()?.trim())
                        .filter(Boolean)
                    )).sort().map(country => (
                      <label key={country} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={selectedCountries.some(c => c.includes(country))}
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

function ProjectCard({ project, onSelect }: { project: Project; onSelect: (p: Project) => void }) {
  return (
    <Card
      className="hover:shadow-lg transition-shadow hover:border-primary/50 cursor-pointer"
      onClick={() => onSelect(project)}
    >
      <CardHeader>
        <CardTitle className="text-lg">{project.organization_name}</CardTitle>
        <CardDescription>{project.location}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground/60 line-clamp-3">{project.kolibri_usage_description || 'No description provided'}</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {project.number_of_learners && (
            <div>
              <p className="text-foreground/60">Learners</p>
              <p className="font-medium text-foreground">{project.number_of_learners}</p>
            </div>
          )}
          {project.number_of_teachers && (
            <div>
              <p className="text-foreground/60">Teachers</p>
              <p className="font-medium text-foreground">{project.number_of_teachers}</p>
            </div>
          )}
        </div>
        <div>
          {project.primary_language && (
            <p className="text-sm text-foreground/60 mb-1">
              <span className="font-medium">Language:</span> {project.primary_language}
            </p>
          )}
          {project.start_year && (
            <p className="text-sm text-foreground/60">
              <span className="font-medium">Started:</span> {project.start_year}
            </p>
          )}
        </div>
        <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          View Full Details
        </Button>
      </CardContent>
    </Card>
  )
}

function ProjectListItem({ project, onSelect }: { project: Project; onSelect: (p: Project) => void }) {
  return (
    <Card
      className="hover:shadow-md transition-shadow hover:border-primary/50 cursor-pointer"
      onClick={() => onSelect(project)}
    >
      <CardContent className="py-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">{project.organization_name}</h3>
            <p className="text-sm text-foreground/60 mb-2">{project.location}</p>
            <p className="text-sm text-foreground mb-2 line-clamp-2">{project.kolibri_usage_description}</p>
            <div className="flex flex-wrap gap-3 text-sm text-foreground/60">
              {project.number_of_learners && (
                <span><span className="font-medium">Learners:</span> {project.number_of_learners}</span>
              )}
              {project.primary_language && (
                <span><span className="font-medium">Language:</span> {project.primary_language}</span>
              )}
              {project.start_year && (
                <span><span className="font-medium">Started:</span> {project.start_year}</span>
              )}
            </div>
          </div>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
