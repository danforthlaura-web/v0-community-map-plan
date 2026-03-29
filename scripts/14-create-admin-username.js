import { createClient } from '@supabase/supabase-js'
import * as bcrypt from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser() {
  try {
    const username = 'admin'
    const password = 'Learning123'

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert into admin_users table
    const { data, error } = await supabase
      .from('admin_users')
      .insert([
        {
          username,
          password_hash: hashedPassword,
          email: 'admin@example.com',
        },
      ])
      .select()

    if (error) {
      console.error('Error creating admin user:', error.message)
      process.exit(1)
    }

    console.log('Admin user created successfully:', data)
    console.log('Username: admin')
    console.log('Password: Learning123')
  } catch (err) {
    console.error('Error:', err)
    process.exit(1)
  }
}

createAdminUser()
