# Bunny.net Kurulum Rehberi

## Adım 1: Bunny.net Hesabı Oluştur

1. https://bunny.net adresine gidin
2. Ücretsiz hesap oluşturun (ilk 1GB ücretsiz)

## Adım 2: Stream Library Oluştur

1. Dashboard'da **"Stream"** sekmesine gidin
2. **"Create Library"** butonuna tıklayın
3. Library adını girin (örn: "Mafilu Videos")
4. **"Create"** butonuna tıklayın

## Adım 3: API Key ve Library ID'yi Alın

1. Oluşturduğunuz library'ye tıklayın
2. **"API"** sekmesine gidin
3. **"API Key"** değerini kopyalayın
4. **"Library ID"** değerini kopyalayın (URL'de de görünür: `/library/{LIBRARY_ID}`)

## Adım 4: .env.local Dosyasına Ekleyin

`.env.local` dosyanıza şu satırları ekleyin:

```env
BUNNY_STREAM_API_KEY=your_api_key_here
BUNNY_STREAM_LIBRARY_ID=your_library_id_here
NEXT_PUBLIC_BUNNY_CDN_URL=vz-{library_id}.b-cdn.net
```

**Not:** `NEXT_PUBLIC_BUNNY_CDN_URL` için library ID'nizi kullanın. Örnek: `vz-12345678.b-cdn.net`

## Adım 5: Ayarları Kontrol Edin

```bash
node scripts/check-bunny-config.js
```

## Adım 6: Test Videosu Yükleyin

1. Producer hesabıyla giriş yapın
2. `/dashboard/movies/upload` sayfasına gidin
3. Film bilgilerini doldurun
4. Video dosyasını seçin ve yükleyin
5. Admin panelinden filmi onaylayın

## Test Videosu İndirme

Küçük bir test videosu için:

- [Big Buck Bunny (10MB)](https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4)
- [Sample Videos](https://sample-videos.com/) - Çeşitli boyutlarda

## Sorun Giderme

### "Video service not configured" hatası

- `.env.local` dosyasının doğru yerde olduğundan emin olun
- Değişken isimlerinin doğru olduğunu kontrol edin
- Sunucuyu yeniden başlatın: `npm run dev`

### "Failed to create video entry" hatası

- API Key'in doğru olduğundan emin olun
- Library ID'nin doğru olduğundan emin olun
- Bunny.net dashboard'da library'nin aktif olduğunu kontrol edin
