-- Create movie_comments table for user comments on movies
CREATE TABLE IF NOT EXISTS movie_comments (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES movie_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) <= 1000),
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_movie_comments_movie_id ON movie_comments(movie_id);
CREATE INDEX IF NOT EXISTS idx_movie_comments_user_id ON movie_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_movie_comments_parent_id ON movie_comments(parent_id);

-- Enable RLS
ALTER TABLE movie_comments ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view comments on approved movies
CREATE POLICY "Anyone can view comments"
    ON movie_comments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM movies 
            WHERE movies.id = movie_comments.movie_id 
            AND movies.status = 'approved'
        )
    );

-- Policy: Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
    ON movie_comments FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own comments
CREATE POLICY "Users can update own comments"
    ON movie_comments FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own comments
CREATE POLICY "Users can delete own comments"
    ON movie_comments FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create trigger to update updated_at on edit
CREATE OR REPLACE FUNCTION update_comment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.is_edited = TRUE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_movie_comments_updated_at
    BEFORE UPDATE ON movie_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_comment_updated_at();
