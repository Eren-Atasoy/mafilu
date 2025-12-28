/**
 * Analytics Service for Producer Dashboard
 * 
 * Provides real-time analytics data from movie_views and related tables
 */

import { createClient } from "@/lib/supabase/server";

export interface ProducerAnalytics {
    totalViews: number;
    totalMovies: number;
    totalLikes: number;
    estimatedRevenue: number;
    viewsByDay: DailyViews[];
    topMovies: TopMovie[];
    recentActivity: RecentActivity[];
}

export interface DailyViews {
    date: string;
    views: number;
}

export interface TopMovie {
    id: string;
    title: string;
    views: number;
    likes: number;
}

export interface RecentActivity {
    type: 'view' | 'like' | 'comment';
    movieTitle: string;
    timestamp: string;
}

/**
 * Get comprehensive analytics for a producer
 */
export async function getProducerAnalytics(producerId: string): Promise<ProducerAnalytics> {
    const supabase = await createClient();

    // Get producer's movies
    const { data: movies, error: moviesError } = await supabase
        .from("movies")
        .select("id, title, total_views, total_likes, status")
        .eq("producer_id", producerId);

    if (moviesError) {
        console.error("Error fetching producer movies:", moviesError);
        return getEmptyAnalytics();
    }

    const movieIds = movies?.map(m => m.id) || [];

    if (movieIds.length === 0) {
        return getEmptyAnalytics();
    }

    // Calculate totals
    const totalViews = movies?.reduce((sum, m) => sum + (m.total_views || 0), 0) || 0;
    const totalLikes = movies?.reduce((sum, m) => sum + (m.total_likes || 0), 0) || 0;
    const totalMovies = movies?.filter(m => m.status === "approved").length || 0;

    // Estimate revenue (example: $0.001 per view)
    const estimatedRevenue = totalViews * 0.001;

    // Get views by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: viewsData } = await supabase
        .from("movie_views")
        .select("viewed_at")
        .in("movie_id", movieIds)
        .gte("viewed_at", thirtyDaysAgo.toISOString())
        .order("viewed_at", { ascending: true });

    // Group views by day
    const viewsByDay = groupViewsByDay(viewsData || []);

    // Get top movies
    const topMovies: TopMovie[] = (movies || [])
        .filter(m => m.status === "approved")
        .sort((a, b) => (b.total_views || 0) - (a.total_views || 0))
        .slice(0, 5)
        .map(m => ({
            id: m.id,
            title: m.title,
            views: m.total_views || 0,
            likes: m.total_likes || 0,
        }));

    // Get recent activity
    const { data: recentViews } = await supabase
        .from("movie_views")
        .select("movie_id, viewed_at, movies(title)")
        .in("movie_id", movieIds)
        .order("viewed_at", { ascending: false })
        .limit(10);

    const recentActivity: RecentActivity[] = (recentViews || []).map((v: any) => ({
        type: 'view' as const,
        movieTitle: v.movies?.title || "Unknown",
        timestamp: v.viewed_at,
    }));

    return {
        totalViews,
        totalMovies,
        totalLikes,
        estimatedRevenue,
        viewsByDay,
        topMovies,
        recentActivity,
    };
}

/**
 * Group views by day for chart display
 */
function groupViewsByDay(views: { viewed_at: string }[]): DailyViews[] {
    const grouped: Record<string, number> = {};

    // Initialize last 30 days with 0
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        grouped[dateStr] = 0;
    }

    // Count views per day
    views.forEach(view => {
        const dateStr = view.viewed_at.split('T')[0];
        if (grouped[dateStr] !== undefined) {
            grouped[dateStr]++;
        }
    });

    return Object.entries(grouped).map(([date, views]) => ({
        date,
        views,
    }));
}

/**
 * Return empty analytics structure
 */
function getEmptyAnalytics(): ProducerAnalytics {
    return {
        totalViews: 0,
        totalMovies: 0,
        totalLikes: 0,
        estimatedRevenue: 0,
        viewsByDay: [],
        topMovies: [],
        recentActivity: [],
    };
}

/**
 * Get analytics summary for a specific movie
 */
export async function getMovieAnalytics(movieId: string, producerId: string) {
    const supabase = await createClient();

    // Verify ownership
    const { data: movie, error } = await supabase
        .from("movies")
        .select("id, title, total_views, total_likes, producer_id")
        .eq("id", movieId)
        .eq("producer_id", producerId)
        .single();

    if (error || !movie) {
        return null;
    }

    // Get view history
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: viewsData } = await supabase
        .from("movie_views")
        .select("viewed_at")
        .eq("movie_id", movieId)
        .gte("viewed_at", thirtyDaysAgo.toISOString());

    const viewsByDay = groupViewsByDay(viewsData || []);

    return {
        ...movie,
        viewsByDay,
    };
}
