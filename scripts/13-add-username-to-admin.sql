-- Add username column to admin_users table if it doesn't exist
ALTER TABLE public.admin_users
ADD COLUMN IF NOT EXISTS username text UNIQUE;

-- Add a unique constraint on username
CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_users_username ON public.admin_users(username);
