import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { bunnyStream } from "@/lib/bunny";
import { ViewCounter } from "@/components/video/view-counter";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, Share2, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function WatchPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch movie details
    const { data: movie, error } = await supabase
        .from("movies")
        .select(`
            *,
            profiles:producer_id (
                display_name,
                full_name,
                avatar_url
            )
        `)
        .eq("id", id)
        .eq("status", "approved")
        .single();

    if (error || !movie) {
        notFound();
    }

    const embedUrl = movie.bunny_video_id
        ? bunnyStream.getEmbedUrl(movie.bunny_video_id, true) // Autoplay true
        : null;

    return (
        <div className="min-h-screen bg-[#0A0510] text-[#F5F3FF]">
            <ViewCounter movieId={id} />

            <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content: Player & Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Player Container */}
                        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-[#7C3AED]/20">
                            {embedUrl ? (
                                <iframe
                                    src={embedUrl}
                                    className="absolute inset-0 w-full h-full"
                                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p>Video yüklenemedi</p>
                                </div>
                            )}
                        </div>

                        {/* Movie Title & Stats */}
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold headline-serif">{movie.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[#A197B0]">
                                <span className="flex items-center gap-1.5">
                                    <Eye className="w-4 h-4" />
                                    {movie.total_views.toLocaleString()} izlenme
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    {movie.release_year}
                                </span>
                                <span>•</span>
                                <Badge variant="secondary" className="bg-[#7C3AED]/10 text-[#C4B5FD] hover:bg-[#7C3AED]/20">
                                    {movie.genre}
                                </Badge>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 border-y border-[#7C3AED]/10 py-4">
                            <Button variant="ghost" className="hover:bg-[#7C3AED]/10 hover:text-[#C4B5FD]">
                                <ThumbsUp className="w-5 h-5 mr-2" />
                                Beğen
                            </Button>
                            <Button variant="ghost" className="hover:bg-[#7C3AED]/10 hover:text-[#C4B5FD]">
                                <Share2 className="w-5 h-5 mr-2" />
                                Paylaş
                            </Button>
                        </div>

                        {/* Description */}
                        <div className="bg-[#150A24] rounded-2xl p-6 border border-[#7C3AED]/10">
                            <h3 className="font-semibold text-lg mb-2">Hikaye</h3>
                            <p className="text-[#A197B0] leading-relaxed whitespace-pre-wrap">
                                {movie.description || "Açıklama bulunmuyor."}
                            </p>

                            {movie.tags && movie.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-6">
                                    {movie.tags.map((tag: string) => (
                                        <span key={tag} className="text-xs px-2 py-1 rounded-md bg-[#7C3AED]/5 text-[#A197B0] border border-[#7C3AED]/10">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Producer Info & Related (Placeholder) */}
                    <div className="space-y-6">
                        {/* Producer Card */}
                        <div className="bg-[#150A24] rounded-2xl p-6 border border-[#7C3AED]/10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-lg font-bold">
                                    {movie.profiles?.display_name?.[0]?.toUpperCase() || "P"}
                                </div>
                                <div>
                                    <p className="font-semibold text-[#F5F3FF]">
                                        {movie.profiles?.display_name || "Yapımcı"}
                                    </p>
                                    <p className="text-sm text-[#A197B0]">
                                        {movie.profiles?.total_movies || 1} Film
                                    </p>
                                </div>
                            </div>
                            <Button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
                                Takip Et
                            </Button>
                        </div>

                        {/* More Like This (Static Placeholder for now) */}
                        <div>
                            <h3 className="font-semibold text-lg mb-4 pl-1">Benzer Filmler</h3>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-3 p-2 rounded-xl hover:bg-[#150A24] transition-colors cursor-pointer group">
                                        <div className="w-32 aspect-video bg-slate-800 rounded-lg overflow-hidden relative">
                                            <div className="absolute inset-0 bg-[#7C3AED]/20 group-hover:bg-transparent transition-colors" />
                                        </div>
                                        <div className="flex-1 py-1">
                                            <div className="h-4 w-3/4 bg-[#1A0B2E] rounded mb-2" />
                                            <div className="h-3 w-1/2 bg-[#1A0B2E] rounded opacity-60" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
