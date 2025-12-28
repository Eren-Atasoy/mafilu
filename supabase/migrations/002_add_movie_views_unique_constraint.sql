-- Add unique constraint to movie_views for better upsert support
-- This allows one view record per user per movie (most recent)
-- Note: We'll keep multiple records for analytics, but use the latest for "continue watching"

-- Create a unique index on (movie_id, user_id) for efficient lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_movie_views_user_movie_unique 
ON movie_views(movie_id, user_id) 
WHERE user_id IS NOT NULL;

-- Add comment for clarity
COMMENT ON INDEX idx_movie_views_user_movie_unique IS 
'Ensures one active view record per user per movie for continue watching feature';

