-- Hızlı Test Videosu Ekleme SQL Script
-- 
-- Bu script, test amaçlı bir film oluşturur ve approved durumuna getirir.
-- Gerçek video ID'si olmadan UI testleri için kullanılabilir.
--
-- Kullanım:
-- 1. Supabase SQL Editor'da çalıştırın
-- 2. YOUR_PRODUCER_USER_ID'yi gerçek producer user ID ile değiştirin
-- 3. İsterseniz bunny_video_id'yi gerçek bir video ID ile değiştirin

-- Önce producer user ID'yi bulun
-- SELECT id, email, role FROM profiles WHERE role = 'producer' LIMIT 1;

-- Test filmi oluştur
INSERT INTO movies (
    producer_id,
    title,
    description,
    genre,
    release_year,
    bunny_video_id,
    status,
    tags,
    featured,
    created_at,
    updated_at
) VALUES (
    'YOUR_PRODUCER_USER_ID',  -- Buraya gerçek producer user ID'yi yazın
    'Test Film - Bağımsız Sinema',
    'Bu bir test filmidir. Gerçek video içeriği için Bunny.net üzerinden video yüklenmelidir.',
    'drama',
    2024,
    NULL,  -- Gerçek video yüklendiğinde buraya video ID gelecek
    'approved',  -- Direkt approved yapıyoruz, admin onayı gerekmez
    ARRAY['test', 'bağımsız', 'sinema'],
    false,
    NOW(),
    NOW()
)
RETURNING id, title, status;

-- Birden fazla test filmi için (farklı kategorilerde)
INSERT INTO movies (
    producer_id,
    title,
    description,
    genre,
    release_year,
    bunny_video_id,
    status,
    tags,
    created_at,
    updated_at
) VALUES 
    (
        'YOUR_PRODUCER_USER_ID',
        'Test Film - Komedi',
        'Komedi kategorisinde test filmi',
        'comedy',
        2024,
        NULL,
        'approved',
        ARRAY['komedi', 'test'],
        NOW(),
        NOW()
    ),
    (
        'YOUR_PRODUCER_USER_ID',
        'Test Film - Gerilim',
        'Gerilim kategorisinde test filmi',
        'thriller',
        2024,
        NULL,
        'approved',
        ARRAY['gerilim', 'test'],
        NOW(),
        NOW()
    ),
    (
        'YOUR_PRODUCER_USER_ID',
        'Test Film - Belgesel',
        'Belgesel kategorisinde test filmi',
        'documentary',
        2024,
        NULL,
        'approved',
        ARRAY['belgesel', 'test'],
        NOW(),
        NOW()
    )
RETURNING id, title, genre, status;

-- Oluşturulan filmleri kontrol et
SELECT 
    id,
    title,
    genre,
    status,
    bunny_video_id,
    created_at
FROM movies
WHERE producer_id = 'YOUR_PRODUCER_USER_ID'
ORDER BY created_at DESC;

