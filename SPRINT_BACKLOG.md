# Sprint Backlog - MAFILU Platform

**Son Güncelleme:** 2025-12-28  
**Durum:** Aktif Geliştirme  
**Test Success Rate:** 28.57% (4/14) → Hedef: %70+

> **Sprint Update:** Phase 1-4 tamamlandı (Security, Analytics, Components)

---

## 📊 Tamamlanan Sprintler

### ✅ PHASE 0: CRITICAL FIXES & REFACTORING (Tamamlandı)

- [x] Mock data replacement (Supabase entegrasyonu)
- [x] Design token standardization (CSS variables)
- [x] Server-side security (Middleware, Server Components)
- [x] SEO implementation (generateMetadata)
- [x] Image optimization (next/image)
- [x] Error boundaries ve loading states
- [x] Video upload route fix
- [x] Watch page 404 fix (approved olmayan filmler için mesaj)
- [x] Admin video preview
- [x] Direct upload implementation (Browser → Bunny.net)
- [x] Security improvements (input validation, ownership verification)
- [x] Environment variables cleanup (.env.local temizlendi)
- [x] TypeScript error fixes (comments-section)

### ✅ SPRINT 1: Enhanced Viewer Experience (Tamamlandı)

- [x] Continue Watching (playback position tracking)
- [x] Advanced Video Player (speed control, volume, fullscreen, keyboard shortcuts)
- [x] Comment System (database, API, UI, replies, edit/delete)
- [x] Rating System (1-5 stars, average calculation trigger)
- [x] Database migrations (movie_views, comments, ratings)
- [x] Watch page improvements (status messages, video player integration)

---

## 🚧 Devam Eden / Kalan İşler

### 🔴 YÜKSEK ÖNCELİK (P0) - Acil Düzeltilmeli

#### 1. Security Flaw - Unauthorized Access (TC012)
- **Durum:** ✅ TAMAMLANDI
- **Sorun:** Viewer kullanıcı Producer-only content'e erişebiliyor
- **Çözüm:** Middleware'e role kontrolü eklendi
- **Yapılanlar:**
  - [x] Producer routes'larında role middleware kontrolü
  - [x] Producer layout'ta backup role check
  - [x] Non-producer kullanıcılar homepage'e yönlendiriliyor

#### 2. Browse Filters Not Working (TC006)
- **Durum:** ✅ TAMAMLANDI
- **Sorun:** Genre filtresi çalışmıyor
- **Çözüm:** Case-insensitive karşılaştırma eklendi
- **Yapılanlar:**
  - [x] Filter logic case-insensitive yapıldı
  - [ ] Test verisi ile doğrulama (manuel)

#### 3. Payment Infrastructure
- **Durum:** Atlandı (şimdilik)
- **Sorun:** Stripe Price ID'leri placeholder (`price_xxx`)
- **Test:** TC009, TC014 başarısız
- **Not:** Ödeme altyapısı sonra hallederiz denmişti
- **Yapılacak:**
  - [ ] Stripe Dashboard'da gerçek Price ID'leri oluştur
  - [ ] `.env.local` ve Vercel'de Price ID'leri güncelle
  - [ ] Test checkout flow'u

#### 4. Video Upload Test Data
- **Durum:** Kısmen tamamlandı
- **Sorun:** Bunny.net'te test videoları var ama bazıları 0 Bytes
- **Yapılacak:**
  - [ ] Bunny.net dashboard'da error videoları temizle
  - [ ] Küçük test videosu (< 50MB) ile direct upload test et
  - [ ] Video processing durumunu kontrol et
  - [ ] Approved movies'e `bunny_video_id` ekle

#### 5. Mobile Navigation Bug (TC011)
- **Durum:** Orta öncelik
- **Sorun:** Logo tıklama sorunu (test'te hata)
- **Dosya:** `src/components/layout/navbar.tsx`
- **Not:** Kod doğru görünüyor, tekrar test edilmeli
- **Yapılacak:**
  - [ ] Mobile'da logo link'ini test et
  - [ ] Homepage content disappearing sorununu kontrol et

---

### 🟡 ORTA ÖNCELİK (P1)

#### 6. Producer Studio & Analytics (SPRINT 2 - Kısmen Tamamlandı)

**Upload Workflow:**
- [x] Video upload (direct upload implementasyonu)
- [ ] Series/Episodes desteği
- [ ] Draft saving (otomatik kaydetme)
- [ ] Custom Thumbnail/Trailer uploads

**Analytics Dashboard:**
- [x] Real-time views tracking ✅ (analytics-service.ts)
- [ ] Geographic data (hangi ülkelerden izleniyor)
- [ ] Engagement metrics (average watch time)
- [x] View charts (interactive charts) ✅ (views-chart.tsx)

**Revenue:**
- [x] Earnings sayfası gerçek veri gösteriyor ✅
- [x] Balance tracking (estimated) ✅
- [ ] Automated payout calculations (Stripe Connect)

#### 7. Admin Panel İyileştirmeleri

- [x] Video preview (admin review sayfasında)
- [x] Approve/Reject butonları
- [ ] Bulk operations (toplu onaylama/reddetme)
- [ ] Advanced filtering (tarih, producer, genre)
- [ ] Export functionality (CSV export)

#### 8. Rating Calculation (TODO)
- **Durum:** Hardcoded "8.5" rating
- **Dosya:** `src/lib/supabase/queries.ts` (line 108, 151)
- **Yapılacak:**
  - [ ] Gerçek rating hesaplama (movie_ratings tablosundan)
  - [ ] Average rating kullan
  - [ ] Rating count göster

- [x] Genre filter (UI var)
- [ ] Filter sonuçlarının düzgün çalışması (TC006)
- [ ] Year filter
- [ ] Sort options (popularity, date, rating)
- [ ] Real-time search improvements

---

### 🟢 DÜŞÜK ÖNCELİK (P2)

#### 7. Technical DevOps & Globalization (SPRINT 3)

**PWA & Mobile:**
- [ ] `next-pwa` configuration
- [ ] "Add to Home Screen" experience
- [ ] Offline support (cached content)
- [ ] Service worker setup

**Internationalization (i18n):**
- [ ] `next-intl` setup
- [ ] TR ve EN language support
- [ ] Translation files (hardcoded strings'leri çevir)
- [ ] Language switcher UI

**Testing:**
- [ ] Playwright E2E test suite
- [ ] Test flows: Login → Upload → Watch
- [ ] CI/CD integration

#### 8. Performance Optimizations

- [ ] Image lazy loading improvements
- [ ] Video thumbnail optimization
- [ ] Database query optimization
- [ ] Caching strategy (Redis integration)
- [ ] Lighthouse score > 90

#### 9. SEO Enhancements

- [ ] Dynamic `sitemap.xml` generation
- [ ] Structured Data (Schema.org) for movies
- [ ] Open Graph tags improvements
- [ ] Meta descriptions optimization

#### 10. Security Enhancements

- [x] Input validation
- [x] Ownership verification
- [ ] Rate limiting (kullanıcı başına günlük upload limiti)
- [ ] IP restriction (opsiyonel)
- [ ] File content validation (gerçekten video mu?)

---

## 📋 Feature Backlog

### Viewer Experience

- [ ] "Follow Producer" functionality
- [ ] Interactive notifications
- [ ] Advanced Watch history (detailed analytics)
- [ ] Social sharing improvements
- [ ] Watch party feature (future)

### Producer Features

- [ ] Series/Episodes management
- [ ] Custom thumbnail upload
- [ ] Trailer upload
- [ ] Producer profile customization
- [ ] Producer verification badge
- [ ] Producer analytics export (PDF/CSV)

### Admin Features

- [ ] User management (ban/suspend)
- [ ] Platform-wide analytics
- [ ] Payout management dashboard
- [ ] System configuration panel
- [ ] Content moderation tools (advanced)

### Monetization

- [ ] Automated payout calculations
- [ ] Producer Pro Tier features
- [ ] Gift Subscriptions
- [ ] Revenue share calculations
- [ ] Stripe Connect integration (producer payouts)

### Technical

- [ ] Redis cache implementation
- [ ] Edge Functions (Supabase)
- [ ] Webhook handling improvements
- [ ] Error tracking (Sentry integration)
- [ ] Analytics (Plausible/Google Analytics)

---

## 🐛 Bilinen Sorunlar

### Kritik

1. **Bunny.net Upload:** Bazı videolar 0 Bytes gösteriyor
   - **Durum:** Direct upload implementasyonu yapıldı, test edilmeli
   - **Çözüm:** Küçük test videosu ile test et

2. **Stripe Payment:** Price ID'leri placeholder
   - **Durum:** Atlandı (şimdilik)
   - **Çözüm:** Stripe Dashboard'da Price ID'leri oluştur

### Orta

3. **Browse Filters:** Filter sonuçları düzgün çalışmıyor (TC006)
   - **Durum:** UI var ama test'te hata
   - **Çözüm:** Filter logic'i kontrol et

4. **Mobile Navigation:** Logo tıklama sorunu (TC011)
   - **Durum:** Kod doğru görünüyor, tekrar test edilmeli

### Düşük

5. **Admin Panel Buttons:** TestSprite'da missing gösteriyor
   - **Durum:** Kod'da var, test sorunu olabilir

---

## 🎯 Önümüzdeki Sprint Hedefleri

### Sprint 3: Producer Studio & Analytics (2 Hafta)

**Hedefler:**
1. Analytics Dashboard (real-time views, charts)
2. Payout History & Balance tracking
3. Series/Episodes support
4. Custom thumbnail upload

**Kabul Kriterleri:**
- Producer dashboard'da gerçek analytics görünüyor
- Payout history sayfası çalışıyor
- Thumbnail upload çalışıyor

### Sprint 4: Technical DevOps & Globalization (2 Hafta)

**Hedefler:**
1. PWA setup (Add to Home Screen)
2. i18n implementation (TR/EN)
3. Playwright E2E tests
4. Performance optimizations

**Kabul Kriterleri:**
- PWA installable
- Language switcher çalışıyor
- E2E test suite çalışıyor
- Lighthouse score > 90

---

## 📊 İlerleme Durumu

### Tamamlanan
- ✅ Phase 0: Critical Fixes
- ✅ Sprint 1: Enhanced Viewer Experience
- ✅ Direct Upload Implementation
- ✅ Security Improvements

### Devam Eden
- 🔄 Sprint 2: Producer Studio (kısmen)
- 🔄 Payment Infrastructure (atlandı)

### Bekleyen
- ⏳ Sprint 3: Technical DevOps
- ⏳ Sprint 4: Globalization

---

## 🔗 İlgili Dokümantasyon

- `PRODUCT_SPEC.md` - Product specification
- `COMPLETED_TASKS.md` - Tamamlanan görevler
- `SECURITY_ANALYSIS.md` - Güvenlik analizi
- `DIRECT_UPLOAD_IMPLEMENTATION.md` - Direct upload detayları
- `VERCEL_ENV_SETUP.md` - Vercel environment setup

---

**Not:** Bu dokümantasyon düzenli olarak güncellenmelidir. Her sprint sonunda güncelle.

