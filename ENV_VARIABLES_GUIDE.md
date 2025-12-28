# Environment Variables Rehberi

## 📋 Hangi Environment Variable'lar Nerede Kullanılıyor?

### Next.js Uygulaması (.env.local)

Bu değişkenler **Next.js uygulamanızda** kullanılır ve `.env.local` dosyasında olmalı:

#### Supabase (Veritabanı)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server-side işlemler için
```

**Kullanım Yerleri:**
- `src/lib/supabase/client.ts` - Client-side Supabase client
- `src/lib/supabase/server.ts` - Server-side Supabase client
- `src/lib/supabase/middleware.ts` - Auth middleware

#### Bunny.net (Video Platform)
```env
BUNNY_STREAM_API_KEY=your-api-key
BUNNY_STREAM_LIBRARY_ID=your-library-id
NEXT_PUBLIC_BUNNY_CDN_URL=vz-{library-id}.b-cdn.net
```

**Kullanım Yerleri:**
- `src/lib/bunny/stream.ts` - Bunny.net Stream API servisi
- `src/app/api/videos/upload/route.ts` - Video yükleme endpoint'i

**Önemli:** Bunny.net credentials'ları **Supabase'de değil**, Next.js uygulamanızda kullanılır!

#### Stripe (Ödeme)
```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PREMIUM=price_...
STRIPE_PRICE_PRODUCER_PRO=price_...
```

**Kullanım Yerleri:**
- `src/app/api/checkout/route.ts` - Ödeme işlemleri

---

### Supabase MCP (Cursor AI için)

MCP (Model Context Protocol) için **Cursor'da** veya **sistem environment variable'larında** ayarlanmalı:

#### Cursor MCP Yapılandırması

**Windows:** `%APPDATA%\Cursor\mcp.json`
**macOS/Linux:** `~/.cursor/mcp.json`

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase"],
      "env": {
        "SUPABASE_URL": "https://your-project.supabase.co",
        "SUPABASE_ACCESS_TOKEN": "your-service-role-key"
      }
    }
  }
}
```

**Veya sistem environment variable'ları:**
```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ACCESS_TOKEN="your-service-role-key"
```

**Not:** MCP zaten aktif ve çalışıyor, bu yüzden muhtemelen Cursor otomatik olarak yapılandırmış.

---

## ❓ Sık Sorulan Sorular

### 1. Supabase Dashboard'da Environment Variable Ayarlamalı mıyım?

**Hayır!** Supabase Dashboard'da environment variable ayarlamaya gerek yok. Supabase sadece:
- Veritabanı olarak kullanılıyor
- Auth servisi olarak kullanılıyor
- Storage olarak kullanılabilir (şu an kullanılmıyor)

Bunny.net, Stripe gibi servisler **Next.js uygulamanızda** çalışır, Supabase'de değil.

### 2. Bunny.net için Supabase'de Ne Yapmalıyım?

**Hiçbir şey!** Bunny.net:
- Next.js API route'larından çağrılır
- `.env.local` dosyasındaki credentials'ları kullanır
- Supabase ile doğrudan ilgisi yok

### 3. MCP için Supabase Credentials Gerekli mi?

**Evet, ama zaten yapılandırılmış!** MCP aktif ve çalışıyor, bu yüzden credentials'lar zaten ayarlanmış.

### 4. Hangi Dosyada Hangi Değişkenler Kullanılıyor?

| Değişken | Dosya | Açıklama |
|----------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `src/lib/supabase/*.ts` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `src/lib/supabase/*.ts` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side işlemler | Admin yetkileri |
| `BUNNY_STREAM_API_KEY` | `src/lib/bunny/stream.ts` | Bunny.net API key |
| `BUNNY_STREAM_LIBRARY_ID` | `src/lib/bunny/stream.ts` | Bunny.net Library ID |
| `NEXT_PUBLIC_BUNNY_CDN_URL` | `src/lib/bunny/stream.ts` | CDN URL (opsiyonel) |
| `STRIPE_SECRET_KEY` | `src/app/api/checkout/route.ts` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-side | Stripe public key |

---

## ✅ Kontrol Listesi

- [x] `.env.local` dosyası proje root'unda
- [x] `BUNNY_STREAM_API_KEY` doğru isimle tanımlı
- [x] `BUNNY_STREAM_LIBRARY_ID` doğru isimle tanımlı
- [x] `NEXT_PUBLIC_SUPABASE_URL` tanımlı
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY` tanımlı
- [x] Supabase MCP aktif (zaten çalışıyor)

---

## 🔧 Sorun Giderme

### "Video service not configured" hatası

1. `.env.local` dosyasını kontrol edin
2. Değişken isimlerinin doğru olduğundan emin olun:
   - ✅ `BUNNY_STREAM_API_KEY` (doğru)
   - ❌ `BUNNY_API_KEY` (yanlış)
3. Sunucuyu yeniden başlatın: `npm run dev`

### Supabase bağlantı hatası

1. `NEXT_PUBLIC_SUPABASE_URL` doğru mu?
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` doğru mu?
3. Supabase project'iniz aktif mi?

### MCP çalışmıyor

1. Cursor'ı yeniden başlatın
2. MCP yapılandırmasını kontrol edin
3. System environment variable'larını kontrol edin

