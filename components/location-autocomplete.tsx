'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { MapPin, Loader2, AlertCircle, Check } from 'lucide-react'

interface LocationResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
  type: string
  address: {
    village?: string
    town?: string
    city?: string
    county?: string
    state?: string
    country?: string
  }
}

interface LocationAutocompleteProps {
  value: string
  onChange: (location: string, latitude: number | null, longitude: number | null) => void
  placeholder?: string
  disabled?: boolean
}

export function LocationAutocomplete({
  value,
  onChange,
  placeholder = "Search for a location...",
  disabled = false,
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<LocationResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (query.length < 3) {
      setResults([])
      setIsOpen(false)
      return
    }

    // Don't search if we just selected a location
    if (selectedLocation && query === selectedLocation.display_name) {
      return
    }

    setIsLoading(true)
    setError(null)

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`,
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'KolibriCommunityMap/1.0'
            }
          }
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch locations')
        }
        
        const data: LocationResult[] = await response.json()
        
        // Filter out country-only results (must have at least a village, town, city, or county)
        const filteredResults = data.filter(result => {
          const addr = result.address
          return addr.village || addr.town || addr.city || addr.county
        })
        
        setResults(filteredResults)
        setIsOpen(filteredResults.length > 0)
        
        if (data.length > 0 && filteredResults.length === 0) {
          setError('Please enter a more specific location (city, town, or village)')
        }
      } catch (err) {
        console.error('Location search error:', err)
        setError('Failed to search locations. Please try again.')
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, selectedLocation])

  const handleSelect = (result: LocationResult) => {
    setSelectedLocation(result)
    setQuery(result.display_name)
    setIsOpen(false)
    setError(null)
    onChange(result.display_name, parseFloat(result.lat), parseFloat(result.lon))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setQuery(newValue)
    setSelectedLocation(null)
    
    // Clear coordinates if user is typing new value
    if (newValue !== selectedLocation?.display_name) {
      onChange(newValue, null, null)
    }
  }

  const formatDisplayName = (result: LocationResult) => {
    const parts: string[] = []
    const addr = result.address
    
    if (addr.village) parts.push(addr.village)
    else if (addr.town) parts.push(addr.town)
    else if (addr.city) parts.push(addr.city)
    
    if (addr.county && !parts.includes(addr.county)) parts.push(addr.county)
    if (addr.state && !parts.includes(addr.state)) parts.push(addr.state)
    if (addr.country) parts.push(addr.country)
    
    return parts.join(', ') || result.display_name
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`pl-10 pr-10 ${selectedLocation ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {!isLoading && selectedLocation && <Check className="h-4 w-4 text-green-500" />}
          {!isLoading && error && <AlertCircle className="h-4 w-4 text-destructive" />}
        </div>
      </div>

      {error && !isOpen && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}

      {selectedLocation && (
        <p className="text-xs text-green-600 mt-1">
          Location verified - coordinates captured
        </p>
      )}

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
          {results.map((result) => (
            <button
              key={result.place_id}
              type="button"
              onClick={() => handleSelect(result)}
              className="w-full px-3 py-2 text-left hover:bg-muted transition-colors flex items-start gap-2"
            >
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <span className="text-sm">{formatDisplayName(result)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
