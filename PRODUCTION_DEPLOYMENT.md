# Production Deployment Rehberi

## 🚀 Production Ortamı için Environment Variables

### Supabase Dashboard'da Ayarlanması Gerekenler

**Hayır, Supabase Dashboard'da Bunny.net için environment variable ayarlamaya gerek yok!**

Ancak Supabase Dashboard'da kontrol etmeniz gerekenler:

#### 1. Supabase Project Settings

- **Project URL:** `https://gmdswpelruzxevbtrhig.supabase.co` ✅
- **API Keys:** Anon key ve Service Role key'lerin aktif olduğundan emin olun
- **Database:** RLS (Row Level Security) politikalarının aktif olduğundan emin olun

#### 2. Supabase Auth Settings

- **Site URL:** Production domain'inizi ekleyin (örn: `https://mafilu.com`)
- **Redirect URLs:** Production domain'inizi ekleyin
- **Email Templates:** Production için özelleştirilebilir

#### 3. Supabase Edge Functions (Eğer kullanıyorsanız)

- Edge Functions için environment variable'lar Supabase Dashboard'da ayarlanır
- Ama şu an projede Edge Function kullanılmıyor

---

### Production Platform'da Ayarlanması Gerekenler

Hangi platform'da deploy ediyorsunuz?

#### Vercel (Önerilen - Next.js için)

1. **Vercel Dashboard'a gidin:** https://vercel.com/dashboard
2. **Projenizi seçin**
3. **Settings → Environment Variables** sekmesine gidin
4. **Şu değişkenleri ekleyin:**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://gmdswpelruzxevbtrhig.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Bunny.net
BUNNY_STREAM_API_KEY=53022211-38c7-4a29-9a1a403f38e7-641a-4ebc
BUNNY_STREAM_LIBRARY_ID=570775
NEXT_PUBLIC_BUNNY_CDN_URL=vz-570775.b-cdn.net

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PREMIUM=price_...
STRIPE_PRICE_PRODUCER_PRO=price_...
```

**Önemli:** Her environment için (Production, Preview, Development) ayrı ayrı ekleyin!

#### Netlify

1. **Netlify Dashboard'a gidin:** https://app.netlify.com
2. **Site settings → Environment variables**
3. Yukarıdaki değişkenleri ekleyin

#### Docker / Self-hosted

1. `.env.production` dosyası oluşturun
2. Veya Docker Compose'da environment variable'ları tanımlayın
3. Production secrets'ları güvenli bir şekilde saklayın (HashiCorp Vault, AWS Secrets Manager, vb.)

---

### Production için Özel Ayarlar

#### 1. Bunny.net Production API Key

**Önemli:** Production'da **farklı bir API key** kullanın!

1. Bunny.net Dashboard'a gidin
2. **Stream → Libraries → Your Library → API**
3. Yeni bir API key oluşturun (sadece production için)
4. Test key'ini production'da kullanmayın!

#### 2. Stripe Production Keys

**Önemli:** Production'da **live keys** kullanın!

1. Stripe Dashboard → **Developers → API keys**
2. **Live mode**'a geçin
3. Live publishable key ve secret key'i kopyalayın
4. Production environment variable'larına ekleyin

#### 3. Supabase Production Settings

1. **Auth → URL Configuration:**

   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/**`

2. **Database → Connection Pooling:**

   - Production için connection pooling aktif edin

3. **Storage (Eğer kullanıyorsanız):**
   - Bucket policies'leri kontrol edin
   - CORS ayarlarını yapın

---

### Güvenlik Kontrol Listesi

- [ ] Production API key'leri test key'lerinden farklı
- [ ] Service Role Key sadece server-side kullanılıyor
- [ ] Anon Key public olabilir (RLS ile korumalı)
- [ ] Stripe webhook secret production'da doğru
- [ ] Environment variable'lar production platform'da ayarlı
- [ ] Supabase Auth redirect URL'leri production domain'i içeriyor
- [ ] CORS ayarları production domain'i içeriyor

---

### Deployment Sonrası Kontroller

1. **Health Check:**

   ```bash
   curl https://yourdomain.com/api/health
   ```

2. **Supabase Bağlantısı:**

   - Login/Register çalışıyor mu?
   - Database sorguları çalışıyor mu?

3. **Bunny.net Bağlantısı:**

   - Video yükleme çalışıyor mu?
   - Video oynatma çalışıyor mu?

4. **Stripe Bağlantısı:**
   - Checkout sayfası açılıyor mu?
   - Webhook'lar çalışıyor mu?

---

### Sorun Giderme

#### "Video service not configured" Production'da

1. Vercel/Netlify dashboard'da environment variable'ları kontrol edin
2. Değişken isimlerinin doğru olduğundan emin olun
3. Production environment'ı seçtiğinizden emin olun
4. Redeploy yapın

#### Supabase bağlantı hatası Production'da

1. Supabase Dashboard → Settings → API
2. Anon key'in doğru olduğundan emin olun
3. Site URL'in production domain'i içerdiğinden emin olun
4. CORS ayarlarını kontrol edin

---

## 📝 Özet

**Supabase Dashboard'da:**

- ❌ Bunny.net için environment variable ayarlamaya gerek yok
- ✅ Auth URL configuration'ı production domain için ayarlayın
- ✅ API keys'lerin aktif olduğundan emin olun

**Production Platform'da (Vercel/Netlify):**

- ✅ Tüm environment variable'ları ekleyin
- ✅ Production API keys kullanın (test keys değil)
- ✅ Her environment için ayrı ayrı ayarlayın

**Güvenlik:**

- ✅ Production ve test key'lerini ayırın
- ✅ Service Role Key'i güvenli tutun
- ✅ Webhook secret'ları doğru ayarlayın
