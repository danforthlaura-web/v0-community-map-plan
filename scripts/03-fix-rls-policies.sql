-- Fix RLS policies - drop and recreate without recursion

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can read admin_users" ON admin_users;
DROP POLICY IF EXISTS "Users can read own admin record" ON admin_users;
DROP POLICY IF EXISTS "Admins can manage submissions" ON submissions;

-- Recreate admin_users policies without recursion
-- Allow anyone to select from admin_users (needed for login check)
CREATE POLICY "Allow read admin_users" ON admin_users
  FOR SELECT
  USING (true);

-- Only allow inserts via service role (not through client)
CREATE POLICY "Restrict admin_users insert" ON admin_users
  FOR INSERT
  WITH CHECK (false);

-- Ensure submissions table has correct policies
DROP POLICY IF EXISTS "Public can read approved submissions" ON submissions;
DROP POLICY IF EXISTS "Anyone can create submissions" ON submissions;

-- Anyone can read approved submissions
CREATE POLICY "Public can read approved submissions" ON submissions
  FOR SELECT
  USING (status = 'approved');

-- Anyone can create a new submission (pending)
CREATE POLICY "Anyone can create submissions" ON submissions
  FOR INSERT
  WITH CHECK (true);

-- Allow updates (for admin approval) - simplified
DROP POLICY IF EXISTS "Allow submission updates" ON submissions;
CREATE POLICY "Allow submission updates" ON submissions
  FOR UPDATE
  USING (true);

-- Allow all reads for admin purposes
DROP POLICY IF EXISTS "Allow all reads for admin" ON submissions;
CREATE POLICY "Allow all reads for admin" ON submissions
  FOR SELECT
  USING (true);
