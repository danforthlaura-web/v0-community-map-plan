-- Create submissions table for Kolibri implementations
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  
  -- Basic Information
  organization_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_name TEXT,
  contact_phone TEXT,
  
  -- Location & Scope
  country TEXT,
  region TEXT,
  city TEXT,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  
  -- Implementation Details
  project_description TEXT,
  implementation_date DATE,
  number_of_students INTEGER,
  number_of_teachers INTEGER,
  number_of_devices INTEGER,
  
  -- Organization Details
  organization_type TEXT,
  organization_website TEXT,
  years_active INTEGER,
  
  -- Kolibri Details
  kolibri_version TEXT,
  channels_used TEXT[], -- Array of channel names
  primary_use_case TEXT,
  
  -- Content & Language
  primary_language TEXT,
  other_languages TEXT[],
  customized_content BOOLEAN DEFAULT FALSE,
  
  -- Challenges & Impact
  challenges_faced TEXT,
  measurable_impact TEXT,
  success_stories TEXT,
  
  -- Contact & Links
  social_media_links JSONB, -- Can store multiple links as JSON
  additional_notes TEXT
);

-- Create table for admin users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'moderator' CHECK (role IN ('moderator', 'admin'))
);

-- Create approval history table for audit trail
CREATE TABLE approval_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('approved', 'rejected', 'pending')),
  notes TEXT,
  email_sent_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_country ON submissions(country);
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX idx_approval_history_submission ON approval_history(submission_id);
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for submissions table
-- Anyone can view approved submissions
CREATE POLICY "Anyone can view approved submissions"
  ON submissions FOR SELECT
  USING (status = 'approved');

-- Anyone can insert submissions (public form)
CREATE POLICY "Anyone can insert submissions"
  ON submissions FOR INSERT
  WITH CHECK (TRUE);

-- Admin users can see all submissions
CREATE POLICY "Admins can view all submissions"
  ON submissions FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM admin_users WHERE role IN ('admin', 'moderator')
    )
  );

-- Admins can update submissions (approve/reject)
CREATE POLICY "Admins can update submissions"
  ON submissions FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM admin_users WHERE role IN ('admin', 'moderator')
    )
  );

-- Admin users table - only admins can see and manage
CREATE POLICY "Only admins can manage admin users"
  ON admin_users FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM admin_users WHERE role = 'admin'
    )
  );

-- Approval history - visible to admins and the submitter
CREATE POLICY "Admins can view approval history"
  ON approval_history FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM admin_users WHERE role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Admins can insert approval records"
  ON approval_history FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM admin_users WHERE role IN ('admin', 'moderator')
    )
  );
