-- Add photo_url and program_links columns to submissions table
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS program_links JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN submissions.photo_url IS 'URL to organization photo stored in Vercel Blob';
COMMENT ON COLUMN submissions.program_links IS 'Array of additional program links with title and url';
