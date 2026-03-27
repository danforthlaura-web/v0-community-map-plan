import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email-service'
import { submissionRejectedEmail } from '@/lib/email-templates'

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
    const { reason } = await request.json()

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

    // Update submission status to rejected
    const { data, error } = await supabase
      .from('submissions')
      .update({ status: 'rejected' })
      .eq('id', submissionId)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to reject submission' },
        { status: 500 }
      )
    }

    // Send rejection email to user
    try {
      const rejectionEmail = submissionRejectedEmail(
        submission.name,
        submission.organization_name,
        reason
      )
      await sendEmail({
        to: submission.email,
        subject: rejectionEmail.subject,
        html: rejectionEmail.html,
      })
    } catch (emailError) {
      console.error('Error sending rejection email:', emailError)
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error rejecting submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
