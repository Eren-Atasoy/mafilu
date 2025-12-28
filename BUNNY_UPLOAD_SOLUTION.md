# Bunny.net Video Upload Sorunu ve Çözümü

## 🔴 Mevcut Sorun

Bunny.net dashboard'da videolar görünüyor ama:
- ❌ 0 Bytes gösteriyor
- ❌ "Uploading" durumunda kalıyor
- ❌ "Error" durumunda olanlar var

## 🔍 Neden Oluyor?

1. **Vercel Timeout:** Vercel serverless function'ları maksimum 60 saniye çalışabilir
2. **Proxy Upload:** Browser → Next.js API → Bunny.net (ekstra gecikme)
3. **Büyük Dosyalar:** Video dosyası tam yüklenmeden timeout oluyor

## ✅ Geçici Çözüm (Şimdilik)

### 1. Bunny.net Dashboard'da Temizlik
- "Error" durumundaki videoları silin
- "Uploading" durumundaki videoları bekleyin (bazen kendiliğinden tamamlanır)

### 2. Küçük Test Videosu ile Deneyin
- **50MB'dan küçük** bir test videosu kullanın
- MP4 formatında (H.264 codec)
- Upload işleminin tamamlanmasını bekleyin

### 3. Upload Sonrası Kontrol
- Upload tamamlandıktan sonra birkaç dakika bekleyin
- Bunny.net video'yu işlemeye başlayacak
- Video hazır olunca "Ready" durumuna geçecek

## 🚀 Kalıcı Çözüm (Yapılacak)

### Direct Upload Implementation

Browser'dan **direkt Bunny.net'e** upload yapmalıyız:

1. **POST /api/videos/upload** → Video entry oluşturur, upload URL döner
2. **Browser → Bunny.net (Direct)** → Dosya direkt yüklenir
3. **Webhook/Polling** → Upload tamamlandığında bildirim

### Avantajları:
- ✅ Vercel timeout sorunu olmaz
- ✅ Daha hızlı upload
- ✅ Büyük dosyalar için uygun
- ✅ Progress tracking daha iyi

## 📋 Şu An Yapılacaklar

1. **Bunny.net Dashboard:**
   - Error durumundaki videoları silin
   - Uploading durumundaki videoları kontrol edin

2. **Test:**
   - Küçük bir test videosu (< 50MB) yükleyin
   - Upload işleminin tamamlanmasını bekleyin
   - Video durumunu kontrol edin

3. **Kontrol:**
   - Browser console'da hata var mı?
   - Network tab'ında upload request'i başarılı mı?
   - Vercel function logs'da timeout var mı?

## 🔧 Debug İçin

Browser console'da şunları kontrol edin:
```javascript
// Upload progress
xhr.upload.onprogress = (e) => {
    console.log(`Upload: ${(e.loaded / e.total * 100).toFixed(2)}%`);
};
```

Vercel function logs'da:
- Timeout hataları
- Upload başarılı mı?
- Dosya boyutu ne kadar?

## ⚠️ Önemli Notlar

- **Büyük dosyalar (> 100MB)** için şu anki sistem çalışmayabilir
- **Direct upload** implementasyonu gerekiyor
- **TUS (resumable upload)** protokolü kullanılabilir

