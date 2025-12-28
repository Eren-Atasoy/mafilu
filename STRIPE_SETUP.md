# Stripe Test API Keys Setup

## Önemli Not

Stripe test key'leri kullanmak için **ücretsiz bir Stripe hesabı** oluşturmanız gerekiyor. Test key'leri gerçek bir Stripe hesabı olmadan çalışmaz.

## Adımlar

### 1. Stripe Hesabı Oluştur

1. [Stripe Dashboard](https://dashboard.stripe.com/register) adresine gidin
2. Ücretsiz hesap oluşturun (sadece email gerekli)
3. Hesabınızı doğrulayın

### 2. Test API Key'lerini Al

1. [Stripe Test API Keys](https://dashboard.stripe.com/test/apikeys) sayfasına gidin
2. **Secret key** ve **Publishable key** değerlerini kopyalayın
3. Webhook secret için:
   - [Webhooks](https://dashboard.stripe.com/test/webhooks) sayfasına gidin
   - "Add endpoint" butonuna tıklayın
   - Endpoint URL'i girin: `http://localhost:3000/api/webhooks/stripe`
   - "Signing secret" değerini kopyalayın

### 3. .env.local Dosyasını Oluştur

Proje root dizininde `.env.local` dosyası oluşturun:

```bash
# Windows PowerShell
New-Item -Path .env.local -ItemType File

# Linux/Mac
touch .env.local
```

### 4. Stripe Products ve Prices Oluştur

Stripe'da subscription plan'ları için products ve prices oluşturmanız gerekiyor:

1. [Stripe Products](https://dashboard.stripe.com/test/products) sayfasına gidin
2. Her plan için bir product oluşturun:
   - **Basic Plan**: 49.99 TRY/month
   - **Premium Plan**: 99.99 TRY/month
   - **Producer Pro Plan**: 199.99 TRY/month
3. Her product için bir price oluşturun (recurring, monthly)
4. Price ID'lerini kopyalayın (örn: `price_1ABC...`)

### 5. Environment Variables Ekleyin

`.env.local` dosyasına aşağıdaki değerleri ekleyin (kendi key'lerinizle değiştirin):

```env
# Stripe Test Keys
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Stripe Price IDs (Products > Prices > Copy Price ID)
STRIPE_BASIC_PRICE_ID=price_YOUR_BASIC_PRICE_ID
STRIPE_PREMIUM_PRICE_ID=price_YOUR_PREMIUM_PRICE_ID
STRIPE_PRODUCER_PRICE_ID=price_YOUR_PRODUCER_PRICE_ID
```

### 5. Test Key Formatı

Stripe test key'leri şu formatlarda olmalı:

- **Secret key**: `sk_test_...` ile başlar (51 karakter)
- **Publishable key**: `pk_test_...` ile başlar (51 karakter)
- **Webhook secret**: `whsec_...` ile başar

### 6. Test Kartları

Stripe test modunda aşağıdaki test kartlarını kullanabilirsiniz:

| Kart Numarası         | Sonuç           |
| --------------------- | --------------- |
| `4242 4242 4242 4242` | Başarılı ödeme  |
| `4000 0000 0000 0002` | Kart reddedildi |
| `4000 0000 0000 9995` | Yetersiz bakiye |

**CVV**: Herhangi bir 3 haneli sayı (örn: 123)  
**Tarih**: Gelecekteki herhangi bir tarih (örn: 12/25)

### 7. Doğrulama

Development server'ı yeniden başlatın:

```bash
npm run dev
```

Stripe yapılandırması kontrol edilecek ve hata mesajları daha anlamlı olacak.

## Sorun Giderme

### "STRIPE_SECRET_KEY is not configured" Hatası

- `.env.local` dosyasının proje root dizininde olduğundan emin olun
- Environment variable'ların doğru yazıldığından emin olun
- Development server'ı yeniden başlatın

### "Invalid API Key" Hatası

- Key'lerin `sk_test_` veya `pk_test_` ile başladığından emin olun
- Key'lerin tam olarak kopyalandığından emin olun (boşluk olmamalı)
- Stripe dashboard'dan key'leri tekrar kontrol edin

### Test Ödemeleri Çalışmıyor

- Stripe dashboard'da test modunda olduğunuzdan emin olun
- Test kartlarını kullanın (yukarıdaki tabloya bakın)
- Webhook endpoint'inin doğru yapılandırıldığından emin olun

## Daha Fazla Bilgi

- [Stripe Test Mode Documentation](https://stripe.com/docs/testing)
- [Stripe API Keys Documentation](https://docs.stripe.com/api/authentication)
- [Stripe Test Cards](https://stripe.com/docs/testing#cards)
