# Bunny.net Video Upload Sorun Giderme

## "Invalid file. Cannot load file temp/..." Hatası

Bu hata genellikle şu durumlarda oluşur:

### 1. Video Yükleme Tamamlanmadan İşleme Başlıyor

**Sorun:** Video dosyası tamamen yüklenmeden önce Bunny.net video'yu işlemeye çalışıyor.

**Çözüm:**
- Video yükleme işleminin tamamen tamamlandığından emin olun
- Yükleme sonrası video durumunu kontrol edin: `/api/videos/[id]/status`

### 2. Video Formatı Desteklenmiyor

**Desteklenen Formatlar:**
- MP4 (H.264 codec)
- WebM
- MOV
- AVI

**Önerilen Format:** MP4 (H.264, AAC audio)

### 3. Video Dosyası Bozuk veya Eksik

**Kontrol:**
- Video dosyasının tamamen yüklendiğinden emin olun
- Dosya boyutunu kontrol edin (0 byte olmamalı)
- Video dosyasını başka bir player'da test edin

### 4. Bunny.net API Hatası

**Kontrol:**
- Bunny.net Dashboard'da video durumunu kontrol edin
- API key ve Library ID'nin doğru olduğundan emin olun
- Bunny.net servis durumunu kontrol edin

## Video Yükleme İşlemi

### Adım 1: Video Entry Oluşturma
```typescript
POST /api/videos/upload
{
  "title": "Film Adı",
  "movieId": "movie-uuid"
}
```

### Adım 2: Video Dosyasını Yükleme
```typescript
PUT /api/videos/[videoId]/upload
Content-Type: video/mp4
[Video file binary data]
```

### Adım 3: Video Durumunu Kontrol Etme
```typescript
GET /api/videos/[videoId]/status
```

## Hata Mesajları ve Çözümleri

| Hata | Neden | Çözüm |
|------|-------|-------|
| "Invalid file. Cannot load file temp/..." | Video yükleme tamamlanmamış | Yükleme işlemini bekleyin, sonra tekrar deneyin |
| "Video service not configured" | Environment variables eksik | `.env.local` dosyasını kontrol edin |
| "Only producers can upload videos" | Kullanıcı producer değil | Kullanıcı rolünü producer yapın |
| "Upload to provider failed" | Bunny.net API hatası | API key ve Library ID'yi kontrol edin |

## Önerilen Video Ayarları

- **Format:** MP4
- **Codec:** H.264 (video), AAC (audio)
- **Çözünürlük:** 1080p veya 4K
- **Bitrate:** 5-10 Mbps (1080p), 15-25 Mbps (4K)
- **Frame Rate:** 24, 25, veya 30 fps
- **Aspect Ratio:** 16:9

## Test Etme

1. Küçük bir test videosu yükleyin (< 100MB)
2. Yükleme tamamlandıktan sonra video durumunu kontrol edin
3. Video işlendikten sonra embed URL'i test edin

## Destek

Sorun devam ederse:
1. Browser console'da hata mesajlarını kontrol edin
2. Network tab'ında API isteklerini inceleyin
3. Bunny.net Dashboard'da video durumunu kontrol edin

