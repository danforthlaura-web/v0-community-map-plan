-- Wipe all existing data to reset for fresh submissions with correct labels
-- The form is the sole source of truth; old data has mismatched labels

TRUNCATE TABLE approval_history CASCADE;
TRUNCATE TABLE submissions CASCADE;
