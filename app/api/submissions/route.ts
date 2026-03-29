import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email-service'
import { submissionConfirmationEmail, adminNotificationEmail } from '@/lib/email-templates'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Insert into submissions table with pending status
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        name: formData.name,
        email: formData.email,
        organization_name: formData.organizationName,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        organization_website: formData.organizationWebsite,
        start_year: formData.startYear,
        implementation_settings: formData.implementationSettings,
        learner_types: formData.learnerTypes,
        device_usage: formData.deviceUsage,
        client_devices: formData.clientDevices,
        server_devices: formData.serverDevices,
        client_device_types: formData.clientDeviceTypes,
        hardware_model: formData.hardwareModel,
        blended_learning_model: formData.blendedLearningModel,
        kolibri_usage_description: formData.kolibriUsageDescription,
        platform_language: formData.platformLanguage,
        public_channels: formData.publicChannels,
        uses_kolibri_studio: formData.usesKolibriStudio,
        channel_description: formData.channelDescription,
        channel_token: formData.channelToken,
        learning_goals: formData.learningGoals,
        testimonials: formData.testimonials,
        reports: formData.reports,
        twitter_handle: formData.twitterHandle,
        facebook_handle: formData.facebookHandle,
        instagram_handle: formData.instagramHandle,
        linkedin_handle: formData.linkedInHandle,
        other_social: formData.otherSocial,
        receive_updates: formData.receiveUpdates,
        email_visible: formData.emailVisible,
        photo_url: formData.photoUrl,
        program_links: formData.programLinks,
        status: 'pending',
      })
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to submit form' },
        { status: 500 }
      )
    }

    // Send confirmation email to user
    try {
      const confirmationEmail = submissionConfirmationEmail(
        formData.name,
        formData.organizationName
      )
      await sendEmail({
        to: formData.email,
        subject: confirmationEmail.subject,
        html: confirmationEmail.html,
      })
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
      // Don't fail the submission if email fails
    }

    // Send notification email to admin
    try {
      const adminEmail = adminNotificationEmail(
        formData.organizationName,
        formData.name,
        formData.email,
        `${process.env.NEXT_PUBLIC_APP_URL}/admin/dashboard`
      )
      // Send to admin email address from env
      if (process.env.ADMIN_EMAIL) {
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: adminEmail.subject,
          html: adminEmail.html,
        })
      }
    } catch (emailError) {
      console.error('Error sending admin notification:', emailError)
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
