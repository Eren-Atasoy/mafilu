-- Add average_rating column to movies table
ALTER TABLE movies ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3, 2) DEFAULT 0;
ALTER TABLE movies ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;

-- Function to calculate and update average rating
CREATE OR REPLACE FUNCTION update_movie_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate new average rating and count
    UPDATE movies
    SET 
        average_rating = (
            SELECT COALESCE(AVG(rating)::DECIMAL(3, 2), 0)
            FROM movie_reviews
            WHERE movie_id = COALESCE(NEW.movie_id, OLD.movie_id)
            AND rating IS NOT NULL
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM movie_reviews
            WHERE movie_id = COALESCE(NEW.movie_id, OLD.movie_id)
            AND rating IS NOT NULL
        )
    WHERE id = COALESCE(NEW.movie_id, OLD.movie_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger on insert
DROP TRIGGER IF EXISTS trigger_update_rating_on_insert ON movie_reviews;
CREATE TRIGGER trigger_update_rating_on_insert
    AFTER INSERT ON movie_reviews
    FOR EACH ROW
    WHEN (NEW.rating IS NOT NULL)
    EXECUTE FUNCTION update_movie_rating();

-- Trigger on update
DROP TRIGGER IF EXISTS trigger_update_rating_on_update ON movie_reviews;
CREATE TRIGGER trigger_update_rating_on_update
    AFTER UPDATE ON movie_reviews
    FOR EACH ROW
    WHEN (NEW.rating IS NOT NULL OR OLD.rating IS NOT NULL)
    EXECUTE FUNCTION update_movie_rating();

-- Trigger on delete
DROP TRIGGER IF EXISTS trigger_update_rating_on_delete ON movie_reviews;
CREATE TRIGGER trigger_update_rating_on_delete
    AFTER DELETE ON movie_reviews
    FOR EACH ROW
    WHEN (OLD.rating IS NOT NULL)
    EXECUTE FUNCTION update_movie_rating();

-- Update existing movies with current ratings
UPDATE movies
SET 
    average_rating = COALESCE((
        SELECT AVG(rating)::DECIMAL(3, 2)
        FROM movie_reviews
        WHERE movie_reviews.movie_id = movies.id
        AND rating IS NOT NULL
    ), 0),
    rating_count = (
        SELECT COUNT(*)
        FROM movie_reviews
        WHERE movie_reviews.movie_id = movies.id
        AND rating IS NOT NULL
    );

