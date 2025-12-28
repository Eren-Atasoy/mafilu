"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info } from "lucide-react";
import type { FeaturedMovie } from "@/lib/supabase/queries";

interface HeroSectionProps {
  movies: FeaturedMovie[];
}

export function HeroSection({ movies }: HeroSectionProps) {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate hero every 8 seconds
  useEffect(() => {
    if (!isAutoPlaying || movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % movies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, movies.length]);

  if (movies.length === 0) {
    return null;
  }

  const currentHero = movies[currentHeroIndex];

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentHeroIndex(index);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
      {/* Background Gradient Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentHero.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          {/* Deep Cinema Gradient Background */}
          <div
            className="absolute inset-0 ken-burns"
            style={{
              background: `
                radial-gradient(ellipse 80% 50% at 20% 40%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse 60% 40% at 80% 60%, rgba(244, 114, 182, 0.08) 0%, transparent 50%),
                linear-gradient(180deg, var(--mf-elevated) 0%, var(--mf-dark) 30%, var(--mf-black) 100%)
              `,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--mf-black)] via-transparent to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--mf-black)] via-[var(--mf-black)]/30 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 h-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col justify-end pb-40 md:pb-48">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHero.id + "-content"}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl"
          >
            {/* Subtitle Badge */}
            {currentHero.subtitle && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-5"
              >
                <span className="inline-flex items-center px-3 py-1.5 text-[11px] font-semibold tracking-[0.15em] uppercase text-[var(--mf-accent)] bg-[var(--mf-accent)]/10 border border-[var(--mf-accent)]/30 rounded-sm">
                  {currentHero.subtitle}
                </span>
              </motion.div>
            )}

            {/* Title - Using Display Font */}
            <h1 className="headline-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-[var(--mf-text-high)] mb-3 tracking-[-0.02em] leading-[0.95]">
              {currentHero.title}
            </h1>

            {/* Tagline - Italic */}
            {currentHero.tagline && (
              <p className="headline-italic text-xl md:text-2xl text-[var(--mf-text-medium)] mb-5">
                {currentHero.tagline}
              </p>
            )}

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
              <span className="flex items-center text-[var(--mf-primary-glow)] font-medium">
                <span className="text-lg mr-1">★</span> {currentHero.rating}
              </span>
              <span className="w-1 h-1 rounded-full bg-[var(--mf-text-low)]" />
              {currentHero.year && (
                <>
                  <span className="text-[var(--mf-text-medium)]">{currentHero.year}</span>
                  <span className="w-1 h-1 rounded-full bg-[var(--mf-text-low)]" />
                </>
              )}
              <span className="text-[var(--mf-text-medium)]">{currentHero.duration}</span>
              {currentHero.maturity && (
                <>
                  <span className="w-1 h-1 rounded-full bg-[var(--mf-text-low)]" />
                  <span className="px-2 py-0.5 text-xs font-medium border border-[var(--mf-text-low)] text-[var(--mf-text-medium)] rounded">
                    {currentHero.maturity}
                  </span>
                </>
              )}
              <span className="w-1 h-1 rounded-full bg-[var(--mf-text-low)]" />
              <span className="text-[var(--mf-text-medium)]">{currentHero.genre}</span>
            </div>

            {/* Description */}
            {currentHero.description && (
              <p className="text-base md:text-lg text-[var(--mf-text-medium)] mb-8 leading-relaxed max-w-lg">
                {currentHero.description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link href={`/watch/${currentHero.id}`}>
                <motion.button
                  className="btn-primary"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Oynat</span>
                </motion.button>
              </Link>

            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hero Navigation Dots */}
      {movies.length > 1 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
          {movies.map((movie, index) => (
            <button
              key={movie.id}
              onClick={() => goToSlide(index)}
              className="group relative py-2"
              aria-label={`Go to ${movie.title}`}
            >
              <div
                className={`h-[3px] rounded-full transition-all duration-500 ${index === currentHeroIndex
                    ? "w-16 bg-[var(--mf-primary)]"
                    : "w-8 bg-white/30 group-hover:bg-white/50"
                  }`}
              />
              {index === currentHeroIndex && (
                <motion.div
                  className="absolute inset-0 h-[3px] bg-[var(--mf-primary-glow)] rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 8, ease: "linear" }}
                  key={currentHeroIndex}
                  style={{ top: "8px" }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

