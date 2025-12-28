import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mafilu.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient();

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/browse`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/subscription`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/signup`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];

    // Dynamic movie pages
    const { data: movies, error } = await supabase
        .from("movies")
        .select("id, updated_at")
        .eq("status", "approved")
        .order("updated_at", { ascending: false });

    if (error) {
        console.error("Error fetching movies for sitemap:", error);
        return staticPages;
    }

    const moviePages: MetadataRoute.Sitemap = (movies || []).map((movie) => ({
        url: `${baseUrl}/watch/${movie.id}`,
        lastModified: new Date(movie.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    return [...staticPages, ...moviePages];
}
