"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Play,
  Info,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock Data - Featured Movies for Hero
const heroMovies = [
  {
    id: "hero-1",
    title: "Kayıp Şehir",
    description: "Antik bir haritanın peşinde düşen arkeolog, beklenmedik bir maceranın içine sürüklenir. Gizemli bir şehrin sırları, onu geçmişiyle yüzleşmeye zorlar.",
    genre: "Macera",
    year: 2024,
    rating: "8.4",
    duration: "2s 15dk",
    backdrop: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    tags: ["Aksiyon", "Gizem", "Macera"],
  },
  {
    id: "hero-2",
    title: "Son Gece",
    description: "İstanbul'un karanlık sokaklarında geçen bu gerilim filmi, bir dedektifin son davasını konu alıyor. Her ipucu onu daha derin bir komploya sürükler.",
    genre: "Gerilim",
    year: 2024,
    rating: "9.1",
    duration: "1s 58dk",
    backdrop: "linear-gradient(135deg, #2d132c 0%, #801336 50%, #c72c41 100%)",
    tags: ["Gerilim", "Suç", "Drama"],
  },
  {
    id: "hero-3",
    title: "Mavi Rüya",
    description: "Genç bir ressamın hayalleri ile gerçeklik arasındaki yolculuğu. Sanat, aşk ve kayıp üzerine derin bir meditasyon.",
    genre: "Drama",
    year: 2023,
    rating: "8.7",
    duration: "2s 05dk",
    backdrop: "linear-gradient(135deg, #0c0c0c 0%, #1a0a2e 50%, #2d1b4e 100%)",
    tags: ["Drama", "Romantik", "Sanat"],
  },
];

// Mock Data - Movie Categories
const movieCategories = [
  {
    title: "Sizin İçin Seçtiklerimiz",
    movies: [
      { id: "m1", title: "Sessiz Çığlık", genre: "Korku", year: 2024, rating: "7.8" },
      { id: "m2", title: "Aşkın Matematiği", genre: "Romantik", year: 2023, rating: "8.2" },
      { id: "m3", title: "Kod Adı: Zaman", genre: "Bilim Kurgu", year: 2024, rating: "8.5" },
      { id: "m4", title: "Dağların Ardında", genre: "Dram", year: 2023, rating: "9.0" },
      { id: "m5", title: "Son Tren", genre: "Gerilim", year: 2024, rating: "7.9" },
      { id: "m6", title: "Yıldız Tozu", genre: "Fantastik", year: 2024, rating: "8.1" },
    ],
  },
  {
    title: "Bu Hafta Popüler",
    movies: [
      { id: "m7", title: "Karanlık Sular", genre: "Aksiyon", year: 2024, rating: "8.3" },
      { id: "m8", title: "Bir Başka Gün", genre: "Komedi", year: 2024, rating: "7.6" },
      { id: "m9", title: "Labirent", genre: "Gizem", year: 2023, rating: "8.8" },
      { id: "m10", title: "Sahne Işıkları", genre: "Müzikal", year: 2024, rating: "8.4" },
      { id: "m11", title: "Gölgeler", genre: "Korku", year: 2024, rating: "7.5" },
      { id: "m12", title: "Umut Yolu", genre: "Dram", year: 2023, rating: "9.2" },
    ],
  },
  {
    title: "Yeni Eklenenler",
    movies: [
      { id: "m13", title: "Fırtına Öncesi", genre: "Aksiyon", year: 2024, rating: "8.0" },
      { id: "m14", title: "Kara Kutu", genre: "Gerilim", year: 2024, rating: "8.6" },
      { id: "m15", title: "Ayna", genre: "Psikolojik", year: 2024, rating: "8.9" },
      { id: "m16", title: "İlk Adım", genre: "Belgesel", year: 2024, rating: "9.1" },
      { id: "m17", title: "Renkler", genre: "Deneysel", year: 2024, rating: "7.7" },
      { id: "m18", title: "Sonsuzluk", genre: "Bilim Kurgu", year: 2024, rating: "8.2" },
    ],
  },
  {
    title: "Ödüllü Yapımlar",
    movies: [
      { id: "m19", title: "Bağımsız Ruhlar", genre: "Dram", year: 2023, rating: "9.4" },
      { id: "m20", title: "Kış Masalı", genre: "Romantik", year: 2022, rating: "8.8" },
      { id: "m21", title: "Denizin Sesi", genre: "Belgesel", year: 2023, rating: "9.0" },
      { id: "m22", title: "Kadim Şehir", genre: "Tarih", year: 2023, rating: "8.7" },
      { id: "m23", title: "Yalnız Kurt", genre: "Western", year: 2022, rating: "8.5" },
      { id: "m24", title: "Son Vals", genre: "Müzikal", year: 2023, rating: "9.3" },
    ],
  },
  {
    title: "Türk Yapımları",
    movies: [
      { id: "m25", title: "Anadolu Hikayesi", genre: "Dram", year: 2024, rating: "8.9" },
      { id: "m26", title: "İstanbul Gece", genre: "Suç", year: 2024, rating: "8.4" },
      { id: "m27", title: "Boğaz'da Aşk", genre: "Romantik", year: 2024, rating: "7.8" },
      { id: "m28", title: "Yeşil Vadi", genre: "Doğa", year: 2023, rating: "8.6" },
      { id: "m29", title: "Cumhuriyet", genre: "Tarih", year: 2023, rating: "9.2" },
      { id: "m30", title: "Sokak Kedisi", genre: "Animasyon", year: 2024, rating: "8.1" },
    ],
  },
];

// Generate placeholder colors for thumbnails
const getPlaceholderColor = (id: string) => {
  const colors = [
    "from-purple-900 to-indigo-900",
    "from-rose-900 to-pink-900",
    "from-blue-900 to-cyan-900",
    "from-emerald-900 to-teal-900",
    "from-orange-900 to-amber-900",
    "from-violet-900 to-purple-900",
  ];
  const index = parseInt(id.replace(/\D/g, "")) % colors.length;
  return colors[index];
};

export default function HomePage() {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());

  // Auto-rotate hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="min-h-screen bg-[#0A0510]">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        {/* Background */}
        <motion.div
          key={currentHero.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ background: currentHero.backdrop }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0510] via-[#0A0510]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0510] via-transparent to-transparent" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center pt-16">
          <motion.div
            key={currentHero.id + "-content"}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            {/* Tags */}
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#7C3AED] rounded text-xs font-semibold text-white">
                ÖNE ÇIKAN
              </span>
              <span className="text-[#A197B0] text-sm">{currentHero.genre}</span>
              <span className="text-[#6B5F7C]">•</span>
              <span className="text-[#A197B0] text-sm">{currentHero.year}</span>
              <span className="text-[#6B5F7C]">•</span>
              <span className="text-[#A197B0] text-sm">{currentHero.duration}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 headline-serif">
              {currentHero.title}
            </h1>

            {/* Rating & Tags */}
            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center gap-1 text-green-400 font-semibold">
                ★ {currentHero.rating}
              </span>
              <div className="flex gap-2">
                {currentHero.tags.map((tag) => (
                  <span key={tag} className="text-xs text-[#A197B0] border border-[#6B5F7C]/30 rounded px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-[#A197B0] mb-8 leading-relaxed">
              {currentHero.description}
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <Link href={`/watch/${currentHero.id}`}>
                <Button size="lg" className="bg-white text-black hover:bg-white/90 font-semibold px-8">
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Oynat
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Info className="w-5 h-5 mr-2" />
                Daha Fazla Bilgi
              </Button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Hero Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {heroMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroIndex(index)}
              className={`h-1 rounded-full transition-all duration-300 ${index === currentHeroIndex
                  ? "w-8 bg-white"
                  : "w-4 bg-white/30 hover:bg-white/50"
                }`}
            />
          ))}
        </div>
      </section>

      {/* Movie Categories */}
      <main className="relative z-10 -mt-32 pb-20">
        {movieCategories.map((category, categoryIndex) => (
          <MovieRow
            key={category.title}
            title={category.title}
            movies={category.movies}
            delay={categoryIndex * 0.1}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
          />
        ))}
      </main>
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
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="max-w-[1800px] mx-auto px-6">
        <h2 className="text-xl font-semibold text-[#F5F3FF] mb-4">{title}</h2>
      </div>

      <div className="relative group">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-[#0A0510] to-transparent flex items-center justify-start pl-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-[#0A0510] to-transparent flex items-center justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        )}

        {/* Movies Container */}
        <div
          ref={rowRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-6 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
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
  isInWatchlist: boolean;
  onToggleWatchlist: () => void;
}

function MovieCard({ movie, isInWatchlist, onToggleWatchlist }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative flex-shrink-0 w-[200px] md:w-[240px] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/watch/${movie.id}`}>
        {/* Thumbnail */}
        <div className={`aspect-[16/9] rounded-md overflow-hidden bg-gradient-to-br ${getPlaceholderColor(movie.id)}`}>
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white/20">{movie.title[0]}</span>
          </div>
        </div>
      </Link>

      {/* Hover Card */}
      {isHovered && (
        <motion.div
          className="absolute top-0 left-0 right-0 bg-[#181818] rounded-md shadow-2xl overflow-hidden z-20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Thumbnail */}
          <Link href={`/watch/${movie.id}`}>
            <div className={`aspect-[16/9] bg-gradient-to-br ${getPlaceholderColor(movie.id)} relative`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <Play className="w-6 h-6 text-black fill-current ml-1" />
                </div>
              </div>
            </div>
          </Link>

          {/* Info */}
          <div className="p-3">
            {/* Actions */}
            <div className="flex items-center gap-2 mb-2">
              <Link href={`/watch/${movie.id}`}>
                <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-white/90">
                  <Play className="w-4 h-4 text-black fill-current ml-0.5" />
                </button>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onToggleWatchlist();
                }}
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-colors ${isInWatchlist
                    ? "border-white bg-white/20"
                    : "border-white/50 hover:border-white"
                  }`}
              >
                {isInWatchlist ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <Plus className="w-4 h-4 text-white" />
                )}
              </button>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-2 text-xs mb-1">
              <span className="text-green-400 font-semibold">★ {movie.rating}</span>
              <span className="text-[#A197B0]">{movie.year}</span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-medium text-white truncate">{movie.title}</h3>

            {/* Genre */}
            <p className="text-xs text-[#6B5F7C]">{movie.genre}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
