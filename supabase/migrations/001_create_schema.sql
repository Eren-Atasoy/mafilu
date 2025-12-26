-- ============================================
-- Mafilu Database Schema
-- PostgreSQL for Supabase
-- Version: 1.0.0
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================

-- User roles
CREATE TYPE user_role AS ENUM (
    'viewer',        -- Standard subscriber
    'producer',      -- Can upload movies
    'admin',         -- Can review/approve movies
    'super_admin'    -- Full system access
);

-- Movie submission status
CREATE TYPE movie_status AS ENUM (
    'draft',           -- Being edited by producer
    'pending_review',  -- Submitted for evaluation
    'in_review',       -- Currently being reviewed
    'approved',        -- Approved and published
    'rejected',        -- Rejected with feedback
    'archived'         -- Removed from platform
);

-- Movie genre categories
CREATE TYPE movie_genre AS ENUM (
    'drama',
    'comedy',
    'thriller',
    'documentary',
    'horror',
    'sci_fi',
    'romance',
    'animation',
    'experimental',
    'short_film'
);

-- Subscription plans
CREATE TYPE subscription_plan AS ENUM (
    'free',           -- Limited access
    'basic',          -- Standard subscription
    'premium',        -- Full access + features
    'producer_pro'    -- Producer with benefits
);

-- Subscription status
CREATE TYPE subscription_status AS ENUM (
    'active',
    'past_due',
    'canceled',
    'unpaid',
    'trialing'
);

-- Payout status
CREATE TYPE payout_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed'
);

-- ============================================
-- TABLES
-- ============================================

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'viewer' NOT NULL,
    
    -- Producer-specific fields (JSON for flexibility)
    producer_profile JSONB DEFAULT NULL,
    -- Example: {"bio": "...", "website": "...", "social_links": {...}, "payout_details": {...}}
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Movies table
CREATE TABLE movies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Basic metadata
    title TEXT NOT NULL,
    description TEXT,
    genre movie_genre NOT NULL,
    duration_seconds INTEGER,
    release_year INTEGER,
    
    -- Bunny.net integration
    bunny_video_id TEXT UNIQUE,
    bunny_library_id TEXT,
    thumbnail_url TEXT,
    trailer_bunny_id TEXT,
    
    -- Status and workflow
    status movie_status DEFAULT 'draft' NOT NULL,
    submitted_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES profiles(id),
    rejection_reason TEXT,
    
    -- Technical metadata (resolution, codec, bitrate, etc.)
    technical_metadata JSONB DEFAULT '{}',
    
    -- SEO and discovery
    tags TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT FALSE,
    featured_order INTEGER,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Plan details
    plan_type subscription_plan DEFAULT 'free' NOT NULL,
    status subscription_status DEFAULT 'active' NOT NULL,
    
    -- Payment provider references (either Stripe or Iyzico)
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    iyzico_subscription_id TEXT UNIQUE,
    iyzico_customer_id TEXT,
    
    -- Billing period
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Producer payouts table
CREATE TABLE producer_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Payout details
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    status payout_status DEFAULT 'pending' NOT NULL,
    
    -- Transfer references
    stripe_transfer_id TEXT,
    iyzico_transfer_id TEXT,
    
    -- Metrics for this payout
    views_count INTEGER DEFAULT 0,
    payout_period_start DATE NOT NULL,
    payout_period_end DATE NOT NULL,
    
    -- Processing timestamps
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Movie reviews/ratings
CREATE TABLE movie_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Each user can only review a movie once
    UNIQUE(movie_id, user_id)
);

-- Movie view tracking (for analytics and payouts)
CREATE TABLE movie_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    
    -- View metrics
    watch_duration_seconds INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    viewed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Watchlist for users
CREATE TABLE watchlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    
    added_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Each user can only add a movie once
    UNIQUE(user_id, movie_id)
);

-- ============================================
-- INDEXES
-- ============================================

-- Profiles
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Movies
CREATE INDEX idx_movies_producer ON movies(producer_id);
CREATE INDEX idx_movies_status ON movies(status);
CREATE INDEX idx_movies_genre ON movies(genre);
CREATE INDEX idx_movies_featured ON movies(featured) WHERE featured = TRUE;
CREATE INDEX idx_movies_bunny_id ON movies(bunny_video_id);
CREATE INDEX idx_movies_created ON movies(created_at DESC);

-- Subscriptions
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);

-- Payouts
CREATE INDEX idx_payouts_producer ON producer_payouts(producer_id);
CREATE INDEX idx_payouts_status ON producer_payouts(status);
CREATE INDEX idx_payouts_period ON producer_payouts(payout_period_start, payout_period_end);

-- Reviews
CREATE INDEX idx_reviews_movie ON movie_reviews(movie_id);
CREATE INDEX idx_reviews_user ON movie_reviews(user_id);

-- Views
CREATE INDEX idx_views_movie ON movie_views(movie_id);
CREATE INDEX idx_views_user ON movie_views(user_id);
CREATE INDEX idx_views_date ON movie_views(viewed_at);

-- Watchlist
CREATE INDEX idx_watchlist_user ON watchlist(user_id);
CREATE INDEX idx_watchlist_movie ON watchlist(movie_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE producer_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Movies policies
CREATE POLICY "Published movies are viewable by everyone"
    ON movies FOR SELECT
    USING (status = 'approved' OR producer_id = auth.uid());

CREATE POLICY "Producers can insert own movies"
    ON movies FOR INSERT
    WITH CHECK (producer_id = auth.uid());

CREATE POLICY "Producers can update own movies"
    ON movies FOR UPDATE
    USING (producer_id = auth.uid());

CREATE POLICY "Admins can view all movies"
    ON movies FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can update any movie"
    ON movies FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Subscriptions policies
CREATE POLICY "Users can view own subscription"
    ON subscriptions FOR SELECT
    USING (user_id = auth.uid());

-- Payouts policies
CREATE POLICY "Producers can view own payouts"
    ON producer_payouts FOR SELECT
    USING (producer_id = auth.uid());

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
    ON movie_reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create own reviews"
    ON movie_reviews FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reviews"
    ON movie_reviews FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own reviews"
    ON movie_reviews FOR DELETE
    USING (user_id = auth.uid());

-- Views policies (users can see their own, service role for analytics)
CREATE POLICY "Users can view own watch history"
    ON movie_views FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Track views for authenticated users"
    ON movie_views FOR INSERT
    WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Watchlist policies
CREATE POLICY "Users can view own watchlist"
    ON watchlist FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can add to own watchlist"
    ON watchlist FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove from own watchlist"
    ON watchlist FOR DELETE
    USING (user_id = auth.uid());

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_movies_updated_at
    BEFORE UPDATE ON movies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON movie_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to calculate movie average rating
CREATE OR REPLACE FUNCTION get_movie_avg_rating(movie_uuid UUID)
RETURNS DECIMAL AS $$
    SELECT COALESCE(AVG(rating)::DECIMAL(3,2), 0)
    FROM movie_reviews
    WHERE movie_id = movie_uuid;
$$ language 'sql' STABLE;

-- Function to get movie view count
CREATE OR REPLACE FUNCTION get_movie_view_count(movie_uuid UUID)
RETURNS BIGINT AS $$
    SELECT COUNT(*)
    FROM movie_views
    WHERE movie_id = movie_uuid;
$$ language 'sql' STABLE;

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM subscriptions
        WHERE user_id = user_uuid
        AND status = 'active'
        AND (current_period_end IS NULL OR current_period_end > NOW())
    );
$$ language 'sql' STABLE;
