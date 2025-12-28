# Bunny.net Direct Upload Çözümü

## Sorun

Videolar Bunny.net'e geliyor ama 0 Bytes gösteriyor ve "Uploading" durumunda kalıyor. Bu, dosyanın tam yüklenmediği anlamına geliyor.

## Neden

1. **Vercel Timeout:** Vercel serverless function'ları maksimum 60 saniye çalışabilir. Büyük video dosyaları için bu yeterli değil.
2. **Proxy Upload:** Şu anki sistem browser → Next.js API → Bunny.net şeklinde çalışıyor. Bu ekstra gecikme yaratıyor.
3. **Memory Limit:** Tüm dosyayı ArrayBuffer'a yüklemek memory sorunlarına yol açabilir.

## Çözüm: Direct Upload

Browser'dan **direkt Bunny.net'e** upload yapmalıyız. Bu şekilde:
- ✅ Vercel timeout sorunu olmaz
- ✅ Daha hızlı upload
- ✅ Progress tracking daha iyi çalışır
- ✅ Büyük dosyalar için uygun

## Nasıl Çalışır?

1. **POST /api/videos/upload** → Video entry oluşturur ve upload URL'i döner
2. **Browser → Bunny.net** → Dosya direkt Bunny.net'e yüklenir (TUS protokolü)
3. **Webhook veya Polling** → Upload tamamlandığında bildirim alınır

## Geçici Çözüm (Şimdilik)

Bunny.net dashboard'da "Error" durumundaki videoları silin ve tekrar yüklemeyi deneyin. Küçük bir test videosu (< 50MB) ile test edin.

## Kalıcı Çözüm (Yapılacak)

Direct upload implementasyonu gerekiyor. Bu, frontend kodunda değişiklik gerektirir.

