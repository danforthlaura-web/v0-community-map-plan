import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[v0] Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  const email = 'laura@learningequality.org';
  const password = 'Learning123';

  try {
    console.log(`[v0] Creating admin user: ${email}`);

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error('[v0] Error creating auth user:', authError.message);
      process.exit(1);
    }

    console.log(`[v0] Auth user created with ID: ${authData.user.id}`);

    // Add to admin_users table
    const { error: dbError } = await supabase
      .from('admin_users')
      .insert([
        {
          id: authData.user.id,
          email,
          password_hash: 'managed_by_supabase_auth',
        },
      ]);

    if (dbError) {
      console.error('[v0] Error adding to admin_users table:', dbError.message);
      process.exit(1);
    }

    console.log(`[v0] ✅ Admin user created successfully!`);
    console.log(`[v0] Email: ${email}`);
    console.log(`[v0] Password: ${password}`);
    console.log(`[v0] You can now login at /admin`);
  } catch (error) {
    console.error('[v0] Unexpected error:', error);
    process.exit(1);
  }
}

createAdminUser();
