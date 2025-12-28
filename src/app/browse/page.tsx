import { createClient } from "@/lib/supabase/server";
import { bunnyStream } from "@/lib/bunny";
import BrowseClient from "./browse-client";
import type { Metadata } from "next";

// Force dynamic rendering - uses Supabase server client
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Filmleri Keşfet | Mafilu",
    description: "Bağımsız sinema filmlerini keşfedin. Tür, yıl ve daha fazlasına göre filtreleyin.",
    openGraph: {
        title: "Filmleri Keşfet | Mafilu",
        description: "Bağımsız sinema filmlerini keşfedin. Tür, yıl ve daha fazlasına göre filtreleyin.",
        type: "website",
        siteName: "Mafilu",
    },
    twitter: {
        card: "summary",
        title: "Filmleri Keşfet | Mafilu",
        description: "Bağımsız sinema filmlerini keşfedin.",
    },
    alternates: {
        canonical: "/browse",
    },
};

export default async function BrowsePage() {
    const supabase = await createClient();

    // Fetch approved movies
    const { data: movies, error } = await supabase
        .from("movies")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching movies:", error);
    }

    // Process movies to add thumbnail URLs
    const processedMovies = (movies || []).map((movie) => ({
        id: movie.id,
        title: movie.title,
        description: movie.description,
        genre: movie.genre,
        release_year: movie.release_year,
        total_views: movie.total_views || 0,
        bunny_video_id: movie.bunny_video_id,
        thumbnailUrl: movie.bunny_video_id
            ? bunnyStream.getThumbnailUrl(movie.bunny_video_id)
            : undefined,
    }));

    // Extract unique genres
    const genres = [...new Set(movies?.map((m) => m.genre).filter(Boolean) || [])];

    return (
        <div className="min-h-screen bg-[var(--mf-black-alt)] relative overflow-hidden">
            {/* Background glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-30" style={{
                    background: `radial-gradient(ellipse, rgba(124, 58, 237, 0.15) 0%, transparent 70%)`,
                    filter: "blur(80px)"
                }} />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-20" style={{
                    background: "radial-gradient(ellipse, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
                    filter: "blur(80px)"
                }} />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-[var(--mf-text-high)] headline-serif">Keşfet</h1>
                    <p className="text-[var(--mf-text-medium)] mt-2">Bağımsız sinemanın en yeni, en çarpıcı yapımları.</p>
                </div>

                <BrowseClient movies={processedMovies} genres={genres} />
            </main>
        </div>
    );
}
