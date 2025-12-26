import Link from "next/link";
import { Play, Eye } from "lucide-react";

interface RelatedMovie {
    id: string;
    title: string;
    genre: string;
    total_views: number;
    thumbnailUrl?: string;
}

interface RelatedMoviesProps {
    movies: RelatedMovie[];
}

export function RelatedMovies({ movies }: RelatedMoviesProps) {
    if (movies.length === 0) {
        return (
            <div className="text-center py-6 text-[#6B5F7C] text-sm">
                Henüz benzer film yok
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {movies.map((movie) => (
                <Link
                    key={movie.id}
                    href={`/watch/${movie.id}`}
                    className="flex gap-3 p-2 rounded-xl hover:bg-[#150A24] transition-colors group"
                >
                    {/* Thumbnail */}
                    <div className="w-32 aspect-video bg-slate-800 rounded-lg overflow-hidden relative flex-shrink-0">
                        {movie.thumbnailUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={movie.thumbnailUrl}
                                alt={movie.title}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Play className="w-6 h-6 text-slate-600" />
                            </div>
                        )}
                        {/* Hover overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                            <div className="w-8 h-8 rounded-full bg-[#7C3AED]/90 flex items-center justify-center">
                                <Play className="w-4 h-4 text-white ml-0.5" />
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 py-1 min-w-0">
                        <h4 className="font-medium text-sm text-[#F5F3FF] truncate group-hover:text-[#C4B5FD] transition-colors">
                            {movie.title}
                        </h4>
                        <p className="text-xs text-[#6B5F7C] mt-1 capitalize">
                            {movie.genre.replace("_", " ")}
                        </p>
                        {movie.total_views > 0 && (
                            <p className="text-xs text-[#6B5F7C] mt-1 flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {movie.total_views.toLocaleString()}
                            </p>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    );
}
