import { Resend } from 'resend'

// Lazily initialize Resend to avoid build-time errors when API key is not set
let resend: Resend | null = null

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set - emails will not be sent')
    return null
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  const client = getResendClient()
  
  if (!client) {
    console.log('Email skipped (no API key):', { to, subject })
    return { id: 'skipped' }
  }

  try {
    const result = await client.emails.send({
      from: 'noreply@kolibrimap.org',
      to,
      subject,
      html,
    })
    return result
  } catch (error) {
    console.error('Email send error:', error)
    throw error
  }
}
