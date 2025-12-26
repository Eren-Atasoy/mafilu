import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { bunnyStream } from "@/lib/bunny";
import MovieReviewClient from "./movie-review-client";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminMovieReviewPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: movie, error } = await supabase
        .from("movies")
        .select(`
            *,
            profiles:producer_id (
                display_name,
                full_name,
                email
            )
        `)
        .eq("id", id)
        .single();

    if (error || !movie) {
        notFound();
    }

    const embedUrl = movie.bunny_video_id
        ? bunnyStream.getEmbedUrl(movie.bunny_video_id)
        : null;

    return <MovieReviewClient movie={movie} embedUrl={embedUrl} />;
}
