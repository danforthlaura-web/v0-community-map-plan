import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    console.log('[v0] Login attempt for username:', username)

    // Look up admin user by username
    const { data: adminUsers, error: lookupError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single()

    console.log('[v0] Admin user lookup:', { found: !!adminUsers, error: lookupError?.message })

    if (lookupError || !adminUsers) {
      console.log('[v0] User not found')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, adminUsers.password_hash)
    console.log('[v0] Password match:', passwordMatch)

    if (!passwordMatch) {
      console.log('[v0] Invalid password')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create a mock session
    const mockSession = {
      access_token: `mock-token-${adminUsers.id}`,
      refresh_token: `mock-refresh-${adminUsers.id}`,
      user: {
        id: adminUsers.id,
        email: adminUsers.email,
        username: adminUsers.username,
      }
    }

    console.log('[v0] Login successful for user:', username)

    // Create response with session
    const response = NextResponse.json(
      { success: true, user: mockSession.user, session: mockSession },
      { status: 200 }
    )

    return response
  } catch (error) {
    console.error('[v0] Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
