"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Info,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
} from "lucide-react";

// ============================================
// MOCK DATA
// ============================================

const heroMovies = [
  {
    id: "hero-1",
    title: "Kayıp Şehir",
    subtitle: "Mafilu Orijinal",
    tagline: "Her sır, bir bedel ister.",
    description: "Antik bir haritanın peşinde düşen arkeolog, beklenmedik bir maceranın içine sürüklenir.",
    genre: "Macera • Gizem",
    year: 2024,
    rating: "8.4",
    duration: "2s 15dk",
    maturity: "16+",
  },
  {
    id: "hero-2",
    title: "Son Gece",
    subtitle: "Yeni Sezon",
    tagline: "Geçmiş her zaman geri döner.",
    description: "İstanbul'un karanlık sokaklarında geçen bu gerilim serisi, bir dedektifin son davasını konu alır.",
    genre: "Gerilim • Suç",
    year: 2024,
    rating: "9.1",
    duration: "8 Bölüm",
    maturity: "18+",
  },
  {
    id: "hero-3",
    title: "Mavi Rüya",
    subtitle: "Ödüllü Yapım",
    tagline: "Sanat, acının en güzel hali.",
    description: "Genç bir ressamın hayalleri ile gerçeklik arasındaki yolculuğu. Uluslararası ödüllü yapım.",
    genre: "Drama • Sanat",
    year: 2023,
    rating: "8.7",
    duration: "2s 05dk",
    maturity: "13+",
  },
];

const movieCategories = [
  {
    id: "originals",
    title: "Mafilu Orijinalleri",
    movies: [
      { id: "m1", title: "Sessiz Tanık", genre: "Gerilim", year: 2024, rating: "8.8", isOriginal: true },
      { id: "m2", title: "Yıldız Tozu", genre: "Drama", year: 2024, rating: "9.0", isOriginal: true },
      { id: "m3", title: "Labirent", genre: "Gizem", year: 2024, rating: "8.5", isOriginal: true },
      { id: "m4", title: "Son Vals", genre: "Romantik", year: 2024, rating: "8.3", isOriginal: true },
      { id: "m5", title: "Karanlık Sular", genre: "Aksiyon", year: 2024, rating: "8.7", isOriginal: true },
      { id: "m6", title: "Ayna", genre: "Psikolojik", year: 2024, rating: "9.2", isOriginal: true },
    ],
  },
  {
    id: "trending",
    title: "Şu An Trend",
    movies: [
      { id: "m7", title: "Fırtına Öncesi", genre: "Aksiyon", year: 2024, rating: "8.0", isNew: true },
      { id: "m8", title: "Umut Yolu", genre: "Drama", year: 2024, rating: "8.9" },
      { id: "m9", title: "Kod Adı: Zaman", genre: "Bilim Kurgu", year: 2024, rating: "8.5", isNew: true },
      { id: "m10", title: "Dağların Ardında", genre: "Belgesel", year: 2024, rating: "9.1" },
      { id: "m11", title: "Gece Yarısı", genre: "Korku", year: 2024, rating: "7.8" },
      { id: "m12", title: "İstanbul Gece", genre: "Suç", year: 2024, rating: "8.4", isNew: true },
    ],
  },
  {
    id: "awards",
    title: "Festival Ödüllü",
    movies: [
      { id: "m13", title: "Bağımsız Ruhlar", genre: "Drama", year: 2023, rating: "9.4" },
      { id: "m14", title: "Denizin Sesi", genre: "Belgesel", year: 2023, rating: "9.0" },
      { id: "m15", title: "Kış Masalı", genre: "Romantik", year: 2023, rating: "8.8" },
      { id: "m16", title: "Kadim Şehir", genre: "Tarih", year: 2023, rating: "8.7" },
      { id: "m17", title: "Yalnız Kurt", genre: "Western", year: 2022, rating: "8.5" },
      { id: "m18", title: "Anadolu", genre: "Drama", year: 2023, rating: "9.3" },
    ],
  },
  {
    id: "turkish",
    title: "Türk Sineması",
    movies: [
      { id: "m19", title: "Prens", genre: "Drama", year: 2024, rating: "8.7" },
      { id: "m20", title: "Boğaz'da Aşk", genre: "Romantik", year: 2024, rating: "7.9" },
      { id: "m21", title: "Yeşil Vadi", genre: "Doğa", year: 2024, rating: "8.6" },
      { id: "m22", title: "Cumhuriyet", genre: "Tarih", year: 2023, rating: "9.2" },
      { id: "m23", title: "Sokak Kedisi", genre: "Animasyon", year: 2024, rating: "8.1" },
      { id: "m24", title: "Yolcu", genre: "Yol", year: 2024, rating: "8.4" },
    ],
  },
  {
    id: "documentary",
    title: "Belgeseller",
    movies: [
      { id: "m25", title: "Dünya'nın Sesi", genre: "Doğa", year: 2024, rating: "9.0" },
      { id: "m26", title: "Atölye", genre: "Sanat", year: 2024, rating: "8.5" },
      { id: "m27", title: "Göç", genre: "Toplum", year: 2024, rating: "8.8" },
      { id: "m28", title: "Müzik Fabrikası", genre: "Müzik", year: 2024, rating: "8.3" },
      { id: "m29", title: "Mutfak", genre: "Yemek", year: 2024, rating: "8.1" },
      { id: "m30", title: "Spor Efsaneleri", genre: "Spor", year: 2024, rating: "8.6" },
    ],
  },
];

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

// ============================================
// MAIN COMPONENT
// ============================================

export default function HomePage() {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate hero every 8 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentHero = heroMovies[currentHeroIndex];

  const toggleWatchlist = (movieId: string) => {
    setWatchlist((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(movieId)) {
        newSet.delete(movieId);
      } else {
        newSet.add(movieId);
      }
      return newSet;
    });
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentHeroIndex(index);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  return (
    <div className="min-h-screen bg-[var(--mf-black)]">
      {/* ================================================
          HERO SECTION - Full Screen Cinematic
          ================================================ */}
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
                  linear-gradient(180deg, #2B0F3F 0%, #120621 30%, #050208 100%)
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

              {/* Title - Using Display Font */}
              <h1 className="headline-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-[var(--mf-text-high)] mb-3 tracking-[-0.02em] leading-[0.95]">
                {currentHero.title}
              </h1>

              {/* Tagline - Italic */}
              <p className="headline-italic text-xl md:text-2xl text-[var(--mf-text-medium)] mb-5">
                {currentHero.tagline}
              </p>

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
                <span className="flex items-center text-[var(--mf-primary-glow)] font-medium">
                  <span className="text-lg mr-1">★</span> {currentHero.rating}
                </span>
                <span className="w-1 h-1 rounded-full bg-[var(--mf-text-low)]" />
                <span className="text-[var(--mf-text-medium)]">{currentHero.year}</span>
                <span className="w-1 h-1 rounded-full bg-[var(--mf-text-low)]" />
                <span className="text-[var(--mf-text-medium)]">{currentHero.duration}</span>
                <span className="w-1 h-1 rounded-full bg-[var(--mf-text-low)]" />
                <span className="px-2 py-0.5 text-xs font-medium border border-[var(--mf-text-low)] text-[var(--mf-text-medium)] rounded">
                  {currentHero.maturity}
                </span>
                <span className="w-1 h-1 rounded-full bg-[var(--mf-text-low)]" />
                <span className="text-[var(--mf-text-medium)]">{currentHero.genre}</span>
              </div>

              {/* Description */}
              <p className="text-base md:text-lg text-[var(--mf-text-medium)] mb-8 leading-relaxed max-w-lg">
                {currentHero.description}
              </p>

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
                <motion.button
                  className="btn-secondary"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Info className="w-5 h-5" />
                  <span>Detaylar</span>
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Hero Navigation Dots */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
          {heroMovies.map((movie, index) => (
            <button
              key={index}
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

        {/* Side Navigation Arrows */}
        <button
          onClick={() => goToSlide((currentHeroIndex - 1 + heroMovies.length) % heroMovies.length)}
          className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-[var(--mf-black)]/60 hover:bg-[var(--mf-dark)] rounded-full transition-all border border-[var(--border-subtle)] backdrop-blur-sm opacity-0 hover:opacity-100 focus:opacity-100"
          style={{ opacity: 0.7 }}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => goToSlide((currentHeroIndex + 1) % heroMovies.length)}
          className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-[var(--mf-black)]/60 hover:bg-[var(--mf-dark)] rounded-full transition-all border border-[var(--border-subtle)] backdrop-blur-sm opacity-0 hover:opacity-100 focus:opacity-100"
          style={{ opacity: 0.7 }}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </section>

      {/* ================================================
          MOVIE CATEGORIES
          ================================================ */}
      <main className="relative z-10 -mt-24 pb-20">
        {movieCategories.map((category, categoryIndex) => (
          <MovieRow
            key={category.id}
            title={category.title}
            movies={category.movies}
            delay={categoryIndex * 0.1}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
          />
        ))}
      </main>

      {/* ================================================
          FOOTER
          ================================================ */}
      <footer className="border-t border-[var(--border-subtle)] py-16 bg-[var(--mf-black)]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <span className="headline-serif text-3xl font-light text-[var(--mf-text-high)] tracking-tight">
                mafilu
              </span>
              <span className="text-[var(--mf-text-low)]">|</span>
              <span className="text-[var(--mf-text-medium)] text-sm tracking-wide">Bağımsız Sinema Platformu</span>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <Link href="/privacy" className="text-[var(--mf-text-medium)] hover:text-[var(--mf-text-high)] transition-colors">
                Gizlilik
              </Link>
              <Link href="/terms" className="text-[var(--mf-text-medium)] hover:text-[var(--mf-text-high)] transition-colors">
                Kullanım Koşulları
              </Link>
              <Link href="/contact" className="text-[var(--mf-text-medium)] hover:text-[var(--mf-text-high)] transition-colors">
                İletişim
              </Link>
            </div>
            <p className="text-[var(--mf-text-low)] text-sm">© 2024 Mafilu</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// MOVIE ROW COMPONENT
// ============================================

interface Movie {
  id: string;
  title: string;
  genre: string;
  year: number;
  rating: string;
  isNew?: boolean;
  isOriginal?: boolean;
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
  delay?: number;
  watchlist: Set<string>;
  onToggleWatchlist: (id: string) => void;
}

function MovieRow({ title, movies, delay = 0, watchlist, onToggleWatchlist }: MovieRowProps) {
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
      return () => row.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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

// ============================================
// MOVIE CARD COMPONENT
// ============================================

interface MovieCardProps {
  movie: Movie;
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
          {/* Thumbnail Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getPlaceholderGradient(movie.id)}`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="headline-serif text-6xl font-light text-white/10">{movie.title[0]}</span>
            </div>
          </div>

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
              <span>{movie.year}</span>
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
                <p className="text-xs text-[var(--mf-text-medium)]">{movie.genre}</p>

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
