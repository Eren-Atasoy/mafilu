// ============================================
// Mafilu Database Types
// Auto-generated from PostgreSQL schema
// ============================================

// Enum Types
export type UserRole = 'viewer' | 'producer' | 'admin' | 'super_admin';

export type MovieStatus =
    | 'draft'
    | 'pending_review'
    | 'in_review'
    | 'approved'
    | 'rejected'
    | 'archived';

export type MovieGenre =
    | 'drama'
    | 'comedy'
    | 'thriller'
    | 'documentary'
    | 'horror'
    | 'sci_fi'
    | 'romance'
    | 'animation'
    | 'experimental'
    | 'short_film';

export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'producer_pro';

export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'unpaid' | 'trialing';

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Producer Profile JSON structure
export interface ProducerProfile {
    bio?: string;
    website?: string;
    social_links?: {
        twitter?: string;
        instagram?: string;
        youtube?: string;
        vimeo?: string;
    };
    payout_details?: {
        method: 'stripe' | 'iyzico' | 'bank_transfer';
        account_id?: string;
        iban?: string;
    };
}

// Technical Metadata JSON structure
export interface TechnicalMetadata {
    resolution?: string;
    codec?: string;
    bitrate?: number;
    framerate?: number;
    audio_codec?: string;
    audio_bitrate?: number;
    file_size?: number;
    aspect_ratio?: string;
}

// Database Tables
export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    role: UserRole;
    producer_profile: ProducerProfile | null;
    created_at: string;
    updated_at: string;
}

export interface Movie {
    id: string;
    producer_id: string;
    title: string;
    description: string | null;
    genre: MovieGenre;
    duration_seconds: number | null;
    release_year: number | null;
    bunny_video_id: string | null;
    bunny_library_id: string | null;
    thumbnail_url: string | null;
    trailer_bunny_id: string | null;
    status: MovieStatus;
    submitted_at: string | null;
    reviewed_at: string | null;
    reviewed_by: string | null;
    rejection_reason: string | null;
    technical_metadata: TechnicalMetadata;
    tags: string[];
    featured: boolean;
    featured_order: number | null;
    total_views?: number;
    average_rating?: number | null;
    rating_count?: number | null;
    created_at: string;
    updated_at: string;
}

export interface Subscription {
    id: string;
    user_id: string;
    plan_type: SubscriptionPlan;
    status: SubscriptionStatus;
    stripe_subscription_id: string | null;
    stripe_customer_id: string | null;
    iyzico_subscription_id: string | null;
    iyzico_customer_id: string | null;
    current_period_start: string | null;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProducerPayout {
    id: string;
    producer_id: string;
    amount: number;
    currency: string;
    status: PayoutStatus;
    stripe_transfer_id: string | null;
    iyzico_transfer_id: string | null;
    views_count: number;
    payout_period_start: string;
    payout_period_end: string;
    processed_at: string | null;
    created_at: string;
}

export interface MovieReview {
    id: string;
    movie_id: string;
    user_id: string;
    rating: number;
    review_text: string | null;
    created_at: string;
    updated_at: string;
}

export interface MovieView {
    id: string;
    movie_id: string;
    user_id: string | null;
    watch_duration_seconds: number;
    completed: boolean;
    viewed_at: string;
}

export interface Watchlist {
    id: string;
    user_id: string;
    movie_id: string;
    added_at: string;
}

// Extended types with relations
export interface MovieWithProducer extends Movie {
    producer: Profile;
}

export interface MovieWithDetails extends Movie {
    producer: Profile;
    avg_rating: number;
    view_count: number;
    reviews: MovieReview[];
}

export interface ProfileWithSubscription extends Profile {
    subscription: Subscription | null;
}

// API Response types
export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
}

// Form/Input types
export interface CreateMovieInput {
    title: string;
    description?: string;
    genre: MovieGenre;
    release_year?: number;
    tags?: string[];
}

export interface UpdateMovieInput extends Partial<CreateMovieInput> {
    bunny_video_id?: string;
    bunny_library_id?: string;
    thumbnail_url?: string;
    trailer_bunny_id?: string;
    technical_metadata?: TechnicalMetadata;
}

export interface SubmitMovieForReviewInput {
    movie_id: string;
}

export interface ReviewMovieInput {
    movie_id: string;
    action: 'approve' | 'reject';
    rejection_reason?: string;
}

export interface CreateReviewInput {
    movie_id: string;
    rating: number;
    review_text?: string;
}
