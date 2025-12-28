import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { bunnyStream } from "@/lib/bunny";
import { ViewCounter } from "@/components/video/view-counter";
import { RelatedMovies } from "@/components/video/related-movies";
import { MovieActions } from "@/components/video/movie-actions";
import { AdvancedPlayer } from "@/components/video/advanced-player";
import { RatingSection } from "@/components/video/rating-section";
import { CommentsSection } from "@/components/video/comments-section";
import Link from "next/link";
import type { Metadata } from "next";
import {
    Eye,
    Calendar,
    Clock,
    Star,
    Play,
    ChevronLeft,
    Film,
    Users
} from "lucide-react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();

    const { data: movie } = await supabase
        .from("movies")
        .select("title, description, genre, release_year, thumbnail_url, bunny_video_id")
        .eq("id", id)
        .eq("status", "approved")
        .single();

    if (!movie) {
        return {
            title: "Film Bulunamadı | Mafilu",
            description: "Aradığınız film bulunamadı.",
        };
    }

    const thumbnailUrl = movie.thumbnail_url || 
        (movie.bunny_video_id ? bunnyStream.getThumbnailUrl(movie.bunny_video_id) : undefined);

    return {
        title: `${movie.title} | Mafilu`,
        description: movie.description || `${movie.title} - ${movie.genre} türünde ${movie.release_year} yapımı bağımsız sinema filmi.`,
        openGraph: {
            title: movie.title,
            description: movie.description || `${movie.title} - Bağımsız sinema filmi`,
            type: "video.movie",
            images: thumbnailUrl ? [{ url: thumbnailUrl }] : [],
            siteName: "Mafilu",
        },
        twitter: {
            card: "summary_large_image",
            title: movie.title,
            description: movie.description || `${movie.title} - Bağımsız sinema filmi`,
            images: thumbnailUrl ? [thumbnailUrl] : [],
        },
        alternates: {
            canonical: `/watch/${id}`,
        },
    };
}

export default async function WatchPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/login?next=/watch/${id}`);
    }

    // Fetch movie details (without status filter to check if it exists)
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
        .single();

    if (error || !movie) {
        notFound();
    }

    // Check if movie is approved
    if (movie.status !== "approved") {
        // Show a message instead of 404
        return (
            <div className="min-h-screen bg-[var(--mf-black)] flex items-center justify-center px-6">
                <div className="max-w-md text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto">
                        <Clock className="w-10 h-10 text-yellow-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">{movie.title}</h1>
                        <p className="text-slate-400">
                            {movie.status === "pending_review" 
                                ? "Bu film henüz onay bekliyor. Onaylandıktan sonra izleyebilirsiniz."
                                : movie.status === "rejected"
                                ? "Bu film onaylanmamış."
                                : "Bu film henüz yayında değil."}
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--mf-primary)] hover:bg-[var(--mf-primary-glow)] text-white font-medium transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        );
    }

    // Fetch related movies
    const { data: relatedMoviesData } = await supabase
        .from("movies")
        .select("id, title, genre, total_views, bunny_video_id, release_year")
        .eq("status", "approved")
        .eq("genre", movie.genre)
        .neq("id", id)
        .order("total_views", { ascending: false })
        .limit(6);

    const relatedMovies = (relatedMoviesData || []).map((m) => ({
        id: m.id,
        title: m.title,
        genre: m.genre,
        release_year: m.release_year,
        total_views: m.total_views || 0,
        thumbnailUrl: m.bunny_video_id
            ? bunnyStream.getThumbnailUrl(m.bunny_video_id)
            : undefined,
    }));

    const embedUrl = movie.bunny_video_id
        ? bunnyStream.getEmbedUrl(movie.bunny_video_id, true)
        : null;

    // Mock duration for demo
    const duration = movie.duration || "2s 15dk";
    const rating = movie.rating || "8.5";

    return (
        <div className="min-h-screen bg-[var(--mf-black)]">
            <ViewCounter movieId={id} />

            {/* Back Button - Fixed */}
            <Link
                href="/"
                className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/80 transition-all"
            >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Geri</span>
            </Link>

            {/* Hero Video Player Section */}
            <section className="relative">
                {/* Advanced Video Player */}
                {embedUrl ? (
                    <AdvancedPlayer
                        videoId={movie.bunny_video_id || ""}
                        embedUrl={embedUrl}
                        movieId={id}
                        duration={movie.duration_seconds || undefined}
                    />
                ) : (
                    <div className="relative w-full aspect-video max-h-[75vh] bg-black flex flex-col items-center justify-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                            <Play className="w-10 h-10 text-white/60" />
                        </div>
                        <p className="text-white/60">Video yükleniyor...</p>
                    </div>
                )}
            </section>

            {/* Content Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 -mt-16">
                {/* Movie Info Header */}
                <div className="mb-10">
                    {/* Title */}
                    <h1 className="headline-serif text-4xl md:text-5xl lg:text-6xl font-light text-[var(--mf-text-high)] mb-4">
                        {movie.title}
                    </h1>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        {/* Rating */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--mf-primary)]/10 border border-[var(--mf-primary)]/20">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-[var(--mf-text-high)] font-semibold">{rating}</span>
                        </div>

                        {/* Year */}
                        <div className="flex items-center gap-1.5 text-[var(--mf-text-medium)]">
                            <Calendar className="w-4 h-4" />
                            <span>{movie.release_year}</span>
                        </div>

                        {/* Duration */}
                        <div className="flex items-center gap-1.5 text-[var(--mf-text-medium)]">
                            <Clock className="w-4 h-4" />
                            <span>{duration}</span>
                        </div>

                        {/* Views */}
                        <div className="flex items-center gap-1.5 text-[var(--mf-text-medium)]">
                            <Eye className="w-4 h-4" />
                            <span>{(movie.total_views || 0).toLocaleString()} izlenme</span>
                        </div>

                        {/* Genre Badge */}
                        <span className="px-3 py-1 rounded-full text-sm bg-[var(--mf-surface)] text-[var(--mf-text-medium)] border border-[var(--border-subtle)]">
                            {movie.genre}
                        </span>
                    </div>

                    {/* Actions */}
                    <MovieActions movieId={id} movieTitle={movie.title} />

                    {/* Rating Section */}
                    <RatingSection
                        movieId={id}
                        averageRating={movie.average_rating || undefined}
                        ratingCount={movie.rating_count || undefined}
                    />
                </div>

                {/* Two Column Layout */}
                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description Card */}
                        <div className="glass-card p-6 md:p-8">
                            <h3 className="text-xl font-medium text-[var(--mf-text-high)] mb-4 flex items-center gap-2">
                                <Film className="w-5 h-5 text-[var(--mf-primary)]" />
                                Hikaye
                            </h3>
                            <p className="text-[var(--mf-text-medium)] leading-relaxed text-lg">
                                {movie.description || "Bu film için henüz bir açıklama eklenmemiş."}
                            </p>

                            {/* Tags */}
                            {movie.tags && movie.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-[var(--border-subtle)]">
                                    {movie.tags.map((tag: string) => (
                                        <span
                                            key={tag}
                                            className="text-sm px-3 py-1.5 rounded-full bg-[var(--mf-primary)]/5 text-[var(--mf-text-medium)] border border-[var(--mf-primary)]/10 hover:border-[var(--mf-primary)]/30 transition-colors cursor-pointer"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Comments Section */}
                        <div className="glass-card p-6 md:p-8">
                            <CommentsSection movieId={id} />
                        </div>

                        {/* Related Movies Section */}
                        <div>
                            <h3 className="text-xl font-medium text-[var(--mf-text-high)] mb-5 flex items-center gap-2">
                                <Play className="w-5 h-5 text-[var(--mf-primary)]" />
                                Benzer İçerikler
                            </h3>

                            {relatedMovies.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {relatedMovies.map((relatedMovie) => (
                                        <Link
                                            key={relatedMovie.id}
                                            href={`/watch/${relatedMovie.id}`}
                                            className="group"
                                        >
                                            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[var(--mf-dark)] border border-[var(--border-subtle)] group-hover:border-[var(--mf-primary)]/50 transition-all">
                                                {/* Thumbnail Placeholder */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/50 to-purple-900/50 flex items-center justify-center">
                                                    <span className="headline-serif text-4xl text-white/20">
                                                        {relatedMovie.title[0]}
                                                    </span>
                                                </div>

                                                {/* Hover Overlay */}
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                                                        <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                                                    </div>
                                                </div>

                                                {/* Bottom Info */}
                                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                                                    <p className="text-sm font-medium text-white truncate">{relatedMovie.title}</p>
                                                    <p className="text-xs text-white/60">{relatedMovie.release_year}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[var(--mf-text-low)]">Benzer içerik bulunamadı.</p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Producer Card */}
                        <div className="glass-card p-6">
                            <h3 className="text-sm font-medium text-[var(--mf-text-low)] mb-4 uppercase tracking-wide">
                                Yapımcı
                            </h3>
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--mf-primary)] to-[var(--mf-primary-glow)] flex items-center justify-center text-xl font-semibold text-white">
                                    {movie.profiles?.display_name?.[0]?.toUpperCase() || "M"}
                                </div>
                                <div>
                                    <p className="font-medium text-[var(--mf-text-high)] text-lg">
                                        {movie.profiles?.display_name || movie.profiles?.full_name || "Mafilu Yapımcı"}
                                    </p>
                                    <p className="text-sm text-[var(--mf-text-medium)] flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5" />
                                        Bağımsız Yapımcı
                                    </p>
                                </div>
                            </div>
                            <button className="w-full py-3 rounded-xl bg-[var(--mf-primary)] hover:bg-[var(--mf-primary-glow)] text-white font-medium transition-colors">
                                Takip Et
                            </button>
                        </div>

                        {/* Movie Details Card */}
                        <div className="glass-card p-6">
                            <h3 className="text-sm font-medium text-[var(--mf-text-low)] mb-4 uppercase tracking-wide">
                                Film Detayları
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-[var(--mf-text-medium)]">Yayın Yılı</span>
                                    <span className="text-[var(--mf-text-high)]">{movie.release_year}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--mf-text-medium)]">Tür</span>
                                    <span className="text-[var(--mf-text-high)]">{movie.genre}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--mf-text-medium)]">Süre</span>
                                    <span className="text-[var(--mf-text-high)]">{duration}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--mf-text-medium)]">Kalite</span>
                                    <span className="text-[var(--mf-text-high)]">4K Ultra HD</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--mf-text-medium)]">Ses</span>
                                    <span className="text-[var(--mf-text-high)]">Türkçe, İngilizce</span>
                                </div>
                            </div>
                        </div>

                        {/* Share Card */}
                        <div className="glass-card p-6">
                            <h3 className="text-sm font-medium text-[var(--mf-text-low)] mb-4 uppercase tracking-wide">
                                Paylaş
                            </h3>
                            <div className="flex gap-3">
                                <button className="flex-1 py-2.5 rounded-lg bg-[var(--mf-surface)] hover:bg-[var(--mf-elevated)] text-[var(--mf-text-medium)] transition-colors text-sm">
                                    Twitter
                                </button>
                                <button className="flex-1 py-2.5 rounded-lg bg-[var(--mf-surface)] hover:bg-[var(--mf-elevated)] text-[var(--mf-text-medium)] transition-colors text-sm">
                                    Facebook
                                </button>
                                <button className="flex-1 py-2.5 rounded-lg bg-[var(--mf-surface)] hover:bg-[var(--mf-elevated)] text-[var(--mf-text-medium)] transition-colors text-sm">
                                    Kopyala
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Spacer for footer */}
                <div className="h-20" />
            </main>
        </div>
    );
}
