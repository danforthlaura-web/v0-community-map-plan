-- Disable RLS completely on all tables to fix infinite recursion
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow public read of approved submissions" ON submissions;
DROP POLICY IF EXISTS "Allow anyone to insert submissions" ON submissions;
DROP POLICY IF EXISTS "Allow authenticated admins to update submissions" ON submissions;
DROP POLICY IF EXISTS "Allow authenticated admins to delete submissions" ON submissions;

DROP POLICY IF EXISTS "Only admins can manage admin users" ON admin_users;
DROP POLICY IF EXISTS "Allow insert for self" ON admin_users;
DROP POLICY IF EXISTS "Allow update for self" ON admin_users;
DROP POLICY IF EXISTS "Allow select for all admins" ON admin_users;
