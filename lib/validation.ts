// Form validation utilities

export interface ValidationError {
  field: string
  message: string
}

export function validateSubmissionForm(formData: any): ValidationError[] {
  const errors: ValidationError[] = []

  // Basic Details validation
  if (!formData.name || formData.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required' })
  }

  if (!formData.email || formData.email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' })
  }

  if (!formData.organizationName || formData.organizationName.trim().length === 0) {
    errors.push({ field: 'organizationName', message: 'Organization name is required' })
  }

  if (!formData.location || formData.location.trim().length === 0) {
    errors.push({ field: 'location', message: 'Location is required' })
  }

  if (!formData.startYear || formData.startYear < 2015 || formData.startYear > new Date().getFullYear()) {
    errors.push({ field: 'startYear', message: 'Please enter a valid year' })
  }

  if (formData.organizationWebsite && formData.organizationWebsite.trim().length > 0) {
    try {
      new URL(formData.organizationWebsite)
    } catch {
      errors.push({ field: 'organizationWebsite', message: 'Please enter a valid URL' })
    }
  }

  // Implementation Details validation
  if (formData.implementationSettings.length === 0) {
    errors.push({ field: 'implementationSettings', message: 'Please select at least one implementation setting' })
  }

  if (formData.learnerTypes.length === 0) {
    errors.push({ field: 'learnerTypes', message: 'Please select at least one learner type' })
  }

  if (formData.deviceUsage.length === 0) {
    errors.push({ field: 'deviceUsage', message: 'Please select at least one device usage method' })
  }

  if (formData.clientDevices.length === 0) {
    errors.push({ field: 'clientDevices', message: 'Please select the number of client devices' })
  }

  if (formData.serverDevices.length === 0) {
    errors.push({ field: 'serverDevices', message: 'Please select at least one server device' })
  }

  if (formData.clientDeviceTypes.length === 0) {
    errors.push({ field: 'clientDeviceTypes', message: 'Please select at least one client device type' })
  }

  if (formData.hardwareModel.length === 0) {
    errors.push({ field: 'hardwareModel', message: 'Please select a hardware implementation model' })
  }

  if (formData.blendedLearningModel.length === 0) {
    errors.push({ field: 'blendedLearningModel', message: 'Please select at least one blended learning model' })
  }

  if (!formData.kolibriUsageDescription || formData.kolibriUsageDescription.trim().length === 0) {
    errors.push({ field: 'kolibriUsageDescription', message: 'Please describe how Kolibri is used in your setting' })
  }

  // Content Details validation
  if (!formData.platformLanguage || formData.platformLanguage.trim().length === 0) {
    errors.push({ field: 'platformLanguage', message: 'Platform language is required' })
  }

  if (!formData.publicChannels || formData.publicChannels.trim().length === 0) {
    errors.push({ field: 'publicChannels', message: 'Please list the public channels you use' })
  }

  if (formData.usesKolibriStudio && formData.channelToken && formData.channelToken.trim().length === 0) {
    errors.push({ field: 'channelToken', message: 'Please provide your channel token' })
  }

  if (formData.reports && formData.reports.trim().length > 0) {
    try {
      new URL(formData.reports)
    } catch {
      errors.push({ field: 'reports', message: 'Please enter a valid URL for reports' })
    }
  }

  return errors
}

export function validateAdminLogin(email: string, password: string): ValidationError[] {
  const errors: ValidationError[] = []

  if (!email || email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' })
  }

  if (!password || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' })
  }

  return errors
}

export function hasErrors(errors: ValidationError[], field?: string): boolean {
  if (field) {
    return errors.some(e => e.field === field)
  }
  return errors.length > 0
}

export function getError(errors: ValidationError[], field: string): string | null {
  const error = errors.find(e => e.field === field)
  return error ? error.message : null
}
