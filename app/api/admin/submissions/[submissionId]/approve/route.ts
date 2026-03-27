import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email-service'
import { submissionApprovedEmail } from '@/lib/email-templates'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(
  request: NextRequest,
  { params }: { params: { submissionId: string } }
) {
  try {
    const token = request.cookies.get('sb-access-token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { submissionId } = params

    // Get submission details
    const { data: submission, error: getError } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (getError || !submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Update submission status to approved
    const { data, error } = await supabase
      .from('submissions')
      .update({ status: 'approved' })
      .eq('id', submissionId)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to approve submission' },
        { status: 500 }
      )
    }

    // Send approval email to user
    try {
      const approvalEmail = submissionApprovedEmail(
        submission.name,
        submission.organization_name,
        `${process.env.NEXT_PUBLIC_APP_URL}/map`
      )
      await sendEmail({
        to: submission.email,
        subject: approvalEmail.subject,
        html: approvalEmail.html,
      })
    } catch (emailError) {
      console.error('Error sending approval email:', emailError)
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error approving submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
