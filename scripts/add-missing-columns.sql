-- Add missing columns to submissions table to match the form fields

-- Add name column (submitter's name)
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS name TEXT;

-- Add email column (submitter's email)  
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS email TEXT;

-- Add location column (full location string)
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS location TEXT;

-- Add number_of_learners column
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS number_of_learners TEXT;

-- Add number_of_teachers column (already exists as integer, but form collects as text)
-- No change needed, it already exists
