"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Play, X, SlidersHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface Movie {
    id: string;
    title: string;
    description?: string;
    genre: string;
    release_year?: number;
    total_views?: number;
    bunny_video_id?: string;
    thumbnailUrl?: string;
}

interface BrowseClientProps {
    movies: Movie[];
    genres: string[];
}

export default function BrowseClient({ movies, genres }: BrowseClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<"newest" | "popular" | "oldest">("newest");
    const [showFilters, setShowFilters] = useState(false);

    // Filter and sort movies
    const filteredMovies = useMemo(() => {
        let result = [...movies];

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(movie =>
                movie.title.toLowerCase().includes(query) ||
                movie.description?.toLowerCase().includes(query) ||
                movie.genre.toLowerCase().includes(query)
            );
        }

        // Genre filter
        if (selectedGenre) {
            result = result.filter(movie => movie.genre === selectedGenre);
        }

        // Sort
        switch (sortBy) {
            case "popular":
                result.sort((a, b) => (b.total_views || 0) - (a.total_views || 0));
                break;
            case "oldest":
                result.sort((a, b) => (a.release_year || 0) - (b.release_year || 0));
                break;
            case "newest":
            default:
                result.sort((a, b) => (b.release_year || 0) - (a.release_year || 0));
        }

        return result;
    }, [movies, searchQuery, selectedGenre, sortBy]);

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedGenre(null);
        setSortBy("newest");
    };

    const hasActiveFilters = searchQuery || selectedGenre || sortBy !== "newest";

    return (
        <>
            {/* Search and Filters Bar */}
            <div className="mb-8 space-y-4">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5F7C]" />
                    <input
                        type="text"
                        placeholder="Film ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-14 pl-12 pr-12 rounded-2xl text-[#F5F3FF] placeholder:text-[#6B5F7C] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
                        style={{
                            background: "rgba(21, 10, 36, 0.6)",
                            border: "1px solid rgba(124, 58, 237, 0.2)",
                        }}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-14 top-1/2 -translate-y-1/2 text-[#6B5F7C] hover:text-[#A855F7] transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${showFilters ? "text-[#A855F7] bg-[#7C3AED]/10" : "text-[#6B5F7C] hover:text-[#A855F7]"
                            }`}
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                    </button>
                </div>

                {/* Filters Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div
                                className="p-4 rounded-2xl space-y-4"
                                style={{
                                    background: "rgba(21, 10, 36, 0.6)",
                                    border: "1px solid rgba(124, 58, 237, 0.2)",
                                }}
                            >
                                {/* Genre Filter */}
                                <div>
                                    <label className="text-sm font-medium text-[#C4B5FD] block mb-2">Kategori</label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedGenre(null)}
                                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${!selectedGenre
                                                ? "bg-[#7C3AED] text-white"
                                                : "bg-[#7C3AED]/10 text-[#C4B5FD] hover:bg-[#7C3AED]/20"
                                                }`}
                                        >
                                            Tümü
                                        </button>
                                        {genres.map((genre) => (
                                            <button
                                                key={genre}
                                                onClick={() => setSelectedGenre(genre)}
                                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors capitalize ${selectedGenre === genre
                                                    ? "bg-[#7C3AED] text-white"
                                                    : "bg-[#7C3AED]/10 text-[#C4B5FD] hover:bg-[#7C3AED]/20"
                                                    }`}
                                            >
                                                {genre.replace("_", " ")}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Sort Filter */}
                                <div>
                                    <label className="text-sm font-medium text-[#C4B5FD] block mb-2">Sıralama</label>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { value: "newest", label: "En Yeni" },
                                            { value: "popular", label: "En Popüler" },
                                            { value: "oldest", label: "En Eski" },
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => setSortBy(option.value as typeof sortBy)}
                                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${sortBy === option.value
                                                    ? "bg-[#7C3AED] text-white"
                                                    : "bg-[#7C3AED]/10 text-[#C4B5FD] hover:bg-[#7C3AED]/20"
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Clear Filters */}
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-[#A855F7] hover:text-[#C4B5FD] transition-colors flex items-center gap-1"
                                    >
                                        <X className="w-4 h-4" />
                                        Filtreleri Temizle
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results Count */}
                {searchQuery && (
                    <p className="text-sm text-[#6B5F7C]">
                        &quot;{searchQuery}&quot; için {filteredMovies.length} sonuç bulundu
                    </p>
                )}
            </div>

            {/* Movies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredMovies.map((movie) => (
                        <motion.div
                            key={movie.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Link href={`/watch/${movie.id}`} className="group">
                                <Card className="bg-[#150A24] border border-[#7C3AED]/10 overflow-hidden hover:border-[#7C3AED]/30 transition-all duration-300 group-hover:-translate-y-1">
                                    <div className="aspect-[16/9] relative bg-slate-900">
                                        {movie.thumbnailUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={movie.thumbnailUrl}
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
                                                {movie.genre.replace("_", " ")}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-[#F5F3FF] truncate">{movie.title}</h3>
                                        <div className="flex items-center justify-between mt-2 text-sm text-[#6B5F7C]">
                                            <span>{movie.release_year || "—"}</span>
                                            <span className="flex items-center gap-1">
                                                {(movie.total_views || 0) > 0 && (
                                                    <span className="text-xs">{(movie.total_views || 0).toLocaleString()} görüntülenme</span>
                                                )}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* No Results */}
            {filteredMovies.length === 0 && (
                <div className="text-center py-20">
                    <Search className="w-12 h-12 text-[#6B5F7C] mx-auto mb-4" />
                    <p className="text-[#6B5F7C] text-lg">Sonuç bulunamadı</p>
                    <p className="text-[#A197B0] text-sm mt-2">Farklı anahtar kelimeler deneyin veya filtreleri temizleyin.</p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="mt-4 px-4 py-2 rounded-lg bg-[#7C3AED]/10 text-[#A855F7] hover:bg-[#7C3AED]/20 transition-colors"
                        >
                            Filtreleri Temizle
                        </button>
                    )}
                </div>
            )}
        </>
    );
}
