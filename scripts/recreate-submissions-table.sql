-- Drop and recreate the submissions table to exactly match the form fields

DROP TABLE IF EXISTS submissions;

CREATE TABLE submissions (
  -- System columns
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending',

  -- Basic Details
  name TEXT,
  email TEXT,
  organization_name TEXT,
  location TEXT,
  latitude FLOAT8,
  longitude FLOAT8,
  organization_website TEXT,
  start_year TEXT,

  -- Implementation Details
  implementation_settings TEXT[],
  learner_types TEXT[],
  number_of_learners TEXT,
  number_of_teachers TEXT,
  device_usage TEXT[],
  server_devices TEXT[],
  client_device_types TEXT[],
  hardware_model TEXT[],
  blended_learning_model TEXT[],
  kolibri_usage_description TEXT,

  -- Content
  primary_language TEXT,
  public_channels TEXT,
  uses_kolibri_studio BOOLEAN DEFAULT false,

  -- Media & Social
  photo_url TEXT,
  program_links JSONB,
  testimonials TEXT,
  reports TEXT,
  twitter_handle TEXT,
  facebook_handle TEXT,
  instagram_handle TEXT,
  linkedin_handle TEXT,
  forum_username TEXT,
  other_social TEXT,
  receive_updates BOOLEAN DEFAULT false,
  email_visible BOOLEAN DEFAULT false
);

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form submission)
CREATE POLICY "Anyone can submit" ON submissions
  FOR INSERT WITH CHECK (true);

-- Only authenticated users (admins) can read/update
CREATE POLICY "Authenticated users can read" ON submissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update" ON submissions
  FOR UPDATE USING (auth.role() = 'authenticated');
