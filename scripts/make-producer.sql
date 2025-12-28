-- Hızlı Producer Yapma Script
-- 
-- Kullanım:
-- 1. YOUR_EMAIL_HERE kısmını kendi email'inizle değiştirin
-- 2. Supabase SQL Editor'da çalıştırın
-- 3. Çıkış yapıp tekrar giriş yapın

-- Email'e göre producer yap
UPDATE profiles 
SET role = 'producer'
WHERE email = 'YOUR_EMAIL_HERE';

-- Kontrol et
SELECT 
    id,
    email,
    role,
    full_name,
    created_at
FROM profiles 
WHERE email = 'YOUR_EMAIL_HERE';

-- Başarı mesajı
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM profiles WHERE email = 'YOUR_EMAIL_HERE' AND role = 'producer') THEN
        RAISE NOTICE '✅ Rol başarıyla producer olarak güncellendi!';
        RAISE NOTICE '📝 Lütfen çıkış yapıp tekrar giriş yapın.';
    ELSE
        RAISE WARNING '⚠️ Email bulunamadı veya güncelleme başarısız!';
    END IF;
END $$;

