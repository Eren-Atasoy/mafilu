"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, Bookmark, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieActionsProps {
    movieId: string;
    movieTitle: string;
}

export function MovieActions({ movieId, movieTitle }: MovieActionsProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [inWatchlist, setInWatchlist] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showCopied, setShowCopied] = useState(false);

    // Fetch initial state
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                // Fetch like status
                const likeRes = await fetch(`/api/like?movieId=${movieId}`);
                if (likeRes.ok) {
                    const likeData = await likeRes.json();
                    setIsLiked(likeData.isLiked);
                    setLikeCount(likeData.likeCount);
                }

                // Fetch watchlist status
                const watchlistRes = await fetch(`/api/watchlist?movieId=${movieId}`);
                if (watchlistRes.ok) {
                    const watchlistData = await watchlistRes.json();
                    setInWatchlist(watchlistData.inWatchlist);
                }
            } catch (error) {
                console.error("Failed to fetch status:", error);
            }
        };

        fetchStatus();
    }, [movieId]);

    const handleLike = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/like", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ movieId }),
            });

            if (res.ok) {
                const data = await res.json();
                setIsLiked(data.liked);
                setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
            }
        } catch (error) {
            console.error("Like error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleWatchlist = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/watchlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ movieId }),
            });

            if (res.ok) {
                const data = await res.json();
                setInWatchlist(data.added);
            }
        } catch (error) {
            console.error("Watchlist error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: movieTitle,
                    text: `${movieTitle} filmini izle!`,
                    url,
                });
            } catch {
                // User cancelled or error
            }
        } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(url);
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
        }
    };

    return (
        <div className="flex items-center gap-3 border-y border-[#7C3AED]/10 py-4">
            <Button
                variant="ghost"
                onClick={handleLike}
                disabled={isLoading}
                className={`hover:bg-[#7C3AED]/10 transition-colors ${isLiked ? "text-[#A855F7]" : "hover:text-[#C4B5FD]"
                    }`}
            >
                <ThumbsUp className={`w-5 h-5 mr-2 ${isLiked ? "fill-current" : ""}`} />
                {likeCount > 0 ? likeCount.toLocaleString() : "Beğen"}
            </Button>

            <Button
                variant="ghost"
                onClick={handleWatchlist}
                disabled={isLoading}
                className={`hover:bg-[#7C3AED]/10 transition-colors ${inWatchlist ? "text-green-400" : "hover:text-[#C4B5FD]"
                    }`}
            >
                {inWatchlist ? (
                    <>
                        <Check className="w-5 h-5 mr-2" />
                        Listede
                    </>
                ) : (
                    <>
                        <Bookmark className="w-5 h-5 mr-2" />
                        Listeye Ekle
                    </>
                )}
            </Button>

            <Button
                variant="ghost"
                onClick={handleShare}
                className="hover:bg-[#7C3AED]/10 hover:text-[#C4B5FD]"
            >
                <Share2 className="w-5 h-5 mr-2" />
                {showCopied ? "Kopyalandı!" : "Paylaş"}
            </Button>
        </div>
    );
}
