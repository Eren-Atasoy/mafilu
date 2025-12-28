"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "./hero-section";
import { MovieRow } from "./movie-row";
import type { FeaturedMovie, MovieCategory } from "@/lib/supabase/queries";

interface HomeClientProps {
  heroMovies: FeaturedMovie[];
  categories: MovieCategory[];
}

export function HomeClient({ heroMovies, categories }: HomeClientProps) {
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(true);

  // Fetch user's watchlist on mount (only if authenticated)
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await fetch("/api/watchlist");
        if (res.ok) {
          const data = await res.json();
          const watchlistIds = new Set<string>(
            (data.watchlist || []).map((item: any) => item.movies?.id).filter(Boolean) as string[]
          );
          setWatchlist(watchlistIds);
        } else if (res.status === 401) {
          // User not authenticated, this is expected - just set empty watchlist
          setWatchlist(new Set());
        }
      } catch (error) {
        // Silently fail for unauthenticated users
        console.debug("Watchlist fetch skipped (user not authenticated)");
      } finally {
        setIsLoadingWatchlist(false);
      }
    };

    fetchWatchlist();
  }, []);

  const toggleWatchlist = async (movieId: string) => {
    // Optimistic update
    setWatchlist((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(movieId)) {
        newSet.delete(movieId);
      } else {
        newSet.add(movieId);
      }
      return newSet;
    });

    // Update on server
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
      });

      if (!res.ok) {
        // Revert on error (unless 401 - user not authenticated)
        if (res.status !== 401) {
          setWatchlist((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(movieId)) {
              newSet.delete(movieId);
            } else {
              newSet.add(movieId);
            }
            return newSet;
          });
        } else {
          // User not authenticated, redirect to login
          window.location.href = "/login";
        }
      }
    } catch (error) {
      console.error("Failed to update watchlist:", error);
      // Revert on error
      setWatchlist((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(movieId)) {
          newSet.delete(movieId);
        } else {
          newSet.add(movieId);
        }
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--mf-black)]">
      {/* Hero Section */}
      <HeroSection movies={heroMovies} />

      {/* Movie Categories */}
      <main className="relative z-10 -mt-24 pb-20">
        {categories.map((category, categoryIndex) => (
          <MovieRow
            key={category.id}
            title={category.title}
            movies={category.movies}
            delay={categoryIndex * 0.1}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
          />
        ))}
      </main>
    </div>
  );
}

