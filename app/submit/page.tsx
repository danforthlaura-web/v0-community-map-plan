'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { validateSubmissionForm, ValidationError } from '@/lib/validation'

const STEPS = [
  { id: 'basic', label: 'Basic Details' },
  { id: 'implementation', label: 'Implementation' },
  { id: 'content', label: 'Content' },
  { id: 'media', label: 'Media & Social' },
]

export default function SubmitPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Basic Details
    name: '',
    email: '',
    organizationName: '',
    location: '',
    organizationWebsite: '',
    startYear: '',

    // Implementation Details
    implementationSettings: [],
    learnerTypes: [],
    deviceUsage: [],
    clientDevices: [],
    serverDevices: [],
    clientDeviceTypes: [],
    hardwareModel: [],
    blendedLearningModel: [],
    kolibriUsageDescription: '',

    // Content Details
    publicChannels: '',
    usesKolibriStudio: false,

    // Media & Social
    testimonials: '',
    reports: '',
    twitterHandle: '',
    facebookHandle: '',
    instagramHandle: '',
    linkedInHandle: '',
    forumUsername: '',
    otherSocial: '',
    photoUrl: '',
    photoFile: null,
    programLinks: [],
    receiveUpdates: false,
    emailVisible: false,
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleCheckboxGroup = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value],
    }))
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFormData(prev => ({ ...prev, photoFile: file }))

    try {
      const formDataObj = new FormData()
      formDataObj.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataObj,
      })

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
    setFormData(prev => ({
      ...prev,
      programLinks: [...prev.programLinks, { title: '', url: '' }],
    }))
  }

  const handleRemoveProgramLink = (index) => {
    setFormData(prev => ({
      ...prev,
      programLinks: prev.programLinks.filter((_, i) => i !== index),
    }))
  }

  const handleProgramLinkChange = (index, field, value) => {
    setFormData(prev => {
      const newLinks = [...prev.programLinks]
      newLinks[index] = { ...newLinks[index], [field]: value }
      return { ...prev, programLinks: newLinks }
    })
  }

  const handleNext = () => {
    // Validate current step before moving to next
    const errors = validateSubmissionForm(formData)
    const stepErrors = errors.filter(e => {
      if (currentStep === 0) return ['name', 'email', 'organizationName', 'location', 'organizationWebsite', 'startYear'].includes(e.field)
      if (currentStep === 1) return ['implementationSettings', 'learnerTypes', 'deviceUsage', 'clientDevices', 'serverDevices', 'clientDeviceTypes', 'hardwareModel', 'blendedLearningModel', 'kolibriUsageDescription'].includes(e.field)
      if (currentStep === 2) return ['publicChannels', 'reports'].includes(e.field)
      return false
    })

    if (stepErrors.length > 0) {
      setValidationErrors(stepErrors)
      return
    }

    setValidationErrors([])
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Final validation
    const errors = validateSubmissionForm(formData)
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          photoUrl: formData.photoUrl,
          programLinks: formData.programLinks,
        }),
      })
      
      if (response.ok) {
        setSubmitSuccess(true)
        setValidationErrors([])
        setFormData({
          name: '', email: '', organizationName: '', location: '', organizationWebsite: '', startYear: '',
          implementationSettings: [], learnerTypes: [], deviceUsage: [], clientDevices: [],
          serverDevices: [], clientDeviceTypes: [], hardwareModel: [], blendedLearningModel: [],
          kolibriUsageDescription: '', publicChannels: '', usesKolibriStudio: false,
          testimonials: '', reports: '',
          twitterHandle: '', facebookHandle: '', instagramHandle: '', linkedInHandle: '', forumUsername: '', otherSocial: '',
          photoUrl: '', photoFile: null, programLinks: [],
          receiveUpdates: false, emailVisible: false,
        })
        setCurrentStep(0)
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000)
      } else {
        const data = await response.json()
        setSubmitError(data.error || 'Failed to submit form. Please try again.')
      }
    } catch (error) {
      setSubmitError('An error occurred. Please try again.')
      console.error('Submission error:', error)
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
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">K</span>
            </div>
            <span className="font-bold text-lg text-foreground">Kolibri Map</span>
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-colors ${
                    idx <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {idx + 1}
                </div>
                <span className={`text-sm text-center ${idx <= currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{STEPS[currentStep].label}</CardTitle>
            <CardDescription>
              Step {currentStep + 1} of {STEPS.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  ✓ Thank you! Your submission has been received. Our team will review it and get back to you soon.
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
                    <li key={idx}>• {error.message}</li>
                  ))}
                </ul>
              </div>
            )}
            <form onSubmit={currentStep === STEPS.length - 1 ? handleSubmit : (e) => e.preventDefault()}>
              {/* Step 1: Basic Details */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Name *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Email Address *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Organization Name *
                    </label>
                    <Input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      placeholder="Enter organization name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Location (City, Country) *
                    </label>
                    <Input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Nairobi, Kenya"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Organization Website
                    </label>
                    <Input
                      type="url"
                      name="organizationWebsite"
                      value={formData.organizationWebsite}
                      onChange={handleInputChange}
                      placeholder="https://example.org"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Year You Started with Kolibri *
                    </label>
                    <Input
                      type="number"
                      name="startYear"
                      value={formData.startYear}
                      onChange={handleInputChange}
                      placeholder="2024"
                      min="2015"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Implementation Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Implementation Setting *
                    </label>
                    <div className="space-y-2">
                      {['In a school', 'In a community center', 'In an after school program', 'In a vocational program', 'In a refugee camp', 'In a correctional facility', 'In a homeschool setting', 'Other'].map(setting => (
                        <label key={setting} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={formData.implementationSettings.includes(setting)}
                            onCheckedChange={() => handleCheckboxGroup('implementationSettings', setting)}
                          />
                          <span className="text-sm text-foreground">{setting}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Learner Types *
                    </label>
                    <div className="space-y-2">
                      {['Pre-Primary', 'Primary', 'Secondary', 'Tertiary', 'Adult', 'Teachers/Coaches'].map(type => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={formData.learnerTypes.includes(type)}
                            onCheckedChange={() => handleCheckboxGroup('learnerTypes', type)}
                          />
                          <span className="text-sm text-foreground">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Device Usage During Kolibri Session *
                    </label>
                    <div className="space-y-2">
                      {['Individual learning', 'Group work', 'Whole class instruction'].map(usage => (
                        <label key={usage} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={formData.deviceUsage.includes(usage)}
                            onCheckedChange={() => handleCheckboxGroup('deviceUsage', usage)}
                          />
                          <span className="text-sm text-foreground">{usage}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Number of Client Devices per Server *
                    </label>
                    <div className="space-y-2">
                      {['1-10', '11-20', '21-30', 'More than 30'].map(range => (
                        <label key={range} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={formData.clientDevices.includes(range)}
                            onCheckedChange={() => handleCheckboxGroup('clientDevices', range)}
                          />
                          <span className="text-sm text-foreground">{range}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Server Device(s) *
                    </label>
                    <div className="space-y-2">
                      {['RACHEL devices', 'Raspberry Pi', 'Laptop', 'Desktop computer', 'Other'].map(device => (
                        <label key={device} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={formData.serverDevices.includes(device)}
                            onCheckedChange={() => handleCheckboxGroup('serverDevices', device)}
                          />
                          <span className="text-sm text-foreground">{device}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Client Device Types *
                    </label>
                    <div className="space-y-2">
                      {['Chromebook', 'Smartphone', 'Tablets', 'Other'].map(device => (
                        <label key={device} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={formData.clientDeviceTypes.includes(device)}
                            onCheckedChange={() => handleCheckboxGroup('clientDeviceTypes', device)}
                          />
                          <span className="text-sm text-foreground">{device}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Hardware Implementation Model *
                    </label>
                    <div className="space-y-2">
                      {['Single user model', 'Stationary computer lab', 'Portable lab', 'Other'].map(model => (
                        <label key={model} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={formData.hardwareModel.includes(model)}
                            onCheckedChange={() => handleCheckboxGroup('hardwareModel', model)}
                          />
                          <span className="text-sm text-foreground">{model}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Blended Learning Model *
                    </label>
                    <div className="space-y-2">
                      {['Rotation model', 'Peer Learning', 'Roving teacher model', 'Whole class projector model', 'Self-paced learning', 'Distance learning', 'Other'].map(model => (
                        <label key={model} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={formData.blendedLearningModel.includes(model)}
                            onCheckedChange={() => handleCheckboxGroup('blendedLearningModel', model)}
                          />
                          <span className="text-sm text-foreground">{model}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      How Kolibri is Used in Your Setting *
                    </label>
                    <Textarea
                      name="kolibriUsageDescription"
                      value={formData.kolibriUsageDescription}
                      onChange={handleInputChange}
                      placeholder="Describe how Kolibri is used..."
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Content Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Favorite Channels from the Kolibri Library *
                    </label>
                    <Textarea
                      name="publicChannels"
                      value={formData.publicChannels}
                      onChange={handleInputChange}
                      placeholder="List your favorite channels from the Kolibri Content Library"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={formData.usesKolibriStudio}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, usesKolibriStudio: checked }))}
                      />
                      <span className="text-sm font-medium text-foreground">I use Kolibri Studio to curate local content</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 4: Media & Social */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Project Photo
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        disabled={isSubmitting}
                        className="block w-full text-sm text-foreground/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                    </div>
                    {formData.photoUrl && (
                      <div className="mt-3">
                        <p className="text-xs text-foreground/60 mb-2">Preview:</p>
                        <img src={formData.photoUrl} alt="Project preview" className="max-w-xs h-auto rounded-lg border border-border" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Program Links
                    </label>
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
                            className="flex-2"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveProgramLink(index)}
                            className="shrink-0"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddProgramLink}
                        className="w-full border-primary text-primary hover:bg-primary/5"
                      >
                        + Add Link
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Testimonials/Stories
                    </label>
                    <Textarea
                      name="testimonials"
                      value={formData.testimonials}
                      onChange={handleInputChange}
                      placeholder="Share any testimonials or stories from your program (Optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Reports/White Papers
                    </label>
                    <Input
                      type="url"
                      name="reports"
                      value={formData.reports}
                      onChange={handleInputChange}
                      placeholder="Link to any reports or white papers (Optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Social Media & Community Handles
                    </label>
                    <div className="space-y-3">
                      <Input
                        type="text"
                        name="twitterHandle"
                        value={formData.twitterHandle}
                        onChange={handleInputChange}
                        placeholder="Twitter handle (Optional)"
                      />
                      <Input
                        type="text"
                        name="facebookHandle"
                        value={formData.facebookHandle}
                        onChange={handleInputChange}
                        placeholder="Facebook (Optional)"
                      />
                      <Input
                        type="text"
                        name="instagramHandle"
                        value={formData.instagramHandle}
                        onChange={handleInputChange}
                        placeholder="Instagram (Optional)"
                      />
                      <Input
                        type="text"
                        name="linkedInHandle"
                        value={formData.linkedInHandle}
                        onChange={handleInputChange}
                        placeholder="LinkedIn (Optional)"
                      />
                      <Input
                        type="text"
                        name="forumUsername"
                        value={formData.forumUsername}
                        onChange={handleInputChange}
                        placeholder="Learning Equality Community Forum username (Optional)"
                      />
                      <Input
                        type="text"
                        name="otherSocial"
                        value={formData.otherSocial}
                        onChange={handleInputChange}
                        placeholder="Other social media (Optional)"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={formData.receiveUpdates}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, receiveUpdates: checked }))}
                      />
                      <span className="text-sm text-foreground">
                        I want to receive updates from Learning Equality about Kolibri
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={formData.emailVisible}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, emailVisible: checked }))}
                      />
                      <span className="text-sm text-foreground">
                        Make my email visible so others can connect with me
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 0 || isSubmitting}
                  className="flex-1"
                >
                  Previous
                </Button>
                {currentStep === STEPS.length - 1 ? (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Next
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
