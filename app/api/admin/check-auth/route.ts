import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Use service role key for admin checks (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    console.log('[v0] Check-auth called')
    console.log('[v0] Cookies:', request.cookies.getAll().map(c => c.name).join(', '))
    
    // Try to get access token from various possible cookie names
    let token = request.cookies.get('sb-access-token')?.value ||
                request.cookies.get('sb_access_token')?.value ||
                request.cookies.get('access_token')?.value
    
    console.log('[v0] Token found:', !!token)

    if (!token) {
      console.log('[v0] No token found, returning 401')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify the token with Supabase
    const { data, error } = await supabase.auth.getUser(token)
    console.log('[v0] Get user result:', { email: data?.user?.email, error: error?.message })

    if (error || !data.user) {
      console.log('[v0] User verification failed')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is an admin (verify against admin_users table by email)
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', data.user.email)
      .single()

    console.log('[v0] Admin check for email:', data.user.email, 'Result:', { adminData, adminError: adminError?.message })

    if (adminError || !adminData) {
      console.log('[v0] User is not an admin')
      return NextResponse.json(
        { error: 'Not an admin' },
        { status: 403 }
      )
    }

    console.log('[v0] Auth check successful, returning user')
    return NextResponse.json(
      { user: { email: data.user.email, id: data.user.id } },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Auth check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
