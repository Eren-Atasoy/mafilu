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

// Mock Data - Featured Movies for Hero
const heroMovies = [
  {
    id: "hero-1",
    title: "Kayıp Şehir",
    subtitle: "BİR MAFİLU ORİJİNAL YAPIMI",
    description: "Antik bir haritanın peşinde düşen arkeolog, beklenmedik bir maceranın içine sürüklenir. Gizemli bir şehrin sırları, onu geçmişiyle yüzleşmeye zorlar.",
    genre: "Macera",
    year: 2024,
    rating: "8.4",
    duration: "2s 15dk",
    maturity: "16+",
    bgGradient: "from-indigo-950 via-slate-900 to-black",
  },
  {
    id: "hero-2",
    title: "Son Gece",
    subtitle: "YENİ SEZON",
    description: "İstanbul'un karanlık sokaklarında geçen bu gerilim filmi, bir dedektifin son davasını konu alıyor. Her ipucu onu daha derin bir komploya sürükler.",
    genre: "Gerilim",
    year: 2024,
    rating: "9.1",
    duration: "1s 58dk",
    maturity: "18+",
    bgGradient: "from-rose-950 via-slate-900 to-black",
  },
  {
    id: "hero-3",
    title: "Mavi Rüya",
    subtitle: "ÖDÜLLÜ YAPIM",
    description: "Genç bir ressamın hayalleri ile gerçeklik arasındaki yolculuğu. Sanat, aşk ve kayıp üzerine derin bir meditasyon.",
    genre: "Drama",
    year: 2023,
    rating: "8.7",
    duration: "2s 05dk",
    maturity: "13+",
    bgGradient: "from-purple-950 via-slate-900 to-black",
  },
];

// Mock Data - Movie Categories
const movieCategories = [
  {
    id: "popular",
    title: "Popüler Filmler",
    movies: [
      { id: "m1", title: "Sessiz Çığlık", genre: "Korku", year: 2024, rating: "7.8", isNew: true },
      { id: "m2", title: "Aşkın Matematiği", genre: "Romantik", year: 2023, rating: "8.2" },
      { id: "m3", title: "Kod Adı: Zaman", genre: "Bilim Kurgu", year: 2024, rating: "8.5", isNew: true },
      { id: "m4", title: "Dağların Ardında", genre: "Dram", year: 2023, rating: "9.0" },
      { id: "m5", title: "Son Tren", genre: "Gerilim", year: 2024, rating: "7.9" },
      { id: "m6", title: "Yıldız Tozu", genre: "Fantastik", year: 2024, rating: "8.1", isNew: true },
      { id: "m7", title: "Karanlık Sular", genre: "Aksiyon", year: 2024, rating: "8.3" },
    ],
  },
  {
    id: "originals",
    title: "Mafilu Orijinalleri",
    movies: [
      { id: "m8", title: "Bir Başka Gün", genre: "Komedi", year: 2024, rating: "7.6", isOriginal: true },
      { id: "m9", title: "Labirent", genre: "Gizem", year: 2023, rating: "8.8", isOriginal: true },
      { id: "m10", title: "Sahne Işıkları", genre: "Müzikal", year: 2024, rating: "8.4", isOriginal: true },
      { id: "m11", title: "Gölgeler", genre: "Korku", year: 2024, rating: "7.5", isOriginal: true },
      { id: "m12", title: "Umut Yolu", genre: "Dram", year: 2023, rating: "9.2", isOriginal: true },
      { id: "m13", title: "Fırtına Öncesi", genre: "Aksiyon", year: 2024, rating: "8.0", isOriginal: true },
    ],
  },
  {
    id: "trending",
    title: "Trend Olanlar",
    movies: [
      { id: "m14", title: "Kara Kutu", genre: "Gerilim", year: 2024, rating: "8.6" },
      { id: "m15", title: "Ayna", genre: "Psikolojik", year: 2024, rating: "8.9" },
      { id: "m16", title: "İlk Adım", genre: "Belgesel", year: 2024, rating: "9.1" },
      { id: "m17", title: "Renkler", genre: "Deneysel", year: 2024, rating: "7.7" },
      { id: "m18", title: "Sonsuzluk", genre: "Bilim Kurgu", year: 2024, rating: "8.2" },
      { id: "m19", title: "Bağımsız Ruhlar", genre: "Dram", year: 2023, rating: "9.4" },
    ],
  },
  {
    id: "awards",
    title: "Ödüllü Yapımlar",
    movies: [
      { id: "m20", title: "Kış Masalı", genre: "Romantik", year: 2022, rating: "8.8" },
      { id: "m21", title: "Denizin Sesi", genre: "Belgesel", year: 2023, rating: "9.0" },
      { id: "m22", title: "Kadim Şehir", genre: "Tarih", year: 2023, rating: "8.7" },
      { id: "m23", title: "Yalnız Kurt", genre: "Western", year: 2022, rating: "8.5" },
      { id: "m24", title: "Son Vals", genre: "Müzikal", year: 2023, rating: "9.3" },
      { id: "m25", title: "Anadolu Hikayesi", genre: "Dram", year: 2024, rating: "8.9" },
    ],
  },
  {
    id: "turkish",
    title: "Türk Yapımları",
    movies: [
      { id: "m26", title: "İstanbul Gece", genre: "Suç", year: 2024, rating: "8.4" },
      { id: "m27", title: "Boğaz'da Aşk", genre: "Romantik", year: 2024, rating: "7.8" },
      { id: "m28", title: "Yeşil Vadi", genre: "Doğa", year: 2023, rating: "8.6" },
      { id: "m29", title: "Cumhuriyet", genre: "Tarih", year: 2023, rating: "9.2" },
      { id: "m30", title: "Sokak Kedisi", genre: "Animasyon", year: 2024, rating: "8.1" },
      { id: "m31", title: "Prens", genre: "Dram", year: 2024, rating: "8.7" },
    ],
  },
];

// Generate placeholder colors for thumbnails
const getPlaceholderGradient = (id: string) => {
  const gradients = [
    "from-purple-800 to-indigo-900",
    "from-rose-800 to-pink-900",
    "from-blue-800 to-cyan-900",
    "from-emerald-800 to-teal-900",
    "from-orange-800 to-amber-900",
    "from-violet-800 to-purple-900",
    "from-red-800 to-rose-900",
    "from-sky-800 to-blue-900",
  ];
  const index = parseInt(id.replace(/\D/g, "")) % gradients.length;
  return gradients[index];
};

export default function HomePage() {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate hero
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
    }, 6000);
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
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section - Full Screen */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
        {/* Background with gradient */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHero.id}
            className={`absolute inset-0 bg-gradient-to-br ${currentHero.bgGradient}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            {/* Pattern overlay for texture */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-10" />

        {/* Content Container */}
        <div className="relative z-20 h-full max-w-[1800px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col justify-end pb-32 md:pb-40">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHero.id + "-content"}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl"
            >
              {/* Subtitle Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-4"
              >
                <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold tracking-[0.2em] text-purple-300 bg-purple-500/20 border border-purple-500/30 rounded">
                  {currentHero.subtitle}
                </span>
              </motion.div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight leading-none">
                {currentHero.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3 mb-5 text-sm">
                <span className="flex items-center text-green-400 font-semibold">
                  <span className="text-lg mr-1">★</span> {currentHero.rating}
                </span>
                <span className="text-gray-400">{currentHero.year}</span>
                <span className="text-gray-400">{currentHero.duration}</span>
                <span className="px-2 py-0.5 text-xs border border-gray-500 text-gray-400 rounded">
                  {currentHero.maturity}
                </span>
                <span className="text-gray-400">{currentHero.genre}</span>
              </div>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
                {currentHero.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link href={`/watch/${currentHero.id}`}>
                  <motion.button
                    className="flex items-center gap-3 px-8 py-4 bg-white text-black font-bold text-lg rounded hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-6 h-6 fill-current" />
                    <span>Oynat</span>
                  </motion.button>
                </Link>
                <motion.button
                  className="flex items-center gap-3 px-8 py-4 bg-gray-600/60 text-white font-semibold text-lg rounded hover:bg-gray-600/80 transition-colors backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Info className="w-6 h-6" />
                  <span>Daha Fazla</span>
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Hero Navigation Dots */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {heroMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="group relative"
            >
              <div
                className={`h-1 rounded-full transition-all duration-500 ${index === currentHeroIndex
                    ? "w-12 bg-white"
                    : "w-6 bg-white/40 group-hover:bg-white/60"
                  }`}
              />
              {index === currentHeroIndex && (
                <motion.div
                  className="absolute inset-0 h-1 bg-purple-500 rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 6, ease: "linear" }}
                  key={currentHeroIndex}
                />
              )}
            </button>
          ))}
        </div>

        {/* Arrow Navigation */}
        <button
          onClick={() => goToSlide((currentHeroIndex - 1 + heroMovies.length) % heroMovies.length)}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full transition-colors backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => goToSlide((currentHeroIndex + 1) % heroMovies.length)}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full transition-colors backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </section>

      {/* Movie Categories */}
      <main className="relative z-10 -mt-32 pb-20 bg-gradient-to-b from-transparent to-black">
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

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-gray-500 text-sm">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-white tracking-tight">mafilu</div>
              <span className="text-gray-600">|</span>
              <span>Bağımsız Sinema Platformu</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Gizlilik</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Kullanım Koşulları</Link>
              <Link href="/contact" className="hover:text-white transition-colors">İletişim</Link>
            </div>
            <p>© 2024 Mafilu. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Movie Row Component with horizontal scroll
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
      const scrollAmount = rowRef.current.clientWidth * 0.8;
      rowRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.section
      className="mb-10 relative group/row"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      {/* Section Header */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-white">{title}</h2>
      </div>

      {/* Scroll Container */}
      <div className="relative">
        {/* Left Arrow */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll("left")}
              className="absolute left-0 top-0 bottom-0 z-20 w-16 md:w-24 flex items-center justify-start pl-4 bg-gradient-to-r from-black to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-black/80 rounded-full">
                <ChevronLeft className="w-6 h-6 text-white" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Right Arrow */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll("right")}
              className="absolute right-0 top-0 bottom-0 z-20 w-16 md:w-24 flex items-center justify-end pr-4 bg-gradient-to-l from-black to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-black/80 rounded-full">
                <ChevronRight className="w-6 h-6 text-white" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Movies Container */}
        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-6 md:px-12 scroll-smooth pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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

// Movie Card Component
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
      className="relative flex-shrink-0 w-[180px] md:w-[220px] lg:w-[260px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/watch/${movie.id}`} className="block">
        {/* Main Card */}
        <motion.div
          className="relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.05, zIndex: 10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Thumbnail Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getPlaceholderGradient(movie.id)}`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-bold text-white/10">{movie.title[0]}</span>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {movie.isNew && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded">
                YENİ
              </span>
            )}
            {movie.isOriginal && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-600 text-white rounded">
                ORİJİNAL
              </span>
            )}
          </div>

          {/* Bottom Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />

          {/* Title on Card */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-sm font-medium text-white truncate">{movie.title}</h3>
          </div>

          {/* Hover Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Play Button */}
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-4">
                  <Play className="w-6 h-6 text-black fill-current ml-1" />
                </div>

                {/* Quick Info */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-300 mb-2">
                    <span className="text-green-400">★ {movie.rating}</span>
                    <span>{movie.year}</span>
                  </div>
                  <p className="text-xs text-gray-400">{movie.genre}</p>
                </div>

                {/* Watchlist Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleWatchlist();
                  }}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isInWatchlist
                      ? "bg-white text-black"
                      : "bg-black/60 text-white border border-white/30 hover:border-white"
                    }`}
                >
                  {isInWatchlist ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
    </motion.div>
  );
}
