'use client'

import { useState, useCallback } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { Button } from '@/components/ui/button'
import type { Project } from '@/components/project-detail-panel'

const WORLD_TOPO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

interface WorldMapProps {
  projects: Project[]
  onSelectProject?: (project: Project) => void
}

export default function WorldMap({ projects, onSelectProject }: WorldMapProps) {
  const [tooltip, setTooltip] = useState<{ project: Project; x: number; y: number } | null>(null)
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [0, 20],
    zoom: 1,
  })

  // Filter to only projects with valid coordinates
  const validProjects = projects.filter(
    p => p.latitude != null && p.longitude != null && !isNaN(p.latitude) && !isNaN(p.longitude)
  )

  // Apply offset to overlapping pins (spread them in a circle pattern)
  const OFFSET_DISTANCE = 0.15 // ~15km offset in degrees (approximate)
  const projectsWithOffsets = validProjects.map((project, index) => {
    // Find all projects at approximately the same location
    const nearbyProjects = validProjects.filter(
      (p) =>
        Math.abs(p.latitude - project.latitude) < 0.01 &&
        Math.abs(p.longitude - project.longitude) < 0.01
    )

    if (nearbyProjects.length <= 1) {
      return { ...project, offsetLat: project.latitude, offsetLng: project.longitude }
    }

    // Find this project's position in the group
    const positionInGroup = nearbyProjects.findIndex((p) => p.id === project.id)
    const totalInGroup = nearbyProjects.length

    // Spread pins in a circle
    const angle = (2 * Math.PI * positionInGroup) / totalInGroup
    const offsetLat = project.latitude + OFFSET_DISTANCE * Math.sin(angle)
    const offsetLng = project.longitude + OFFSET_DISTANCE * Math.cos(angle)

    return { ...project, offsetLat, offsetLng }
  })

  const handleZoomIn = useCallback(() => {
    if (position.zoom >= 8) return
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.5 }))
  }, [position.zoom])

  const handleZoomOut = useCallback(() => {
    if (position.zoom <= 1) return
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.5 }))
  }, [position.zoom])

  const handleMoveEnd = useCallback((pos: { coordinates: [number, number]; zoom: number }) => {
    setPosition(pos)
  }, [])

  const handleReset = useCallback(() => {
    setPosition({ coordinates: [0, 20], zoom: 1 })
  }, [])

  if (validProjects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-foreground/40 text-sm">
        No implementations with location data to display yet.
      </div>
    )
  }

  return (
    <div className="relative w-full">
      {/* Zoom Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-background/90 backdrop-blur-sm"
          onClick={handleZoomIn}
          disabled={position.zoom >= 8}
        >
          <span className="text-lg font-bold leading-none">+</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-background/90 backdrop-blur-sm"
          onClick={handleZoomOut}
          disabled={position.zoom <= 1}
        >
          <span className="text-lg font-bold leading-none">-</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-background/90 backdrop-blur-sm mt-1"
          onClick={handleReset}
          title="Reset view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </Button>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-3 left-3 z-10 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs text-foreground/60">
        Zoom: {position.zoom.toFixed(1)}x
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 140, center: [0, 30] }}
        style={{ width: '100%', height: '100%' }}
        height={450}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          minZoom={1}
          maxZoom={8}
        >
          <Geographies geography={WORLD_TOPO_URL}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#EEEEEF"
                  stroke="#ffffff"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#E0DFFE', outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {projectsWithOffsets.map(project => (
            <Marker
              key={project.id}
              coordinates={[project.offsetLng, project.offsetLat]}
              onMouseEnter={(e) => {
                setTooltip({ project, x: e.clientX, y: e.clientY })
              }}
              onMouseLeave={() => setTooltip(null)}
              onClick={() => onSelectProject?.(project)}
              style={{ cursor: 'pointer' }}
            >
              {/* Outer pulse ring */}
              <circle r={10 / position.zoom} fill="#4436F5" fillOpacity={0.2} />
              {/* Inner pin */}
              <circle
                r={5 / position.zoom}
                fill="#4436F5"
                stroke="#FFCB00"
                strokeWidth={1.5 / position.zoom}
              />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
        >
          <div className="bg-background border border-border shadow-lg rounded-lg py-3 px-4 max-w-56">
            <p className="font-semibold text-sm text-foreground leading-tight">
              {tooltip.project.organization_name}
            </p>
            <p className="text-xs text-foreground/60 mt-1">
              {tooltip.project.city}, {tooltip.project.country}
            </p>
            {tooltip.project.number_of_students > 0 && (
              <p className="text-xs text-foreground/60 mt-0.5">
                {tooltip.project.number_of_students.toLocaleString()} students
              </p>
            )}
            <p className="text-xs text-primary mt-2">Click to view details</p>
          </div>
        </div>
      )}
    </div>
  )
}
