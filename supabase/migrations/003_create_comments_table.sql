-- Comments table for movies
CREATE TABLE IF NOT EXISTS movie_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Comment content
    content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 1000),
    
    -- Parent comment for replies (optional)
    parent_id UUID REFERENCES movie_comments(id) ON DELETE CASCADE,
    
    -- Moderation
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_comments_movie ON movie_comments(movie_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON movie_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON movie_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON movie_comments(created_at DESC);

-- Enable RLS
ALTER TABLE movie_comments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Comments are viewable by everyone"
    ON movie_comments FOR SELECT
    USING (is_deleted = FALSE);

CREATE POLICY "Users can create comments"
    ON movie_comments FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own comments"
    ON movie_comments FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own comments"
    ON movie_comments FOR DELETE
    USING (user_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_movie_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.is_edited = TRUE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_movie_comments_updated_at
    BEFORE UPDATE ON movie_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_movie_comments_updated_at();

