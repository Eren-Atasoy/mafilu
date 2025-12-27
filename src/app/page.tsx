import Link from "next/link";
import { getFeaturedMovies, getMovieCategories } from "@/lib/supabase/queries";
import { HomeClient } from "@/components/home/home-client";

export default async function HomePage() {
  // Fetch real data from Supabase
  const [heroMovies, categories] = await Promise.all([
    getFeaturedMovies(),
    getMovieCategories(),
  ]);

  return (
    <>
      <HomeClient heroMovies={heroMovies} categories={categories} />

      {/* ================================================
          FOOTER
          ================================================ */}
      <footer className="border-t border-[var(--border-subtle)] py-16 bg-[var(--mf-black)]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          {/* Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <span className="headline-serif text-3xl font-light text-[var(--mf-text-high)] tracking-tight">
                mafilu
              </span>
              <p className="text-[var(--mf-text-medium)] text-sm mt-3 max-w-xs">
                Bağımsız sinema dünyasına açılan kapınız. Yapımcılar için fırsat, izleyiciler için keşif.
              </p>
            </div>

            {/* İzleyiciler */}
            <div>
              <h4 className="text-[var(--mf-text-high)] font-medium text-sm mb-4 tracking-wide uppercase">İzleyiciler</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/browse" className="text-[var(--mf-text-medium)] hover:text-[var(--mf-text-high)] transition-colors">Filmleri Keşfet</Link></li>
                <li><Link href="/subscription" className="text-[var(--mf-text-medium)] hover:text-[var(--mf-text-high)] transition-colors">Premium Üyelik</Link></li>
                <li><Link href="/watchlist" className="text-[var(--mf-text-medium)] hover:text-[var(--mf-text-high)] transition-colors">İzleme Listem</Link></li>
              </ul>
            </div>

            {/* Yapımcılar */}
            <div>
              <h4 className="text-[var(--mf-text-high)] font-medium text-sm mb-4 tracking-wide uppercase">Yapımcılar</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-[var(--mf-primary-glow)] hover:text-[var(--mf-primary)] transition-colors font-medium"
                  >
                    <span>🎬</span> Yapımcı Ol
                  </Link>
                </li>
                <li><Link href="/dashboard" className="text-[var(--mf-text-medium)] hover:text-[var(--mf-text-high)] transition-colors">Yapımcı Paneli</Link></li>
                <li><Link href="/dashboard/movies/upload" className="text-[var(--mf-text-medium)] hover:text-[var(--mf-text-high)] transition-colors">Film Yükle</Link></li>
              </ul>
            </div>

            {/* Kurumsal */}
            <div>
              <h4 className="text-[var(--mf-text-high)] font-medium text-sm mb-4 tracking-wide uppercase">Kurumsal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="text-[var(--mf-text-medium)] hover:text-[var(--mf-text-high)] transition-colors">Hakkımızda</Link></li>
                <li><Link href="/privacy" className="text-[var(--mf-text-medium)] hover:text-[var(--mf-text-high)] transition-colors">Gizlilik</Link></li>
                <li><Link href="/terms" className="text-[var(--mf-text-medium)] hover:text-[var(--mf-text-high)] transition-colors">Kullanım Koşulları</Link></li>
                <li><Link href="/contact" className="text-[var(--mf-text-medium)] hover:text-[var(--mf-text-high)] transition-colors">İletişim</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="border-t border-[var(--border-subtle)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[var(--mf-text-low)] text-sm">© 2024 Mafilu. Tüm hakları saklıdır.</p>
            <div className="flex items-center gap-6 text-xs text-[var(--mf-text-low)]">
              <span>Bağımsız Sinema Platformu</span>
              <span>•</span>
              <span>Türkiye</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
