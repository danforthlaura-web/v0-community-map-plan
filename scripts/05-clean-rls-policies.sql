-- Drop all RLS policies on admin_users to clear recursion
DROP POLICY IF EXISTS "Only admins can manage admin users" ON admin_users;
DROP POLICY IF EXISTS "Allow read admin_users" ON admin_users;
DROP POLICY IF EXISTS "Restrict admin_users insert" ON admin_users;
DROP POLICY IF EXISTS "Public read admin users" ON admin_users;

-- Keep RLS enabled but create a simple non-recursive policy
-- Allow public select on admin_users (for checking if admin exists)
CREATE POLICY "public_can_read_admin_users"
  ON admin_users
  FOR SELECT
  USING (true);

-- Allow inserts only with a valid token (auth.uid)
CREATE POLICY "authenticated_can_insert_admin"
  ON admin_users
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Drop problematic policies on submissions if any
DROP POLICY IF EXISTS "Allow all reads for admin" ON submissions;
DROP POLICY IF EXISTS "Admins can view all submissions" ON submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON submissions;

-- Keep the simple, non-recursive ones
-- Public can view approved submissions
DROP POLICY IF EXISTS "Anyone can view approved submissions" ON submissions;
DROP POLICY IF EXISTS "Public can read approved submissions" ON submissions;
DROP POLICY IF EXISTS "Public read approved submissions" ON submissions;

CREATE POLICY "public_view_approved_submissions"
  ON submissions
  FOR SELECT
  USING (status = 'approved');

-- Anyone can create submissions
DROP POLICY IF EXISTS "Anyone can create submissions" ON submissions;
DROP POLICY IF EXISTS "Anyone can insert submissions" ON submissions;
DROP POLICY IF EXISTS "Authenticated insert submissions" ON submissions;

CREATE POLICY "public_can_insert_submissions"
  ON submissions
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated updates (for admins only - they'll check auth server-side)
DROP POLICY IF EXISTS "Allow submission updates" ON submissions;

CREATE POLICY "authenticated_can_update_submissions"
  ON submissions
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);
