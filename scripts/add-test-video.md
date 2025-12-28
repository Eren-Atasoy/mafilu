# Test Videosu Ekleme Rehberi

## Senaryo 1: Gerçek Video Yükleme (Önerilen)

### Adımlar:

1. **Bunny.net Ayarlarını Kontrol Et**
   - `.env.local` dosyasında şunlar olmalı:
     ```
     BUNNY_STREAM_API_KEY=your_api_key
     BUNNY_STREAM_LIBRARY_ID=your_library_id
     NEXT_PUBLIC_BUNNY_CDN_URL=your_cdn_url
     ```

2. **Producer Hesabıyla Giriş Yap**
   - `/login` sayfasından producer rolüne sahip bir hesapla giriş yap

3. **Yeni Film Oluştur**
   - `/dashboard/movies/upload` veya `/movies/new` sayfasına git
   - Film bilgilerini doldur:
     - Başlık: "Test Film 1"
     - Açıklama: "Test amaçlı film"
     - Kategori: drama
     - Yapım Yılı: 2024
   - "Taslak Olarak Kaydet" veya "İncelemeye Gönder" butonuna tıkla

4. **Video Yükle**
   - Edit sayfasında video yükleme bölümüne git
   - Test videosu seç (küçük bir MP4 dosyası, örn: 10-50MB)
   - Upload butonuna tıkla
   - Upload tamamlanana kadar bekle

5. **Film Durumunu Güncelle**
   - Admin panelinden (`/admin/movies`) filmi bul
   - "Onayla" butonuna tıkla
   - Film artık `approved` durumunda ve `bunny_video_id` dolu olacak

## Senaryo 2: Manuel DB Güncelleme (Hızlı Test)

Eğer sadece test etmek istiyorsanız, mevcut bir filme manuel olarak `bunny_video_id` ekleyebilirsiniz:

### Supabase SQL Editor'da:

```sql
-- Mevcut bir filme test video ID'si ekle
UPDATE movies 
SET 
  bunny_video_id = 'test-video-guid-12345',
  status = 'approved'
WHERE id = 'your-movie-id';

-- Veya yeni bir test filmi oluştur
INSERT INTO movies (
  producer_id,
  title,
  description,
  genre,
  release_year,
  bunny_video_id,
  status,
  created_at
) VALUES (
  'your-producer-user-id',
  'Test Film',
  'Test açıklaması',
  'drama',
  2024,
  'test-video-guid-12345',
  'approved',
  NOW()
);
```

**Not:** Bu yöntemde gerçek video oynatılamaz, sadece UI testleri için kullanılabilir.

## Senaryo 3: Test Videosu İndirme

Küçük bir test videosu için:
- [Big Buck Bunny](https://test-videos.co.uk/big-buck-bunny/) - Açık kaynak test videosu
- [Sample Videos](https://sample-videos.com/) - Çeşitli format ve boyutlarda

## Önerilen Yaklaşım

1. **Kısa vadede:** Senaryo 2 ile hızlı test verisi ekle
2. **Uzun vadede:** Senaryo 1 ile gerçek video yükleme akışını test et

