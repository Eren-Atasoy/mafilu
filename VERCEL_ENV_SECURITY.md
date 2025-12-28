# Vercel Environment Variables Güvenlik Rehberi

## ⚠️ Vercel Uyarısı: "This key might expose sensitive information"

### Sorun Nedir?

Vercel, `NEXT_PUBLIC_` prefix'i ile başlayan ve `KEY` içeren environment variable'lar için uyarı verir çünkü:

1. **`NEXT_PUBLIC_` prefix'i:** Bu değişkenler **client-side'a expose edilir**
2. **Browser'da görülebilir:** Herkes browser console'da `process.env.NEXT_PUBLIC_*` değerlerini görebilir
3. **Güvenlik riski:** API key'ler, secret'lar client-side'da olmamalı

### ✅ Doğru Kullanım

#### Güvenli (Server-side only):
```env
# ✅ DOĞRU - Server-side'da kullanılır, browser'a expose edilmez
BUNNY_STREAM_API_KEY=your-api-key
BUNNY_STREAM_LIBRARY_ID=your-library-id
STRIPE_SECRET_KEY=sk_live_...
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Güvenli (Public, ama key değil):
```env
# ✅ DOĞRU - Public URL'ler, key değil
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_BUNNY_CDN_URL=vz-570775.b-cdn.net
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  # Publishable key zaten public olmalı
```

#### ❌ YANLIŞ (Güvenlik riski):
```env
# ❌ YANLIŞ - API key client-side'a expose edilir!
NEXT_PUBLIC_BUNNY_STREAM_API_KEY=your-api-key
NEXT_PUBLIC_STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 🔍 Mevcut Proje Kontrolü

### Doğru Yapılandırma:

```env
# ✅ Server-side only (güvenli)
BUNNY_STREAM_API_KEY=53022211-38c7-4a29-9a1a403f38e7-641a-4ebc
BUNNY_STREAM_LIBRARY_ID=570775
STRIPE_SECRET_KEY=sk_test_...
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ✅ Public (güvenli - key değil)
NEXT_PUBLIC_SUPABASE_URL=https://gmdswpelruzxevbtrhig.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...  # Anon key zaten public olmalı
NEXT_PUBLIC_BUNNY_CDN_URL=vz-570775.b-cdn.net
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Publishable key public
```

### Kodda Kullanım:

**Server-side (API routes):**
```typescript
// ✅ DOĞRU - Server-side'da kullanılır
const apiKey = process.env.BUNNY_STREAM_API_KEY;  // NEXT_PUBLIC_ yok
const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
```

**Client-side (browser):**
```typescript
// ✅ DOĞRU - Public URL'ler
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const cdnUrl = process.env.NEXT_PUBLIC_BUNNY_CDN_URL;
```

---

## 🛠️ Sorun Giderme

### Vercel'de Uyarı Alıyorsanız:

1. **Hangi değişken uyarı veriyor?**
   - Vercel Dashboard → Settings → Environment Variables
   - `NEXT_PUBLIC_` ile başlayan ve `KEY` içeren değişkeni bulun

2. **Kontrol edin:**
   - Eğer `NEXT_PUBLIC_BUNNY_STREAM_API_KEY` varsa → **SİLİN!**
   - Sadece `BUNNY_STREAM_API_KEY` olmalı (NEXT_PUBLIC_ olmadan)

3. **Düzeltme:**
   ```env
   # ❌ YANLIŞ (Vercel uyarı verir)
   NEXT_PUBLIC_BUNNY_STREAM_API_KEY=your-key
   
   # ✅ DOĞRU (Uyarı yok)
   BUNNY_STREAM_API_KEY=your-key
   ```

---

## 📋 Güvenlik Kontrol Listesi

### ✅ Güvenli Environment Variables:

| Değişken | Prefix | Güvenli mi? | Neden? |
|----------|--------|-------------|--------|
| `BUNNY_STREAM_API_KEY` | ❌ | ✅ | Server-side only |
| `BUNNY_STREAM_LIBRARY_ID` | ❌ | ✅ | Server-side only |
| `STRIPE_SECRET_KEY` | ❌ | ✅ | Server-side only |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ | ✅ | Server-side only |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | Public URL, key değil |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ | Anon key zaten public |
| `NEXT_PUBLIC_BUNNY_CDN_URL` | ✅ | ✅ | Public URL, key değil |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | ✅ | Publishable key public |

### ❌ Güvensiz (Yapmayın!):

| Değişken | Sorun |
|----------|-------|
| `NEXT_PUBLIC_BUNNY_STREAM_API_KEY` | API key browser'a expose edilir |
| `NEXT_PUBLIC_STRIPE_SECRET_KEY` | Secret key browser'a expose edilir |
| `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` | Service role key browser'a expose edilir |

---

## 🔐 Güvenlik Best Practices

### 1. API Keys ve Secrets
- ❌ **Asla** `NEXT_PUBLIC_` prefix'i kullanmayın
- ✅ Sadece server-side API route'larında kullanın
- ✅ Vercel'de "Production", "Preview", "Development" için ayrı ayrı ayarlayın

### 2. Public Keys
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Zaten public olmalı
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key public
- ✅ URL'ler (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_BUNNY_CDN_URL`)

### 3. Vercel Ayarları
- ✅ Environment variable'ları doğru environment'a ekleyin
- ✅ Production'da test key'leri kullanmayın
- ✅ Secret'ları Vercel Secrets Manager'da saklayın

---

## 🎯 Hızlı Çözüm

Eğer Vercel'de uyarı alıyorsanız:

1. **Vercel Dashboard → Settings → Environment Variables**
2. **`NEXT_PUBLIC_` ile başlayan ve `KEY` içeren değişkeni bulun**
3. **Eğer API key ise:**
   - ❌ `NEXT_PUBLIC_BUNNY_STREAM_API_KEY` → **SİLİN**
   - ✅ `BUNNY_STREAM_API_KEY` → **Ekleyin** (NEXT_PUBLIC_ olmadan)
4. **Redeploy yapın**

---

## 📝 Özet

**Sorun:** `NEXT_PUBLIC_` + `KEY` = Browser'a expose edilir = Güvenlik riski

**Çözüm:** 
- API keys → `NEXT_PUBLIC_` **OLMADAN** kullanın
- Public keys (publishable, anon) → `NEXT_PUBLIC_` ile kullanılabilir
- URL'ler → `NEXT_PUBLIC_` ile kullanılabilir

**Kural:** Eğer bir değer **secret** ise, `NEXT_PUBLIC_` kullanmayın!

