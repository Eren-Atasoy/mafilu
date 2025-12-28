"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface RatingSectionProps {
    movieId: string;
    averageRating?: number;
    ratingCount?: number;
}

export function RatingSection({ movieId, averageRating = 0, ratingCount = 0 }: RatingSectionProps) {
    const [userRating, setUserRating] = useState<number | null>(null);
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentAverage, setCurrentAverage] = useState(averageRating);
    const [currentCount, setCurrentCount] = useState(ratingCount);
    const supabase = createClient();

    useEffect(() => {
        loadUserRating();
    }, [movieId]);

    const loadUserRating = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const res = await fetch(`/api/movies/${movieId}/rating`);
            if (res.ok) {
                const data = await res.json();
                setUserRating(data.userRating);
            }
        } catch (error) {
            console.error("Failed to load rating:", error);
        }
    };

    const handleRatingClick = async (rating: number) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert("Oylamak için giriş yapmalısınız");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/movies/${movieId}/rating`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating }),
            });

            if (res.ok) {
                const data = await res.json();
                setUserRating(data.userRating);
                setCurrentAverage(data.averageRating);
                setCurrentCount(data.ratingCount);
            }
        } catch (error) {
            console.error("Failed to set rating:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveRating = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/movies/${movieId}/rating`, {
                method: "DELETE",
            });

            if (res.ok) {
                const data = await res.json();
                setUserRating(null);
                setCurrentAverage(data.averageRating);
                setCurrentCount(data.ratingCount);
            }
        } catch (error) {
            console.error("Failed to remove rating:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const displayRating = hoveredRating !== null ? hoveredRating : userRating || 0;
    const effectiveRating = hoveredRating !== null ? hoveredRating : userRating;

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => handleRatingClick(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(null)}
                            disabled={isLoading}
                            className="transition-transform hover:scale-110 disabled:opacity-50"
                        >
                            <Star
                                className={`w-6 h-6 ${
                                    star <= displayRating
                                        ? "fill-[var(--mf-primary-glow-alt)] text-[var(--mf-primary-glow-alt)]"
                                        : "text-[var(--mf-text-muted)]"
                                }`}
                            />
                        </button>
                    ))}
                </div>

                {userRating && (
                    <button
                        onClick={handleRemoveRating}
                        disabled={isLoading}
                        className="text-sm text-[var(--mf-text-muted)] hover:text-[var(--mf-primary-glow-alt)] transition-colors"
                    >
                        Oyunu kaldır
                    </button>
                )}
            </div>

            <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-[var(--mf-text-high)]">
                    {currentAverage.toFixed(1)}
                </span>
                <span className="text-[var(--mf-text-muted)]">
                    ({currentCount.toLocaleString()} {currentCount === 1 ? "oy" : "oy"})
                </span>
            </div>

            {effectiveRating && (
                <p className="text-sm text-[var(--mf-text-muted)]">
                    Sizin oyunuz: {effectiveRating} yıldız
                </p>
            )}
        </div>
    );
}

