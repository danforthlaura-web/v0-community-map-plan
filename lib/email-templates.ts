// Email notification templates

export const submissionConfirmationEmail = (name: string, organizationName: string) => ({
  subject: 'Thank you for your Kolibri submission!',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4436F5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Kolibri Community Map</h1>
      </div>
      <div style="padding: 20px; background-color: #f9fafb;">
        <p>Hi ${name},</p>
        <p>Thank you for submitting your Kolibri implementation story! We're excited to learn about how <strong>${organizationName}</strong> is using Kolibri to support learning.</p>
        <p>Our team will review your submission and get back to you within a few days. Once approved, your implementation will appear on the Kolibri Community Map for others to discover.</p>
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          If you have any questions, feel free to reach out to the Learning Equality team.
        </p>
        <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
          Best regards,<br/>
          The Learning Equality Team
        </p>
      </div>
    </div>
  `,
})

export const submissionApprovedEmail = (name: string, organizationName: string, mapUrl: string) => ({
  subject: 'Your Kolibri implementation is now live!',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4436F5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Kolibri Community Map</h1>
      </div>
      <div style="padding: 20px; background-color: #f9fafb;">
        <p>Hi ${name},</p>
        <p>Great news! Your Kolibri implementation story for <strong>${organizationName}</strong> has been approved and is now live on the Kolibri Community Map!</p>
        <p>
          <a href="${mapUrl}" style="display: inline-block; background-color: #4436F5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            View Your Implementation on the Map
          </a>
        </p>
        <p style="margin-top: 30px;">Other educators and implementers can now find and connect with you through the map. Thank you for being part of the global Kolibri community!</p>
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          Best regards,<br/>
          The Learning Equality Team
        </p>
      </div>
    </div>
  `,
})

export const submissionRejectedEmail = (name: string, organizationName: string, reason?: string) => ({
  subject: 'Update on your Kolibri submission',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4436F5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Kolibri Community Map</h1>
      </div>
      <div style="padding: 20px; background-color: #f9fafb;">
        <p>Hi ${name},</p>
        <p>Thank you for submitting your Kolibri implementation story for <strong>${organizationName}</strong>.</p>
        <p>After reviewing your submission, we're unable to feature it on the Kolibri Community Map at this time.</p>
        ${reason ? `<p style="background-color: #fef2f2; padding: 12px; border-left: 4px solid #ef4444; margin: 20px 0;"><strong>Reason:</strong> ${reason}</p>` : ''}
        <p>If you have any questions or would like to resubmit with updates, please don't hesitate to reach out to us.</p>
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          Best regards,<br/>
          The Learning Equality Team
        </p>
      </div>
    </div>
  `,
})

export const adminNotificationEmail = (organizationName: string, submitterName: string, submitterEmail: string, reviewUrl: string) => ({
  subject: `New Kolibri submission: ${organizationName}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4436F5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Kolibri Admin Notification</h1>
      </div>
      <div style="padding: 20px; background-color: #f9fafb;">
        <p>A new Kolibri implementation submission has been received!</p>
        <p style="background-color: #fffbeb; padding: 12px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <strong>Organization:</strong> ${organizationName}<br/>
          <strong>Submitter:</strong> ${submitterName} (${submitterEmail})
        </p>
        <p>
          <a href="${reviewUrl}" style="display: inline-block; background-color: #4436F5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Review Submission
          </a>
        </p>
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          Please log in to the admin dashboard to review and approve/reject this submission.
        </p>
      </div>
    </div>
  `,
})
