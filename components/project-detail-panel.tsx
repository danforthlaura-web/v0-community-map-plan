'use client'

import { Button } from '@/components/ui/button'

export interface Project {
  id: string
  created_at: string
  // Basic Details
  name: string
  email: string
  organization_name: string
  location: string
  latitude: number
  longitude: number
  organization_website?: string
  start_year?: string
  // Implementation Details
  implementation_settings?: string[]
  learner_types?: string[]
  number_of_learners?: string
  number_of_teachers?: string
  device_usage?: string[]
  server_devices?: string[]
  client_device_types?: string[]
  hardware_model?: string[]
  blended_learning_model?: string[]
  kolibri_usage_description?: string
  // Content
  primary_language?: string
  public_channels?: string
  uses_kolibri_studio?: boolean
  // Media & Social
  photo_url?: string
  program_links?: Array<{ title: string; url: string }>
  testimonials?: string
  reports?: string
  twitter_handle?: string
  facebook_handle?: string
  instagram_handle?: string
  linkedin_handle?: string
  forum_username?: string
  other_social?: string
  receive_updates?: boolean
  email_visible?: boolean
}

interface ProjectDetailPanelProps {
  project: Project | null
  onClose: () => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-4 mt-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value?: string | number | boolean | null }) {
  if (value === undefined || value === null || value === '') return null
  const display = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2 text-sm">
      <span className="text-foreground/50 leading-relaxed">{label}</span>
      <span className="text-foreground leading-relaxed">{display}</span>
    </div>
  )
}

export default function ProjectDetailPanel({ project, onClose }: ProjectDetailPanelProps) {
  if (!project) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-lg z-50 bg-background shadow-2xl overflow-y-auto flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label={project.organization_name}
      >
        {/* Panel header */}
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground leading-tight">{project.organization_name}</h2>
            <p className="text-sm text-foreground/60 mt-0.5">{project.location}</p>
          </div>
          <button
            onClick={onClose}
            className="text-foreground/40 hover:text-foreground transition-colors mt-0.5 shrink-0"
            aria-label="Close panel"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Panel body */}
        <div className="px-6 py-5 flex-1">
          {/* Photo */}
          {project.photo_url && (
            <div className="mb-4 -mx-6">
              <img src={project.photo_url} alt={project.organization_name} className="w-full h-48 object-cover" />
            </div>
          )}

          {/* Description */}
          {project.kolibri_usage_description && (
            <p className="text-sm text-foreground leading-relaxed">{project.kolibri_usage_description}</p>
          )}

          {/* Stats row */}
          {(project.number_of_learners || project.number_of_teachers) && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {project.number_of_learners && (
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-primary">{project.number_of_learners}</p>
                  <p className="text-xs text-foreground/50 mt-0.5">Learners</p>
                </div>
              )}
              {project.number_of_teachers && (
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-primary">{project.number_of_teachers}</p>
                  <p className="text-xs text-foreground/50 mt-0.5">Teachers</p>
                </div>
              )}
            </div>
          )}

          {/* Organization */}
          <Section title="Organization">
            <Row label="Website" value={project.organization_website} />
            <Row label="Started" value={project.start_year} />
          </Section>

          {/* Implementation */}
          <Section title="Implementation">
            {project.implementation_settings && project.implementation_settings.length > 0 && (
              <Row label="Settings" value={project.implementation_settings.join(', ')} />
            )}
            {project.learner_types && project.learner_types.length > 0 && (
              <Row label="Learner types" value={project.learner_types.join(', ')} />
            )}
            {project.device_usage && project.device_usage.length > 0 && (
              <Row label="Device usage" value={project.device_usage.join(', ')} />
            )}
            {project.server_devices && project.server_devices.length > 0 && (
              <Row label="Server device(s)" value={project.server_devices.join(', ')} />
            )}
            {project.client_device_types && project.client_device_types.length > 0 && (
              <Row label="Client device types" value={project.client_device_types.join(', ')} />
            )}
            {project.hardware_model && project.hardware_model.length > 0 && (
              <Row label="Hardware model" value={project.hardware_model.join(', ')} />
            )}
            {project.blended_learning_model && project.blended_learning_model.length > 0 && (
              <Row label="Blended learning model" value={project.blended_learning_model.join(', ')} />
            )}
            <Row label="Uses Kolibri Studio" value={project.uses_kolibri_studio} />
            <Row label="Language" value={project.primary_language} />
            {project.public_channels && (
              <div className="mt-3">
                <p className="text-sm text-foreground/50 mb-2">Public Channels</p>
                <p className="text-sm text-foreground leading-relaxed">{project.public_channels}</p>
              </div>
            )}
          </Section>

          {/* Program Links */}
          {project.program_links && project.program_links.length > 0 && (
            <Section title="Program Links">
              <div className="space-y-2">
                {project.program_links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 bg-primary/5 border border-primary/10 rounded text-sm text-primary hover:bg-primary/10 transition-colors truncate"
                    title={link.url}
                  >
                    {link.title || link.url}
                  </a>
                ))}
              </div>
            </Section>
          )}

          {/* Social / links */}
          {(project.twitter_handle || project.facebook_handle || project.instagram_handle || project.linkedin_handle || project.forum_username || project.other_social) && (
            <Section title="Links & Social Media">
              <Row label="Twitter" value={project.twitter_handle} />
              <Row label="Facebook" value={project.facebook_handle} />
              <Row label="Instagram" value={project.instagram_handle} />
              <Row label="LinkedIn" value={project.linkedin_handle} />
              <Row label="Forum Username" value={project.forum_username} />
              <Row label="Other" value={project.other_social} />
              {project.reports && <Row label="Reports" value={project.reports} />}
            </Section>
          )}

          {/* Additional Info */}
          {project.testimonials && (
            <Section title="Testimonials">
              <p className="text-sm text-foreground leading-relaxed">{project.testimonials}</p>
            </Section>
          )}

          {/* Contact */}
          <Section title="Contact">
            <Row label="Submitted by" value={project.name} />
            {project.email_visible && <Row label="Email" value={project.email} />}
          </Section>
        </div>

        {/* Footer CTA */}
        <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 space-y-3">
          <a 
            href={`mailto:implementations@learningequality.org?subject=Request Changes for: ${encodeURIComponent(project.organization_name)}&body=Hello,%0A%0AI would like to request changes to my organization's entry on the Kolibri Map:%0A%0AOrganization: ${encodeURIComponent(project.organization_name)}%0ALocation: ${encodeURIComponent(project.location)}%0A%0AChanges requested:%0A%0A`}
            className="block"
          >
            <Button variant="outline" className="w-full">
              Request Changes
            </Button>
          </a>
          {project.email_visible && project.email && (
            <a href={`mailto:${project.email}`} className="block">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Contact {project.name?.split(' ')[0] ?? 'Team'}
              </Button>
            </a>
          )}
        </div>
      </aside>
    </>
  )
}
