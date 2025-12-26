"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film,
  Play,
  Upload,
  Star,
  TrendingUp,
  Users,
  ArrowRight,
  Sparkles,
  Menu,
  X
} from "lucide-react";

// Spring animation config
const springConfig = { stiffness: 100, damping: 20 };

// Cinematic fade variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 50);
      setIsNavHidden(currentScrollY > lastScrollY && currentScrollY > 200);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen bg-obsidian relative overflow-hidden">
      {/* Pulsar Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)"
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)"
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.4, 0.6]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 60%)"
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Floating Navigation */}
      <motion.nav
        className={`nav-floating ${isScrolled ? 'scrolled' : ''} ${isNavHidden ? 'hidden' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", ...springConfig }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <Film className="w-9 h-9 text-[#7C3AED]" />
              </motion.div>
              <span className="text-2xl font-semibold headline-serif text-gradient">
                Mafilu
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-10">
              {["Keşfet", "Fiyatlar", "Yapımcılar"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-[#A197B0] hover:text-white transition-colors duration-500 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-[#7C3AED] to-[#A855F7] group-hover:w-full transition-all duration-500" />
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/login">
                <motion.button
                  className="btn-ghost"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", ...springConfig }}
                >
                  Giriş Yap
                </motion.button>
              </Link>
              <Link href="/signup">
                <motion.button
                  className="btn-primary-ghost"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", ...springConfig }}
                >
                  <span>Başla</span>
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 text-[#A197B0]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-3/4 max-w-sm bg-[#1A0B2E] p-8 space-y-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", ...springConfig }}
            >
              <div className="flex justify-end">
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-[#A197B0]">
                  <X />
                </button>
              </div>
              <nav className="space-y-4">
                {["Keşfet", "Fiyatlar", "Yapımcılar", "Giriş Yap", "Kayıt Ol"].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="block py-3 text-lg text-[#A197B0] hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-40">
        <motion.div
          className="grid lg:grid-cols-2 gap-16 items-center"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Left Content - Asymmetrical Layout */}
          <div className="lg:pl-8 space-y-10">
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass gradient-border"
              variants={fadeInUp}
              transition={{ type: "spring", ...springConfig }}
            >
              <Sparkles className="w-4 h-4 text-[#A855F7]" />
              <span className="text-sm text-[#A855F7] font-medium">Bağımsız sinema için yeni ev</span>
            </motion.div>

            <motion.h1
              className="text-5xl lg:text-7xl font-bold leading-[1.1] headline-serif"
              variants={fadeInUp}
              transition={{ type: "spring", ...springConfig, delay: 0.1 }}
            >
              <span className="text-[#F5F3FF]">Bağımsız Sinemanın</span>
              <br />
              <span className="text-gradient">Yeni Sahnesi</span>
            </motion.h1>

            <motion.p
              className="text-xl text-[#A197B0] max-w-lg leading-relaxed"
              variants={fadeInUp}
              transition={{ type: "spring", ...springConfig, delay: 0.2 }}
            >
              Mafilu, bağımsız sinemacılar için tasarlanmış küratörlü bir streaming platformudur.
              Filmlerinizi dünyayla paylaşın, izleyicilerle buluşun.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-5"
              variants={fadeInUp}
              transition={{ type: "spring", ...springConfig, delay: 0.3 }}
            >
              <Link href="/browse">
                <motion.button
                  className="btn-primary-ghost flex items-center gap-3"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", ...springConfig }}
                >
                  <span className="flex items-center gap-3">
                    <Play className="w-5 h-5" />
                    İzlemeye Başla
                  </span>
                </motion.button>
              </Link>
              <Link href="/signup?role=producer">
                <motion.button
                  className="btn-ghost flex items-center gap-3"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", ...springConfig }}
                >
                  <Upload className="w-5 h-5" />
                  Film Yükle
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-12 pt-6"
              variants={fadeInUp}
              transition={{ type: "spring", ...springConfig, delay: 0.4 }}
            >
              {[
                { value: "500+", label: "Bağımsız Film" },
                { value: "10K+", label: "Aktif İzleyici" },
                { value: "50+", label: "Ülke" }
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl font-bold text-[#F5F3FF] headline-serif">{stat.value}</p>
                  <p className="text-sm text-[#6B5F7C] mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Hero Visual */}
          <motion.div
            className="relative lg:-mr-20"
            variants={fadeInUp}
            transition={{ type: "spring", ...springConfig, delay: 0.2 }}
          >
            {/* Main Hero Card with Ken Burns */}
            <motion.div
              className="relative aspect-[16/10] rounded-3xl overflow-hidden glass-card"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", ...springConfig }}
            >
              {/* Ken Burns Background */}
              <div className="absolute inset-0 ken-burns">
                <div
                  className="w-full h-full"
                  style={{
                    background: "linear-gradient(135deg, #2B0F3F 0%, #1A0B2E 50%, #150A24 100%)"
                  }}
                />
              </div>

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-24 h-24 rounded-full glass flex items-center justify-center cursor-pointer group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", ...springConfig }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)"
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <Play className="w-10 h-10 text-white ml-1 relative z-10" />
                </motion.div>
              </div>

              {/* Film Strip */}
              <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 h-14 rounded-xl bg-[#1A0B2E]/60 backdrop-blur-sm border border-[#7C3AED]/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Floating Card - Rating */}
            <motion.div
              className="absolute -left-8 top-1/4 p-5 rounded-2xl glass-card"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, type: "spring", ...springConfig }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white headline-serif">4.9</p>
                  <p className="text-xs text-[#6B5F7C]">Kullanıcı Puanı</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Card - Trending */}
            <motion.div
              className="absolute -right-4 bottom-1/4 p-5 rounded-2xl glass-card"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, type: "spring", ...springConfig }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white headline-serif">+127%</p>
                  <p className="text-xs text-[#6B5F7C]">Bu Ay İzlenme</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 border-t border-[#7C3AED]/10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", ...springConfig }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-[#F5F3FF] mb-6 headline-serif">
              Neden <span className="text-gradient">Mafilu</span>?
            </h2>
            <p className="text-xl text-[#A197B0] max-w-2xl mx-auto">
              Bağımsız sinemacılar için tasarlanmış, profesyonel bir platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Film,
                title: "Küratörlü İçerik",
                description: "Her film uzman ekibimiz tarafından incelenir. Kalite ve özgünlük bizim için öncelik.",
                gradient: "from-[#7C3AED] to-[#A855F7]",
              },
              {
                icon: TrendingUp,
                title: "Adil Gelir Paylaşımı",
                description: "Yapımcılara %70 gelir payı. Şeffaf raporlama ve aylık ödemeler.",
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                icon: Users,
                title: "Global Erişim",
                description: "190+ ülkede izleyicilere ulaşın. CDN altyapısıyla kesintisiz yayın.",
                gradient: "from-orange-500 to-rose-500",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="glass-card p-8 group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", ...springConfig }}
              >
                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-8`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", ...springConfig }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-[#F5F3FF] mb-4 headline-serif">{feature.title}</h3>
                <p className="text-[#A197B0] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            className="glass-card p-16 pulsar-glow"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", ...springConfig }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-[#F5F3FF] mb-6 headline-serif">
              Hikayenizi Anlatmaya <span className="text-gradient">Hazır mısınız?</span>
            </h2>
            <p className="text-xl text-[#A197B0] mb-10 max-w-xl mx-auto">
              Bugün Mafilu&apos;ya katılın ve filminizi dünya ile paylaşın.
              İlk filminizi yüklemek tamamen ücretsiz.
            </p>
            <Link href="/signup">
              <motion.button
                className="btn-primary-ghost text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", ...springConfig }}
              >
                <span className="flex items-center gap-3">
                  Hemen Başla
                  <ArrowRight className="w-5 h-5" />
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#7C3AED]/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Film className="w-7 h-7 text-[#7C3AED]" />
              <span className="font-semibold text-[#F5F3FF] headline-serif text-lg">Mafilu</span>
            </div>
            <p className="text-sm text-[#6B5F7C]">
              © 2024 Mafilu. Bağımsız sinemacılar için yapıldı.
            </p>
            <div className="flex gap-8">
              {["Gizlilik", "Şartlar", "İletişim"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-sm text-[#6B5F7C] hover:text-[#A855F7] transition-colors duration-500"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
