"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, Play, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { bunnyStream } from "@/lib/bunny";

interface WatchlistItem {
    id: string;
    added_at: string;
    movies: {
        id: string;
        title: string;
        genre: string;
        bunny_video_id?: string;
        total_views?: number;
    };
}

export default function WatchlistPage() {
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const fetchWatchlist = async () => {
        try {
            const res = await fetch("/api/watchlist");
            if (res.ok) {
                const data = await res.json();
                setWatchlist(data.watchlist || []);
            }
        } catch (error) {
            console.error("Failed to fetch watchlist:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromWatchlist = async (movieId: string) => {
        try {
            const res = await fetch("/api/watchlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ movieId }),
            });

            if (res.ok) {
                setWatchlist((prev) => prev.filter((item) => item.movies.id !== movieId));
            }
        } catch (error) {
            console.error("Failed to remove from watchlist:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0510] relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-30" style={{
                    background: "radial-gradient(ellipse, rgba(124, 58, 237, 0.15) 0%, transparent 70%)",
                    filter: "blur(80px)"
                }} />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center">
                            <Bookmark className="w-5 h-5 text-[#A855F7]" />
                        </div>
                        <h1 className="text-3xl font-bold text-[#F5F3FF] headline-serif">İzleme Listem</h1>
                    </div>
                    <p className="text-[#A197B0]">
                        {watchlist.length > 0
                            ? `${watchlist.length} film kayıtlı`
                            : "Henüz film eklenmemiş"}
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[#7C3AED]/30 border-t-[#7C3AED] rounded-full animate-spin" />
                    </div>
                ) : watchlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {watchlist.map((item) => {
                            const movie = item.movies;
                            const thumbnailUrl = movie.bunny_video_id
                                ? bunnyStream.getThumbnailUrl(movie.bunny_video_id)
                                : null;

                            return (
                                <div key={item.id} className="group relative">
                                    <Link href={`/watch/${movie.id}`}>
                                        <Card className="bg-[#150A24] border border-[#7C3AED]/10 overflow-hidden hover:border-[#7C3AED]/30 transition-all duration-300 group-hover:-translate-y-1">
                                            <div className="aspect-[16/9] relative bg-slate-900">
                                                {thumbnailUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={thumbnailUrl}
                                                        alt={movie.title}
                                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                                        <Play className="w-12 h-12 text-slate-600" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                                                    <div className="w-12 h-12 rounded-full bg-[#7C3AED]/90 flex items-center justify-center backdrop-blur-sm">
                                                        <Play className="w-5 h-5 text-white ml-1" />
                                                    </div>
                                                </div>
                                                <div className="absolute top-2 right-2">
                                                    <Badge variant="secondary" className="bg-black/50 backdrop-blur-md text-white border-white/10 uppercase text-[10px] tracking-wider">
                                                        {movie.genre?.replace("_", " ")}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardContent className="p-4">
                                                <h3 className="font-semibold text-[#F5F3FF] truncate">{movie.title}</h3>
                                                <p className="text-xs text-[#6B5F7C] mt-1">
                                                    {new Date(item.added_at).toLocaleDateString("tr-TR")} tarihinde eklendi
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>

                                    {/* Remove button */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeFromWatchlist(movie.id);
                                        }}
                                        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-red-500/80 text-white rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Bookmark className="w-16 h-16 text-[#6B5F7C] mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-[#F5F3FF] mb-2">Listeniz Boş</h2>
                        <p className="text-[#A197B0] mb-6">İzlemek istediğiniz filmleri listeye ekleyin.</p>
                        <Link href="/browse">
                            <Button className="bg-[#7C3AED] hover:bg-[#6D28D9]">
                                Film Keşfet
                            </Button>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
