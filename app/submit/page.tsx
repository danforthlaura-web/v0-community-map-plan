'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { LocationAutocomplete } from '@/components/location-autocomplete'

export default function SubmitPage() {
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Basic Details
    name: '',
    email: '',
    organizationName: '',
    location: '',
    latitude: null as number | null,
    longitude: null as number | null,
    organizationWebsite: '',
    startYear: '',

    // Implementation Details
    implementationSettings: [] as string[],
    learnerTypes: [] as string[],
    numberOfLearners: '',
    numberOfTeachers: '',
    deviceUsage: [] as string[],
    serverDevices: [] as string[],
    clientDeviceTypes: [] as string[],
    hardwareModel: [] as string[],
    blendedLearningModel: [] as string[],
    kolibriUsageDescription: '',

    // Content Details
    primaryLanguage: '',
    publicChannels: '',
    usesKolibriStudio: false,

    // Media & Social
    photoUrl: '',
    photoFile: null as File | null,
    programLinks: [] as { title: string; url: string }[],
    testimonials: '',
    reports: '',
    twitterHandle: '',
    facebookHandle: '',
    instagramHandle: '',
    linkedInHandle: '',
    forumUsername: '',
    otherSocial: '',
    receiveUpdates: false,
    emailVisible: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleCheckboxGroup = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(value)
        ? (prev[field] as string[]).filter(item => item !== value)
        : [...(prev[field] as string[]), value],
    }))
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFormData(prev => ({ ...prev, photoFile: file }))
    try {
      const formDataObj = new FormData()
      formDataObj.append('file', file)
      const response = await fetch('/api/upload', { method: 'POST', body: formDataObj })
      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, photoUrl: data.url }))
      }
    } catch (error) {
      console.error('Photo upload error:', error)
      setSubmitError('Failed to upload photo')
    }
  }

  const handleAddProgramLink = () => {
    setFormData(prev => ({ ...prev, programLinks: [...prev.programLinks, { title: '', url: '' }] }))
  }

  const handleRemoveProgramLink = (index: number) => {
    setFormData(prev => ({ ...prev, programLinks: prev.programLinks.filter((_, i) => i !== index) }))
  }

  const handleProgramLinkChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newLinks = [...prev.programLinks]
      newLinks[index] = { ...newLinks[index], [field]: value }
      return { ...prev, programLinks: newLinks }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors: string[] = []
    if (!formData.name) errors.push('Your name is required')
    if (!formData.email) errors.push('Your email is required')
    if (!formData.organizationName) errors.push('Organization name is required')
    if (!formData.location) errors.push('Location is required')
    if (!formData.latitude || !formData.longitude) errors.push('Please select a location from the dropdown to verify it')
    if (!formData.startYear) errors.push('Start year is required')
    if (formData.implementationSettings.length === 0) errors.push('Please select at least one implementation setting')
    if (formData.learnerTypes.length === 0) errors.push('Please select at least one learner type')
    if (!formData.kolibriUsageDescription) errors.push('Please describe how Kolibri is used in your setting')
    if (!formData.primaryLanguage) errors.push('Primary language of instruction is required')
    if (!formData.publicChannels) errors.push('Please list your favorite channels from the Kolibri Library')

    if (errors.length > 0) {
      setValidationErrors(errors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setValidationErrors([])
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setFormData({
          name: '', email: '', organizationName: '', location: '', latitude: null, longitude: null, organizationWebsite: '', startYear: '',
          implementationSettings: [], learnerTypes: [], numberOfLearners: '', numberOfTeachers: '',
          deviceUsage: [], serverDevices: [], clientDeviceTypes: [], hardwareModel: [], blendedLearningModel: [],
          kolibriUsageDescription: '', primaryLanguage: '', publicChannels: '', usesKolibriStudio: false,
          photoUrl: '', photoFile: null, programLinks: [], testimonials: '', reports: '',
          twitterHandle: '', facebookHandle: '', instagramHandle: '', linkedInHandle: '',
          forumUsername: '', otherSocial: '', receiveUpdates: false, emailVisible: false,
        })
      } else {
        const data = await response.json()
        setSubmitError(data.error || 'Failed to submit. Please try again.')
      }
    } catch {
      setSubmitError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/kolibri-logo.png"
              alt="Kolibri"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="font-bold text-lg text-foreground">Kolibri Map</span>
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Add Your Program</h1>
          <p className="text-foreground/60">Share your Kolibri implementation with the global community. Fields marked with * are required.</p>
        </div>

        {/* Status messages */}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              Thank you! Your submission has been received. Our team will review it and get back to you soon.
            </p>
          </div>
        )}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error: {submitError}</p>
          </div>
        )}
        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-medium mb-2">Please fix the following errors:</p>
            <ul className="text-yellow-800 text-sm space-y-1">
              {validationErrors.map((error, idx) => (
                <li key={idx}>- {error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Section: Basic Details */}
          <section>
            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-5">Basic Details</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Your Name *</label>
                <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Your Email Address *</label>
                <Input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Organization Name *</label>
                <Input name="organizationName" value={formData.organizationName} onChange={handleInputChange} placeholder="Enter organization name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Location *</label>
                <LocationAutocomplete
                  value={formData.location}
                  onChange={(location, latitude, longitude) => {
                    setFormData(prev => ({
                      ...prev,
                      location,
                      latitude,
                      longitude,
                    }))
                  }}
                  placeholder="Search for your city, town, or village..."
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground mt-1">Start typing and select from the dropdown to verify your location</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Organization Website</label>
                <Input type="url" name="organizationWebsite" value={formData.organizationWebsite} onChange={handleInputChange} placeholder="https://example.org" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Year You Started with Kolibri *</label>
                <Input
                  type="number"
                  name="startYear"
                  value={formData.startYear}
                  onChange={handleInputChange}
                  placeholder="2024"
                  min="2015"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>
          </section>

          {/* Section: Implementation Details */}
          <section>
            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-5">Implementation Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Implementation Setting *</label>
                <div className="space-y-2">
                  {['In a school', 'In a community center', 'In an after school program', 'In a vocational program', 'In a refugee camp', 'In a correctional facility', 'In a homeschool setting', 'Other'].map(setting => (
                    <label key={setting} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={formData.implementationSettings.includes(setting)} onCheckedChange={() => handleCheckboxGroup('implementationSettings', setting)} />
                      <span className="text-sm text-foreground">{setting}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Learner Types *</label>
                <div className="space-y-2">
                  {['Pre-Primary', 'Primary', 'Secondary', 'Tertiary', 'Adult', 'Teachers/Coaches'].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={formData.learnerTypes.includes(type)} onCheckedChange={() => handleCheckboxGroup('learnerTypes', type)} />
                      <span className="text-sm text-foreground">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Number of Learners</label>
                <Input
                  name="numberOfLearners"
                  value={formData.numberOfLearners}
                  onChange={handleInputChange}
                  placeholder="e.g., 120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Number of Teachers</label>
                <Input
                  name="numberOfTeachers"
                  value={formData.numberOfTeachers}
                  onChange={handleInputChange}
                  placeholder="e.g., 8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Device Usage During Kolibri Session</label>
                <div className="space-y-2">
                  {['Individual learning', 'Group work', 'Whole class instruction'].map(usage => (
                    <label key={usage} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={formData.deviceUsage.includes(usage)} onCheckedChange={() => handleCheckboxGroup('deviceUsage', usage)} />
                      <span className="text-sm text-foreground">{usage}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Server Device(s)</label>
                <div className="space-y-2">
                  {['RACHEL devices', 'Raspberry Pi', 'Laptop', 'Desktop computer', 'Other'].map(device => (
                    <label key={device} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={formData.serverDevices.includes(device)} onCheckedChange={() => handleCheckboxGroup('serverDevices', device)} />
                      <span className="text-sm text-foreground">{device}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Client Device Types</label>
                <div className="space-y-2">
                  {['Chromebook', 'Smartphone', 'Tablets', 'Other'].map(device => (
                    <label key={device} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={formData.clientDeviceTypes.includes(device)} onCheckedChange={() => handleCheckboxGroup('clientDeviceTypes', device)} />
                      <span className="text-sm text-foreground">{device}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Hardware Implementation Model</label>
                <div className="space-y-2">
                  {['Single user model', 'Stationary computer lab', 'Portable lab', 'Other'].map(model => (
                    <label key={model} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={formData.hardwareModel.includes(model)} onCheckedChange={() => handleCheckboxGroup('hardwareModel', model)} />
                      <span className="text-sm text-foreground">{model}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Blended Learning Model</label>
                <div className="space-y-2">
                  {['Rotation model', 'Peer Learning', 'Roving teacher model', 'Whole class projector model', 'Self-paced learning', 'Distance learning', 'Other'].map(model => (
                    <label key={model} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={formData.blendedLearningModel.includes(model)} onCheckedChange={() => handleCheckboxGroup('blendedLearningModel', model)} />
                      <span className="text-sm text-foreground">{model}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">How Kolibri is Used in Your Setting *</label>
                <Textarea
                  name="kolibriUsageDescription"
                  value={formData.kolibriUsageDescription}
                  onChange={handleInputChange}
                  placeholder="Describe how Kolibri is used in your program..."
                  rows={4}
                />
              </div>
            </div>
          </section>

          {/* Section: Content */}
          <section>
            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-5">Content</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Primary Language of Instruction *</label>
                <Input name="primaryLanguage" value={formData.primaryLanguage} onChange={handleInputChange} placeholder="e.g., English, Spanish, Swahili" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Kolibri Library Channels *</label>
                <Textarea
                  name="publicChannels"
                  value={formData.publicChannels}
                  onChange={handleInputChange}
                  placeholder="List your favorite channels from the Kolibri Content Library"
                  rows={3}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.usesKolibriStudio}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, usesKolibriStudio: !!checked }))}
                  />
                  <span className="text-sm text-foreground">I use Kolibri Studio to curate local content</span>
                </label>
              </div>
            </div>
          </section>

          {/* Section: Media & Social */}
          <section>
            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2 mb-5">Media &amp; Social</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Project Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isSubmitting}
                  className="block w-full text-sm text-foreground/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {formData.photoUrl && (
                  <div className="mt-3">
                    <p className="text-xs text-foreground/60 mb-2">Preview:</p>
                    <img src={formData.photoUrl} alt="Project preview" className="max-w-xs h-auto rounded-lg border border-border" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Program Links</label>
                <p className="text-xs text-foreground/60 mb-3">Add links to relevant programs, websites, or resources</p>
                <div className="space-y-3">
                  {formData.programLinks.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Link title"
                        value={link.title}
                        onChange={(e) => handleProgramLinkChange(index, 'title', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        value={link.url}
                        onChange={(e) => handleProgramLinkChange(index, 'url', e.target.value)}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" size="sm" onClick={() => handleRemoveProgramLink(index)} className="shrink-0">
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={handleAddProgramLink} className="w-full border-primary text-primary hover:bg-primary/5">
                    + Add Link
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Testimonials / Stories</label>
                <Textarea
                  name="testimonials"
                  value={formData.testimonials}
                  onChange={handleInputChange}
                  placeholder="Share any testimonials or stories from your program (Optional)"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Reports / White Papers</label>
                <Input type="url" name="reports" value={formData.reports} onChange={handleInputChange} placeholder="Link to any reports or white papers (Optional)" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Social Media &amp; Community Handles</label>
                <div className="space-y-3">
                  <Input name="twitterHandle" value={formData.twitterHandle} onChange={handleInputChange} placeholder="Twitter handle (Optional)" />
                  <Input name="facebookHandle" value={formData.facebookHandle} onChange={handleInputChange} placeholder="Facebook (Optional)" />
                  <Input name="instagramHandle" value={formData.instagramHandle} onChange={handleInputChange} placeholder="Instagram (Optional)" />
                  <Input name="linkedInHandle" value={formData.linkedInHandle} onChange={handleInputChange} placeholder="LinkedIn (Optional)" />
                  <Input name="forumUsername" value={formData.forumUsername} onChange={handleInputChange} placeholder="Learning Equality Community Forum username (Optional)" />
                  <Input name="otherSocial" value={formData.otherSocial} onChange={handleInputChange} placeholder="Other social media (Optional)" />
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.receiveUpdates}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, receiveUpdates: !!checked }))}
                  />
                  <span className="text-sm text-foreground">I want to receive updates from Learning Equality about Kolibri</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.emailVisible}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, emailVisible: !!checked }))}
                  />
                  <span className="text-sm text-foreground">Make my email visible so others can connect with me</span>
                </label>
              </div>
            </div>
          </section>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-semibold"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Your Program'}
          </Button>
        </form>
      </div>
    </main>
  )
}
