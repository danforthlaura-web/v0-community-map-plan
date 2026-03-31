-- Fix RLS policies to allow proper access

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can submit" ON submissions;
DROP POLICY IF EXISTS "Authenticated users can read" ON submissions;
DROP POLICY IF EXISTS "Authenticated users can update" ON submissions;

-- Allow anyone to insert (public form submission)
CREATE POLICY "Anyone can submit" ON submissions
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read approved submissions (for the public map)
CREATE POLICY "Anyone can read approved" ON submissions
  FOR SELECT USING (status = 'approved');

-- Allow service role to read all submissions (for admin dashboard)
CREATE POLICY "Service role can read all" ON submissions
  FOR SELECT USING (true);

-- Allow service role to update submissions (for admin actions)
CREATE POLICY "Service role can update" ON submissions
  FOR UPDATE USING (true);
