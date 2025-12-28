"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Plus, Check } from "lucide-react";
import type { MovieCard } from "@/lib/supabase/queries";

interface MovieRowProps {
  title: string;
  movies: MovieCard[];
  delay?: number;
  watchlist: Set<string>;
  onToggleWatchlist: (id: string) => void;
}

// Placeholder gradient for movie thumbnails
const getPlaceholderGradient = (id: string) => {
  const gradients = [
    "from-violet-900 via-purple-800 to-indigo-900",
    "from-rose-900 via-pink-800 to-red-900",
    "from-blue-900 via-cyan-800 to-teal-900",
    "from-emerald-900 via-green-800 to-lime-900",
    "from-amber-900 via-orange-800 to-red-900",
    "from-fuchsia-900 via-purple-800 to-violet-900",
    "from-sky-900 via-blue-800 to-indigo-900",
    "from-teal-900 via-cyan-800 to-blue-900",
  ];
  const index = parseInt(id.replace(/\D/g, "")) % gradients.length;
  return gradients[index];
};

export function MovieRow({ title, movies, delay = 0, watchlist, onToggleWatchlist }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const row = rowRef.current;
    if (row) {
      row.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        row.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [movies]);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (movies.length === 0) {
    return null;
  }

  return (
    <motion.section
      className="mb-12 relative category-row"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
    >
      {/* Section Title */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-5">
        <h2 className="text-xl md:text-2xl font-medium text-[var(--mf-text-high)] tracking-tight">
          {title}
        </h2>
      </div>

      {/* Scroll Container */}
      <div className="relative group">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="scroll-arrow left"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="scroll-arrow right"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Movies */}
        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-6 md:px-12 scroll-smooth pb-4"
        >
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              index={index}
              isInWatchlist={watchlist.has(movie.id)}
              onToggleWatchlist={() => onToggleWatchlist(movie.id)}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

interface MovieCardProps {
  movie: MovieCard;
  index: number;
  isInWatchlist: boolean;
  onToggleWatchlist: () => void;
}

function MovieCard({ movie, index, isInWatchlist, onToggleWatchlist }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative flex-shrink-0 w-[160px] md:w-[200px] lg:w-[220px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/watch/${movie.id}`} className="block">
        <motion.div
          className="movie-card"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {/* Thumbnail */}
          {movie.thumbnailUrl ? (
            <Image
              src={movie.thumbnailUrl}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 160px, (max-width: 1024px) 200px, 220px"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${getPlaceholderGradient(movie.id)}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="headline-serif text-6xl font-light text-white/10">{movie.title[0]}</span>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {movie.isNew && <span className="badge-new">Yeni</span>}
            {movie.isOriginal && <span className="badge-original">Orijinal</span>}
          </div>

          {/* Bottom Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[var(--mf-black)] via-[var(--mf-black)]/60 to-transparent z-[1]" />

          {/* Title & Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-[2]">
            <h3 className="text-sm font-medium text-[var(--mf-text-high)] truncate mb-1">{movie.title}</h3>
            <div className="flex items-center gap-2 text-xs text-[var(--mf-text-medium)]">
              <span className="text-[var(--mf-primary-glow)]">★ {movie.rating}</span>
              {movie.year && <span>{movie.year}</span>}
            </div>
          </div>

          {/* Hover Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 bg-[var(--mf-black)]/70 flex flex-col items-center justify-center z-[5] backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Play Button */}
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-3 shadow-lg">
                  <Play className="w-6 h-6 text-[var(--mf-black)] fill-current ml-1" />
                </div>
                <div className="px-4 text-center">
                  <p className="text-xs text-[var(--mf-text-medium)] line-clamp-3 leading-relaxed">
                    {movie.description || movie.genre}
                  </p>
                </div>

                {/* Watchlist Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleWatchlist();
                  }}
                  className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isInWatchlist
                      ? "bg-[var(--mf-primary)] text-white"
                      : "bg-[var(--mf-black)]/60 text-white border border-white/30 hover:border-white"
                    }`}
                >
                  {isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
    </motion.div>
  );
}

