/**
 * Supabase Database Queries
 * 
 * Centralized query functions for fetching data from Supabase
 * All queries respect Row Level Security (RLS) policies
 */

import { createClient } from "./server";
import { bunnyStream } from "@/lib/bunny";
import type { Movie, MovieGenre } from "@/types/database";

export interface FeaturedMovie {
  id: string;
  title: string;
  subtitle?: string;
  tagline?: string;
  description: string | null;
  genre: string;
  year: number | null;
  rating: string;
  duration: string;
  maturity?: string;
  thumbnailUrl?: string;
  bunny_video_id: string | null;
}

export interface MovieCategory {
  id: string;
  title: string;
  movies: MovieCard[];
}

export interface MovieCard {
  id: string;
  title: string;
  genre: string;
  year: number | null;
  rating: string;
  isNew?: boolean;
  isOriginal?: boolean;
  thumbnailUrl?: string;
}

/**
 * Get featured movies for hero section
 * Returns movies marked as featured, ordered by featured_order
 */
export async function getFeaturedMovies(): Promise<FeaturedMovie[]> {
  try {
    const supabase = await createClient();

    const { data: movies, error } = await supabase
      .from("movies")
      .select("id, title, description, genre, release_year, bunny_video_id, featured, featured_order, created_at")
      .eq("status", "approved")
      .eq("featured", true)
      .order("featured_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching featured movies:", error);
      return [];
    }

    if (!movies || movies.length === 0) {
      // Fallback: get most recent approved movies if no featured movies
      const { data: fallbackMovies } = await supabase
        .from("movies")
        .select("id, title, description, genre, release_year, bunny_video_id, created_at")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(3);

      return (fallbackMovies || []).map((movie, index) => formatFeaturedMovie(movie, index));
    }

    return movies.map((movie, index) => formatFeaturedMovie(movie, index));
  } catch (error) {
    console.error("Error in getFeaturedMovies:", error);
    return [];
  }
}

/**
 * Format a movie from database into FeaturedMovie format
 */
function formatFeaturedMovie(movie: any, index: number): FeaturedMovie {
  const subtitles = ["Mafilu Orijinal", "Yeni Sezon", "Ödüllü Yapım"];
  const taglines = [
    "Her sır, bir bedel ister.",
    "Geçmiş her zaman geri döner.",
    "Sanat, acının en güzel hali.",
  ];

  const duration = movie.duration_seconds
    ? formatDuration(movie.duration_seconds)
    : "2s 00dk";

  return {
    id: movie.id,
    title: movie.title,
    subtitle: subtitles[index % subtitles.length],
    tagline: taglines[index % taglines.length],
    description: movie.description,
    genre: formatGenre(movie.genre),
    year: movie.release_year,
    rating: "8.5", // TODO: Calculate from movie_ratings table
    duration,
    maturity: "16+",
    thumbnailUrl: movie.bunny_video_id
      ? bunnyStream.getThumbnailUrl(movie.bunny_video_id)
      : undefined,
    bunny_video_id: movie.bunny_video_id,
  };
}

/**
 * Get movie categories for homepage
 * Returns different categories: originals, trending, awards, turkish, documentary
 */
export async function getMovieCategories(): Promise<MovieCategory[]> {
  try {
    const supabase = await createClient();

    // Get all approved movies
    const { data: allMovies, error } = await supabase
      .from("movies")
      .select("id, title, genre, release_year, bunny_video_id, featured, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching movies for categories:", error);
      return [];
    }

    if (!allMovies || allMovies.length === 0) {
      return [];
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Format movies for cards
    const formattedMovies = allMovies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      genre: formatGenre(movie.genre),
      year: movie.release_year,
      rating: "8.5", // TODO: Calculate from movie_ratings table
      isNew: new Date(movie.created_at) > thirtyDaysAgo,
      isOriginal: movie.featured || false,
      thumbnailUrl: movie.bunny_video_id
        ? bunnyStream.getThumbnailUrl(movie.bunny_video_id)
        : undefined,
    }));

    // Build categories
    const categories: MovieCategory[] = [];

    // 1. Mafilu Orijinalleri (Featured movies)
    const originals = formattedMovies
      .filter((m) => m.isOriginal)
      .slice(0, 6);
    if (originals.length > 0) {
      categories.push({
        id: "originals",
        title: "Mafilu Orijinalleri",
        movies: originals,
      });
    }

    // 2. Şu An Trend (Most recent, limit 6)
    const trending = formattedMovies.slice(0, 6);
    if (trending.length > 0) {
      categories.push({
        id: "trending",
        title: "Şu An Trend",
        movies: trending,
      });
    }

    // 3. Festival Ödüllü (Older movies, released before 2024)
    const awards = formattedMovies
      .filter((m) => m.year && m.year < 2024)
      .slice(0, 6);
    if (awards.length > 0) {
      categories.push({
        id: "awards",
        title: "Festival Ödüllü",
        movies: awards,
      });
    }

    // 4. Türk Sineması (All Turkish movies - assuming genre-based or all for now)
    const turkish = formattedMovies.slice(0, 6);
    if (turkish.length > 0) {
      categories.push({
        id: "turkish",
        title: "Türk Sineması",
        movies: turkish,
      });
    }

    // 5. Belgeseller (Documentary genre)
    const documentaries = formattedMovies
      .filter((m) => m.genre.toLowerCase().includes("belgesel") || m.genre === "documentary")
      .slice(0, 6);
    if (documentaries.length > 0) {
      categories.push({
        id: "documentary",
        title: "Belgeseller",
        movies: documentaries,
      });
    }

    return categories;
  } catch (error) {
    console.error("Error in getMovieCategories:", error);
    return [];
  }
}

/**
 * Format duration in seconds to readable string
 */
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}s ${minutes}dk`;
  }
  return `${minutes}dk`;
}

/**
 * Format genre enum to readable string
 */
function formatGenre(genre: MovieGenre): string {
  const genreMap: Record<MovieGenre, string> = {
    drama: "Drama",
    comedy: "Komedi",
    thriller: "Gerilim",
    documentary: "Belgesel",
    horror: "Korku",
    sci_fi: "Bilim Kurgu",
    romance: "Romantik",
    animation: "Animasyon",
    experimental: "Deneysel",
    short_film: "Kısa Film",
  };

  return genreMap[genre] || genre;
}

