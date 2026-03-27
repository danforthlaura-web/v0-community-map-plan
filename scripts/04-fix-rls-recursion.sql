-- Disable RLS on admin_users table to fix infinite recursion
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Disable RLS on submissions table to allow public queries
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;

-- Enable RLS again with simpler policies
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to approved submissions only
CREATE POLICY "Public read approved submissions"
  ON submissions
  FOR SELECT
  USING (status = 'approved');

-- Allow authenticated users to insert
CREATE POLICY "Authenticated insert submissions"
  ON submissions
  FOR INSERT
  WITH CHECK (true);

-- Admin table - allow select only
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read admin users"
  ON admin_users
  FOR SELECT
  USING (true);
