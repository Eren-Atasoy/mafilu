# MAFILU Rol Sistemi Rehberi

## 🔐 Rol Sistemi Nasıl Çalışıyor?

### Rol Tipleri

Sistemde 4 rol tipi var:

1. **`viewer`** (Varsayılan)
   - Standart kullanıcı
   - Film izleyebilir, yorum yapabilir, beğenebilir
   - **Video yükleyemez**

2. **`producer`**
   - Film yükleyebilir
   - Producer Studio'ya erişebilir
   - Analytics görebilir
   - Kazanç takibi yapabilir

3. **`admin`**
   - Producer yetkileri + Admin Panel
   - Film onaylama/reddetme
   - Kullanıcı yönetimi

4. **`super_admin`**
   - Tüm yetkiler
   - Sistem yapılandırması

### Rol Kontrolü Nasıl Yapılıyor?

#### 1. Database Yapısı

```sql
-- profiles tablosunda role kolonu var
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    role user_role DEFAULT 'viewer' NOT NULL,  -- 👈 Burada rol saklanıyor
    ...
);
```

#### 2. API Route Kontrolü

```typescript
// src/app/api/videos/upload/route.ts
const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

if (profile?.role !== "producer" && profile?.role !== "admin") {
    return NextResponse.json(
        { error: "Only producers can upload videos" },
        { status: 403 }
    );
}
```

**Yani sistem:**
1. Giriş yapan kullanıcının ID'sini alıyor
2. `profiles` tablosunda bu ID'ye sahip kaydı buluyor
3. `role` kolonunu kontrol ediyor
4. Eğer `producer` veya `admin` değilse, hata veriyor

### Mevcut Rolünüzü Kontrol Etme

#### Yöntem 1: Supabase Dashboard

1. Supabase Dashboard'a gidin
2. **Table Editor** → **profiles** tablosunu açın
3. Email'inize göre arayın
4. `role` kolonunu kontrol edin

#### Yöntem 2: SQL Query

```sql
-- Email'inize göre rolünüzü kontrol edin
SELECT id, email, role, full_name 
FROM profiles 
WHERE email = 'your-email@example.com';
```

#### Yöntem 3: Browser Console

Tarayıcı console'unda (F12):

```javascript
// Supabase client ile kontrol
const { data } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', (await supabase.auth.getUser()).data.user.id)
  .single();
console.log('Mevcut rol:', data.role);
```

### Rolünüzü Producer Yapma

#### Yöntem 1: Supabase SQL Editor (Önerilen)

1. Supabase Dashboard → **SQL Editor**
2. Şu SQL'i çalıştırın:

```sql
-- Email'inize göre rolü producer yap
UPDATE profiles 
SET role = 'producer'
WHERE email = 'your-email@example.com';

-- Kontrol et
SELECT id, email, role, full_name 
FROM profiles 
WHERE email = 'your-email@example.com';
```

#### Yöntem 2: User ID ile

```sql
-- User ID'nizi bulun
SELECT id, email, role FROM profiles WHERE email = 'your-email@example.com';

-- User ID ile güncelleyin
UPDATE profiles 
SET role = 'producer'
WHERE id = 'your-user-id-here';
```

#### Yöntem 3: Tüm Kullanıcıları Producer Yap (Test için)

```sql
-- DİKKAT: Bu tüm kullanıcıları producer yapar!
UPDATE profiles 
SET role = 'producer';
```

### Signup'ta Rol Nasıl Belirleniyor?

Yeni kullanıcı kaydolduğunda:

1. `auth.users` tablosuna kayıt oluşur
2. `handle_new_user()` trigger'ı çalışır
3. `profiles` tablosuna kayıt oluşur
4. **Varsayılan rol: `viewer`** (otomatik)

```sql
-- Trigger fonksiyonu
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    -- role DEFAULT 'viewer' olduğu için otomatik viewer olur
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;
```

### Gelecekte: Producer Onboarding Flow

Şu anda manuel rol değiştirme gerekiyor, ama gelecekte şunlar eklenebilir:

1. **Producer Başvuru Formu**
   - Kullanıcı producer olmak için başvuru yapar
   - Admin onaylar

2. **Subscription-Based**
   - "Producer Pro" planına abone olanlar otomatik producer olur

3. **Self-Service**
   - Kullanıcı kendi rolünü değiştirebilir (güvenlik riski!)

### Hızlı Test: Kendinizi Producer Yapın

```sql
-- 1. Email'inizi değiştirin ve çalıştırın
UPDATE profiles 
SET role = 'producer'
WHERE email = 'your-email@example.com';

-- 2. Çıkış yapıp tekrar giriş yapın (session refresh için)
-- 3. Artık video yükleyebilirsiniz!
```

### Sorun Giderme

#### "Only producers can upload videos" hatası alıyorum

1. **Rolünüzü kontrol edin:**
   ```sql
   SELECT role FROM profiles WHERE email = 'your-email@example.com';
   ```

2. **Eğer `viewer` ise, producer yapın:**
   ```sql
   UPDATE profiles SET role = 'producer' WHERE email = 'your-email@example.com';
   ```

3. **Çıkış yapıp tekrar giriş yapın** (session refresh)

4. **Browser cache'i temizleyin** (Ctrl+Shift+Delete)

#### Profil kaydım yok

Eğer `profiles` tablosunda kaydınız yoksa:

```sql
-- Manuel profil oluştur
INSERT INTO profiles (id, email, role)
SELECT id, email, 'producer'
FROM auth.users
WHERE email = 'your-email@example.com';
```

### Güvenlik Notları

⚠️ **Production'da:**
- Rol değişiklikleri admin tarafından yapılmalı
- Self-service rol değiştirme güvenlik riski oluşturur
- RLS (Row Level Security) politikaları rol kontrolü yapar

✅ **Development/Test'te:**
- SQL ile manuel rol değiştirme kabul edilebilir
- Hızlı test için tüm kullanıcıları producer yapabilirsiniz

