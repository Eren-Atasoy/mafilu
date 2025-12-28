# Vercel Environment Variables Kurulum Rehberi

## 🚨 Sorun: "Video service not configured" Hatası

Bu hata, Vercel'de **Bunny.net environment variables**'ların ayarlanmamış olmasından kaynaklanıyor.

## ✅ Çözüm: Vercel'de Environment Variables Ekleyin

### Adım 1: Vercel Dashboard'a Gidin

1. https://vercel.com/dashboard adresine gidin
2. **Projenizi seçin** (mafilu)

### Adım 2: Environment Variables Sekmesine Gidin

1. Proje sayfasında **"Settings"** sekmesine tıklayın
2. Sol menüden **"Environment Variables"** seçeneğine tıklayın

### Adım 3: Bunny.net Değişkenlerini Ekleyin

Aşağıdaki **3 değişkeni** ekleyin:

#### 1. BUNNY_STREAM_API_KEY
- **Key:** `BUNNY_STREAM_API_KEY`
- **Value:** `53022211-38c7-4a29-9a1a403f38e7-641a-4ebc` (veya production API key'iniz)
- **Environment:** ✅ Production, ✅ Preview, ✅ Development (hepsini seçin)

#### 2. BUNNY_STREAM_LIBRARY_ID
- **Key:** `BUNNY_STREAM_LIBRARY_ID`
- **Value:** `570775`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development (hepsini seçin)

#### 3. NEXT_PUBLIC_BUNNY_CDN_URL
- **Key:** `NEXT_PUBLIC_BUNNY_CDN_URL`
- **Value:** `vz-570775.b-cdn.net`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development (hepsini seçin)

### Adım 4: Diğer Gerekli Değişkenler

Aşağıdaki değişkenlerin de ekli olduğundan emin olun:

#### Supabase
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

#### Stripe (Opsiyonel - şimdilik atlayabilirsiniz)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_BASIC_PRICE_ID`
- `STRIPE_PREMIUM_PRICE_ID`
- `STRIPE_PRODUCER_PRICE_ID`

#### App
- `NEXT_PUBLIC_APP_URL` (örn: `https://your-domain.vercel.app`)

### Adım 5: Deploy'u Yeniden Başlatın

Environment variables ekledikten sonra:

1. **"Deployments"** sekmesine gidin
2. En son deployment'ın yanındaki **"..."** menüsüne tıklayın
3. **"Redeploy"** seçeneğini seçin
4. Veya yeni bir commit push edin (otomatik deploy başlar)

## 🔍 Kontrol Listesi

- [ ] `BUNNY_STREAM_API_KEY` eklendi
- [ ] `BUNNY_STREAM_LIBRARY_ID` eklendi
- [ ] `NEXT_PUBLIC_BUNNY_CDN_URL` eklendi
- [ ] Tüm environment'lar için seçildi (Production, Preview, Development)
- [ ] Deploy yeniden başlatıldı

## ⚠️ Önemli Notlar

1. **Environment Seçimi:** Her değişken için **Production, Preview, ve Development** hepsini seçin. Aksi halde sadece seçtiğiniz environment'ta çalışır.

2. **Production API Key:** Production'da **farklı bir API key** kullanmanız önerilir. Test key'ini production'da kullanmayın.

3. **Deploy Sonrası:** Environment variables ekledikten sonra **mutlaka redeploy yapın**. Yeni değişkenler sadece yeni deploy'larda aktif olur.

4. **Değişken İsimleri:** Değişken isimlerinin **tam olarak** aynı olduğundan emin olun:
   - ✅ `BUNNY_STREAM_API_KEY` (doğru)
   - ❌ `BUNNY_API_KEY` (yanlış)
   - ❌ `BUNNY_STREAM_KEY` (yanlış)

## 🐛 Sorun Giderme

### Hala "Video service not configured" hatası alıyorsanız:

1. **Değişken isimlerini kontrol edin:**
   - Vercel Dashboard'da değişken isimlerinin tam olarak doğru olduğundan emin olun
   - Boşluk veya ekstra karakter olmamalı

2. **Environment seçimini kontrol edin:**
   - Her değişken için Production, Preview, Development hepsinin seçili olduğundan emin olun

3. **Redeploy yapın:**
   - Environment variables ekledikten sonra mutlaka redeploy yapın
   - Yeni commit push edin veya manuel redeploy yapın

4. **Değişken değerlerini kontrol edin:**
   - API key ve Library ID'nin doğru olduğundan emin olun
   - `.env.local` dosyanızdaki değerlerle aynı olmalı

5. **Build loglarını kontrol edin:**
   - Vercel Dashboard → Deployments → Son deployment → "Build Logs"
   - Hata mesajlarını kontrol edin

## 📸 Görsel Rehber

### Vercel Dashboard'da Environment Variables Ekleme:

1. **Settings → Environment Variables**
2. **"Add New"** butonuna tıklayın
3. **Key** ve **Value** alanlarını doldurun
4. **Environment** seçeneklerini işaretleyin (Production, Preview, Development)
5. **"Save"** butonuna tıklayın

### Örnek Ekran Görüntüsü:

```
Key: BUNNY_STREAM_API_KEY
Value: 53022211-38c7-4a29-9a1a403f38e7-641a-4ebc
Environment: ☑ Production  ☑ Preview  ☑ Development
```

## ✅ Başarı Kontrolü

Environment variables doğru ayarlandıktan sonra:

1. Vercel'de yeni bir deploy başlatın
2. Deploy tamamlandıktan sonra production URL'inize gidin
3. Video yükleme sayfasını test edin
4. Artık "Video service not configured" hatası almamalısınız

## 📞 Destek

Sorun devam ederse:
- Vercel Dashboard → Deployments → Build Logs'u kontrol edin
- Environment variables'ların doğru eklendiğini tekrar kontrol edin
- Vercel support'a başvurun

