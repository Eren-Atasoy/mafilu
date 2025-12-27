import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { bunnyStream } from "@/lib/bunny";
import { ViewCounter } from "@/components/video/view-counter";
import { RelatedMovies } from "@/components/video/related-movies";
import { MovieActions } from "@/components/video/movie-actions";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function WatchPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // Redirect to login with return URL
        redirect(`/login?next=/watch/${id}`);
    }

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

    // Fetch related movies (same genre, excluding current)
    const { data: relatedMoviesData } = await supabase
        .from("movies")
        .select("id, title, genre, total_views, bunny_video_id")
        .eq("status", "approved")
        .eq("genre", movie.genre)
        .neq("id", id)
        .order("total_views", { ascending: false })
        .limit(5);

    const relatedMovies = (relatedMoviesData || []).map((m) => ({
        id: m.id,
        title: m.title,
        genre: m.genre,
        total_views: m.total_views || 0,
        thumbnailUrl: m.bunny_video_id
            ? bunnyStream.getThumbnailUrl(m.bunny_video_id)
            : undefined,
    }));

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
                        <MovieActions movieId={id} movieTitle={movie.title} />

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

                        {/* More Like This */}
                        <div>
                            <h3 className="font-semibold text-lg mb-4 pl-1">Benzer Filmler</h3>
                            <RelatedMovies movies={relatedMovies} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
