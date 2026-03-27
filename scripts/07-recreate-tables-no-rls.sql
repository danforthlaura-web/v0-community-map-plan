-- Drop existing tables and recreate without RLS to fix infinite recursion
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Create admin_users table without RLS
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create submissions table without RLS
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  country TEXT NOT NULL,
  region TEXT,
  city TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  project_description TEXT,
  implementation_date DATE,
  number_of_students INTEGER,
  number_of_teachers INTEGER,
  number_of_devices INTEGER,
  organization_type TEXT,
  organization_website TEXT,
  years_active INTEGER,
  kolibri_version TEXT,
  channels_used TEXT[],
  primary_use_case TEXT,
  primary_language TEXT,
  other_languages TEXT[],
  customized_content BOOLEAN DEFAULT FALSE,
  challenges_faced TEXT,
  measurable_impact TEXT,
  success_stories TEXT,
  social_media_links JSONB,
  additional_notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_country ON submissions(country);
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX idx_admin_users_email ON admin_users(email);
