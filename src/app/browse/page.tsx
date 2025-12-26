import { createClient } from "@/lib/supabase/server";
import { bunnyStream } from "@/lib/bunny";
import Link from "next/link";
import { Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

    return (
        <div className="min-h-screen bg-[#0A0510] relative overflow-hidden">
            {/* Background glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-30" style={{
                    background: "radial-gradient(ellipse, rgba(124, 58, 237, 0.15) 0%, transparent 70%)",
                    filter: "blur(80px)"
                }} />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-20" style={{
                    background: "radial-gradient(ellipse, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
                    filter: "blur(80px)"
                }} />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-[#F5F3FF] headline-serif">Keşfet</h1>
                    <p className="text-[#A197B0] mt-2">Bağımsız sinemanın en yeni, en çarpıcı yapımları.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {movies?.map((movie) => {
                        const thumbnailUrl = movie.bunny_video_id
                            ? bunnyStream.getThumbnailUrl(movie.bunny_video_id)
                            : null;

                        return (
                            <Link href={`/watch/${movie.id}`} key={movie.id} className="group">
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
                                                {movie.genre}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-[#F5F3FF] truncate">{movie.title}</h3>
                                        <div className="flex items-center justify-between mt-2 text-sm text-[#6B5F7C]">
                                            <span>{movie.release_year || "—"}</span>
                                            <span className="flex items-center gap-1">
                                                {movie.total_views > 0 && (
                                                    <span className="text-xs">{movie.total_views.toLocaleString()} görüntülenme</span>
                                                )}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {(!movies || movies.length === 0) && (
                    <div className="text-center py-20">
                        <p className="text-[#6B5F7C] text-lg">Henüz hiç film yayınlanmamış.</p>
                        <p className="text-[#A197B0] text-sm mt-2">Daha sonra tekrar kontrol edin.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
